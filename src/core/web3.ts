import { Connection, PublicKey } from "@solana/web3.js";
const RPC_ENDPOINT = "https://api.mainnet-beta.solana.com";
const connection = new Connection(RPC_ENDPOINT, "confirmed");

/**
 * 获取SOL余额 (单位：SOL)
 * @param address 钱包地址
 */
export async function getSolBalance(address: string): Promise<number> {
  const pubkey = new PublicKey(address);
  const balanceLamports = await connection.getBalance(pubkey);
  return balanceLamports / 1e9; // lamports 转换成 SOL
}

/**
 * 获取SPL代币余额
 * @param address 钱包地址
 */
export async function getSplBalances(address: string): Promise<
  {
    mint: string;   // token mint 地址
    amount: number; // 实际余额（已除以decimals）
    decimals: number;
  }[]
> {
  const pubkey = new PublicKey(address);
  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(pubkey, {
    programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
  });

  return tokenAccounts.value.map((accountInfo) => {
    const data = accountInfo.account.data.parsed.info.tokenAmount;
    return {
      mint: accountInfo.account.data.parsed.info.mint,
      amount: Number(data.uiAmount),
      decimals: data.decimals,
    };
  });
}
