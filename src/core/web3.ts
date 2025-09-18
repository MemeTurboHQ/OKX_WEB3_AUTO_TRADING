import { Connection, PublicKey, VersionedTransaction } from "@solana/web3.js";
import { api_jup_quote, api_jup_swap } from "./request";
const RPC_ENDPOINT = "https://api.mainnet-beta.solana.com";
const connection = new Connection(RPC_ENDPOINT, "confirmed");
const sol = "So11111111111111111111111111111111111111112"
async function getSolBalance(address: string): Promise<number> {
  const pubkey = new PublicKey(address);
  const balanceLamports = await connection.getBalance(pubkey);
  return balanceLamports / 1e9; // lamports 转换成 SOL
}

async function getSplBalances(address: string): Promise<
  {
    mint: string;
    amount: number;
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

async function jupQuote(from:string,to:string,amountIn:string,slippageBps:string) {
    const quoteResponse = await (
        await fetch(
                `https://lite-api.jup.ag/swap/v1/quote?inputMint=${from}&outputMint=${to}&amount=${amountIn.toString()}&slippageBps=$ {slippageBps}&restrictIntermediateTokens=true&onlyDirectRoutes=true`
            )
    ).json();
    return quoteResponse;
}

async function jupSwap(quoteResponse:any, user:PublicKey) {
    const res = await fetch('https://lite-api.jup.ag/swap/v1/swap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      quoteResponse,
      userPublicKey: user.toBase58(),
      computeUnitPriceMicroLamports: 10000,
      slippageBps: 50
    })
  });
  const swapResponse = await res.json();
  if (swapResponse?.swapTransaction) {
    const txBuffer = Buffer.from(swapResponse.swapTransaction, 'base64');
    return VersionedTransaction.deserialize(new Uint8Array(txBuffer));
  }
  return null;
}

async function jupBuy(token:PublicKey , amount:string,slippageBps:string ,user:PublicKey) {
  try{
    const from = sol;
    const to = token.toBase58();

    const quote = await jupQuote(from,to,amount,slippageBps)
    return await jupSwap(quote,user)
  }catch(e)
  {
    console.error(e);
    return false;
  }
}

async function jupSell(token:PublicKey , amount:string,slippageBps:string ,user:PublicKey) {
  try{
    const from = token.toBase58();
    const to =sol ;

    const quote = await jupQuote(from,to,amount,slippageBps)
    return await jupSwap(quote,user)
  }catch(e)
  {
    console.error(e);
    return false;
  }
}

export {
  getSolBalance,
  getSplBalances,
  jupQuote,
  jupSwap,
  jupBuy,
  jupSell
}