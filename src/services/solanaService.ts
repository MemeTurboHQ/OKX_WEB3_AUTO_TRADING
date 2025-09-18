
import { Connection, Keypair, PublicKey, Transaction, SystemProgram, sendAndConfirmTransaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import bs58 from 'bs58';

export interface Wallet {
  publicKey: string;
  privateKey: string;
  keypair: Keypair;
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
  private tradeInterval: NodeJS.Timeout | null = null;
  
  constructor() {
    // 使用 Devnet 进行测试
    this.connection = new Connection('https://api.devnet.solana.com', 'confirmed');
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
          keypair
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

  // 开始交易
  startTrading(onTradeLog: (log: TradeLog) => void): boolean {
    console.log("🌼 startTrading ...")
    if (this.wallets.length === 0) {
      return false;
    }
    
    if (this.tokenAddresses.length === 0) {
      return false;
    }
    this.isTrading = true;
    
    // 每3秒执行一次交易
    this.tradeInterval = setInterval(async () => {
      if (!this.isTrading) return;
      console.log("🌼 startTrading tradeInterval...")
      // const quote = await api_jup_quote()
      console.log("🍺Quote ::")
      const randomWallet = this.wallets[Math.floor(Math.random() * this.wallets.length)];
      const randomToken = this.tokenAddresses[Math.floor(Math.random() * this.tokenAddresses.length)];
      const tradeType = Math.random() > 0.5 ? 'buy' : 'sell';
      

      
      try {
        const tradeLog = await this.simulateTransaction(randomWallet, randomToken, tradeType);
        onTradeLog(tradeLog);
      } catch (error) {
        console.error('交易执行失败:', error);
      }
    }, 3000);
    
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
        balance: 0 // 实时余额需要异步获取
      }))
    };
  }

  // 清理资源
  destroy(): void {
    this.stopTrading();
    this.wallets = [];
    this.tokenAddresses = [];
  }
}