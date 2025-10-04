
import { getSolBalance, getSplBalances, jupBuy, jupSell } from '@/core/web3';
import { Connection, Keypair, PublicKey, Transaction, SystemProgram, sendAndConfirmTransaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import bs58 from 'bs58';
import { OkxServiceClient } from '@/core/ws';
export interface Wallet {
  publicKey: string;
  privateKey: string;
  keypair: Keypair;
  vol:number
  
}

export interface TradeLog {
  id: string;
  timestamp: Date;
  walletAddress: string;
  tokenAddress: string;
  txHash: string;
  status: 'success' | 'failed' | 'pending';
  amount: number;
  type: 'buy' | 'sell';
}

export class SolanaService {
  private connection: Connection;
  private wallets: Wallet[] = [];
  private tokenAddresses: string[] = [];
  private isTrading = false;
  private isTradeLock = false; 
  private tradeInterval: NodeJS.Timeout | null = null;

  private amount:string;
  private slippage:string

  private solPrice:number;

  
  private workingIndex :number = 0;
  constructor() {
    this.connection = new Connection('https://mainnet.helius-rpc.com/?api-key=a32e6052-b2ed-491f-9521-ac6df5e9665a', 'confirmed');
  }

  // 导入私钥
  importPrivateKeys(privateKeysText: string): { success: number; failed: number; errors: string[] } {
    const lines = privateKeysText.split('\n').filter(line => line.trim());
    let success = 0;
    let failed = 0;
    const errors: string[] = [];
    
    this.wallets = []; // 清空现有钱包
    
    lines.forEach((line, index) => {
      try {
        const privateKey = line.trim();
        const secretKey = bs58.decode(privateKey);
        const keypair = Keypair.fromSecretKey(secretKey);
        const publicKey = keypair.publicKey.toBase58();
        
        this.wallets.push({
          publicKey,
          privateKey,
          keypair,
          vol:0
        });
        
        success++;
      } catch (error) {
        failed++;
        errors.push(`第 ${index + 1} 行: ${error instanceof Error ? error.message : '未知错误'}`);
      }
    });
    
    return { success, failed, errors };
  }

  // 设置代币地址
  setTokenAddresses(tokenAddressesText: string): { success: number; failed: number; errors: string[] } {
    const lines = tokenAddressesText.split('\n').filter(line => line.trim());
    let success = 0;
    let failed = 0;
    const errors: string[] = [];
    
    this.tokenAddresses = [];
    
    lines.forEach((line, index) => {
      try {
        const address = line.trim();
        // 验证地址格式
        new PublicKey(address);
        this.tokenAddresses.push(address);
        success++;
      } catch (error) {
        failed++;
        errors.push(`第 ${index + 1} 行: 无效的代币地址`);
      }
    });
    
    return { success, failed, errors };
  }

  setAmount(amt:string){
    this.amount = amt;
  }
  setSlippage(slp:string)
  {
    this.slippage = slp
  }
  updateWorkingIndex()
  {
    this.workingIndex++;
  }
  resetWorkingIndex()
  {
    this.workingIndex=0;
  }
  // 获取钱包余额
  async getWalletBalance(publicKey: string): Promise<number> {
    try {
      const balance = await this.connection.getBalance(new PublicKey(publicKey));
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('获取钱包余额失败:', error);
      return 0;
    }
  }

  // 模拟交易（因为是演示，我们只做模拟交易）
  private async simulateTransaction(
    wallet: Wallet, 
    tokenAddress: string, 
    type: 'buy' | 'sell'
  ): Promise<TradeLog> {
    const tradeId = Math.random().toString(36).substr(2, 9);
    
    // 模拟交易延迟
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 500));
    
    // 随机成功/失败
    const success = Math.random() > 0.1; // 90% 成功率
    
    const tradeLog: TradeLog = {
      id: tradeId,
      timestamp: new Date(),
      walletAddress: wallet.publicKey.substring(0, 8) + '...',
      tokenAddress: tokenAddress.substring(0, 8) + '...',
      txHash: success ? '0x' + Math.random().toString(16).substr(2, 32) : '',
      status: success ? 'success' : 'failed',
      amount: Math.random() * 1000,
      type
    };
    
    return tradeLog;
  }

async getSolPrice(): Promise<number> {
  const url = "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd";

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

    const data = await res.json();
    const price = data?.solana?.usd;

    if (typeof price !== "number") throw new Error("Invalid response format");

    return price;
  } catch (err) {
    console.error("❌ 获取 SOL/USD 价格失败:", err);
    return -1;
  }
}

  async toSolAmount(amount:number): Promise<string> {
    const solPrice = await this.getSolPrice();
    return (amount*1.05/solPrice).toString() //Get max sol should cost
  }

  // 开始交易

async startTrading(isSell: number, onTradeLog: (log: TradeLog) => void): Promise<boolean> {
  console.log("🌼 startTrading ...");
  if (this.wallets.length === 0) {
    return false;
  }

  if (this.tokenAddresses.length === 0) {
    return false;
  }

  this.isTrading = true;
  const usdAmount = this.amount
  this.amount = await this.toSolAmount(Number(this.amount))
  const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

  while (this.isTrading && this.workingIndex < this.wallets.length) {
    try {
      this.updateWorkingIndex();
      console.log("🌼 startTrading trade...", Boolean(isSell), this.amount, this.workingIndex);

      const wallet = this.wallets[this.workingIndex - 1];
      const client = new OkxServiceClient(
        "wss://okx-api.memeturbo.fun",
        wallet.publicKey,
        wallet.keypair,
        this.tokenAddresses,
        this.amount,
        onTradeLog
      );
      wallet.vol = Number(usdAmount)* 1.05;
      await client.connect();
      console.log("连接状态:", client.getStatus());
      await client.waitTillClose();
      console.log("💀 Connection Close");

    } catch (error) {
      console.error("交易执行失败:", error);
    }

    // 等待 3 秒再跑下一个，避免阻塞 UI
    await sleep(3000);
  }

  this.stopTrading();
  this.resetWorkingIndex();
  return true;
}


  // 停止交易
  stopTrading(): void {
    this.isTrading = false;
    if (this.tradeInterval) {
      clearInterval(this.tradeInterval);
      this.tradeInterval = null;
    }
  }

  // 获取状态
  getStatus() {
    return {
      isTrading: this.isTrading,
      walletsCount: this.wallets.length,
      tokensCount: this.tokenAddresses.length,
      wallets: this.wallets.map(w => ({
        publicKey: w.publicKey.substring(0, 8) + '...',
        balance:0,
        vol:0
      }))
    };
  }
async realTimegetStatus() {
  const walletInfos = await Promise.all(
    this.wallets.map(async (w) => ({
      publicKey: w.publicKey.substring(0, 8) + '...',
      balance: (await getSolBalance(w.publicKey))/1e9,
      vol: w.vol,
    }))
  );

  return {
    isTrading: this.isTrading,
    walletsCount: this.wallets.length,
    tokensCount: this.tokenAddresses.length,
    wallets: walletInfos,
  };
}


  // 清理资源
  destroy(): void {
    this.stopTrading();
    this.wallets = [];
    this.tokenAddresses = [];
  }
}