import { Connection, PublicKey, VersionedTransaction } from "@solana/web3.js";
import { api_jup_quote, api_jup_swap } from "./request";
const RPC_ENDPOINT = "https://mainnet.helius-rpc.com/?api-key=a32e6052-b2ed-491f-9521-ac6df5e9665a";
const connection = new Connection(RPC_ENDPOINT, "confirmed");
const sol = "So11111111111111111111111111111111111111112"
const SPL_PROGRAM_ID = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
const SPL_2022_PROGRAM_ID = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
async function getSolBalance(address: string): Promise<number> {
  const pubkey = new PublicKey(address);
  const balanceLamports = await connection.getBalance(pubkey);
  return balanceLamports; // lamports 转换成 SOL
}

async function getSplBalances(
  ownerAddress: string,
  mintAddress: string
): Promise<number> {
  const owner = new PublicKey(ownerAddress);
  const mint = new PublicKey(mintAddress);

  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(owner, {
    programId: new PublicKey(SPL_PROGRAM_ID),
  });

  for (const { account } of tokenAccounts.value) {
    const info = account.data.parsed.info;
    if (info.mint === mint.toBase58()) {
      return parseFloat(info.tokenAmount.amount);
    }
  }

  const token2022Accounts = await connection.getParsedTokenAccountsByOwner(owner, {
    programId: new PublicKey(SPL_2022_PROGRAM_ID),
  });

  for (const { account } of token2022Accounts.value) {
    const info = account.data.parsed.info;
    if (info.mint === mint.toBase58()) {
      return parseFloat(info.tokenAmount.amount);
    }
  }

  return 0; // 没有该mint账户，余额为0
}

async function jupQuote(from:string,to:string,amountIn:string,slippageBps:string) {
    const quoteResponse = await (
        await fetch(
                `https://lite-api.jup.ag/swap/v1/quote?inputMint=${from}&outputMint=${to}&amount=${amountIn.toString()}&slippageBps=${slippageBps}&restrictIntermediateTokens=true&onlyDirectRoutes=false`
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