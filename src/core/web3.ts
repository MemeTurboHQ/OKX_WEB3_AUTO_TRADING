import { Connection, PublicKey } from "@solana/web3.js";
import { api_jup_quote, api_okx_swap } from "./request";
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

async function jupQuote(from:string,to:string,amountIn:string) {
  const quote = await api_jup_quote(from,to,amountIn)
  if(quote && quote?.inputMint && quote?.routePlan && quote.routePlan?.length > 0)
  {
    return{
      from:quote.inputMint,
      to:quote.outputMint,
      amountIn:quote.inAmount,
      amountOut:quote.outAmount,
      pair:quote.routePlan[0]?.ammKey
    }
  }else{
    return false;
  }
}

async function okxSwapGenerate(from:string,to:string,amountIn:string,amountOut:string,pair:string,user:string) {
  const body = {
    "minimumReceived": Number(amountOut)*0.99,
    "dexRouterList": [
        {
            "percent": "100",
            "router": `${from}--${to}`,
            "subRouterList": [
                {
                    "dexQuoteInfoList": [
                        {
                            "amountOut": amountOut,
                            "blockHeight": 366102132,
                            "dexName": "PumpSwap",
                            "dexShowName": "PumpSwap",
                            "exchangeDirection": "1",
                            "extraInfo": "{\"feeAccount\":\"62qc2CNXwrYqQScmEdiZFFAnJR262PxWEuNQtxfafNgV\",\"fromTokenAccount\":\"HYgtUo6j8Af95giAuppoNXfiyyHJNN6jsbp85Ai66Zp5\",\"coinCreator\":\"WbvN4EyqakrPkbJu7mRAMCHHgEdu4F5m7NJoksd5ELE\",\"amountIn\":0.000991500,\"factoryAddress\":\"pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA\",\"toTokenAccount\":\"4UEFijvgZcAUYqbBMWrctUgFqzcgo3gkMTAddAyEDQYj\"}",
                            "feeRate": "0",
                            "fromTokenIndex": "",
                            "isUnderlying": "",
                            "okLinkUrl": "https://solscan.io/account/JZKUahYSN3oFrRawYpEicvX27DLcPtKANWTx53yr3Fq",
                            "pairAddress": pair,
                            "percent": "100",
                            "poolId": "",
                            "slippage": "0",
                            "sqrtPrice": "",
                            "toTokenContractAddress": "{}",
                            "toTokenIndex": ""
                        }
                    ],
                    "fromToken": {
                        "chainId": 501,
                        "chainLogoUrl": "https://web3.okx.com/cdn/wallet/logo/SOL-20220525.png",
                        "chainName": "Solana",
                        "decimals": 9,
                        "id": 0,
                        "tokenContractAddress": from,
                        "tokenLogoUrl": "https://web3.okx.com/cdn/web3/currency/token/501-So11111111111111111111111111111111111111112-1.png/type=default_350_0?v=1735212244286",
                        "tokenSymbol": "wSOL"
                    },
                    "toToken": {
                        "chainId": 501,
                        "chainLogoUrl": "https://web3.okx.com/cdn/wallet/logo/SOL-20220525.png",
                        "chainName": "Solana",
                        "decimals": 6,
                        "id": 0,
                        "tokenContractAddress": to,
                        "tokenLogoUrl": "https://web3.okx.com/cdn/web3/currency/token/large/501-J8wbDmjJ9sJNptG6sv4TanUtwKTZJBY2joQvsf6pump-108/type=default_90_0?v=1757163438543",
                        "tokenSymbol": "PBJT"
                    }
                }
            ]
        }
    ],
    "slippageType": "1",
    "autoSlippageInfo": {
        "autoSlippage": "0.01"
    },
    "orderSource": "MARKET",
    "traceData": {
        "maxSlippage": "",
        "mevFeeInfo": [],
        "nonMevFeeInfo": null,
        "referenceSlippage": ""
    },
    "chainId": 501,
    "direction": "0",
    "fromTokenAddress": from,
    "fromAmount": amountIn,
    "toTokenAddress": to,
    "toAmount": amountOut,
    "priorityFeeType": 1,
    "priorityFee": "0.0006055",
    "estimateGasFee": "292000",
    "serviceFeeInfo": {
        "discountedServiceFeeRate": "0.0085",
        "faqUrl": "https://web3.okx.com/dex-fees",
        "feeTokenAddress": "11111111111111111111111111111111",
        "isChargeVersion": "1",
        "isDisplayServiceFee": "1",
        "originalServiceFeeRate": "0.0085",
        "refCode": "",
        "referralCommissionAddress": "",
        "referralCommissionRate": "",
        "serviceFeeUsd": "0.001922275"
    },
    "teeSilentSignEnabled": false,
    "fromTokenDecimals": 9,
    "toTokenDecimals": 6,
    "userWalletAddress": user,
    "teeSignMarketRelTs": "60000",
    "teeSignTpslRelTs": "604800000",
    "defiPlatformId": "11",
    "executeSilentSignPreExecInConfirm": false
  }
  const swap = await api_okx_swap(body);
  // if(swap && swap)
}

async function okxSwapSubmiat() {
  
}

async function okxBuy(token:PublicKey,user:PublicKey,amount:number) {
  const from = sol
  const to = token

  const quote = await jupQuote(from,to.toBase58(),amount.toString());
  if(quote)
  {
    const {
      amountIn,
      amountOut,
      pair
    } = quote;
    return await okxSwapGenerate(from,to,amountIn,amountOut,pair,user)
  }
  return false;
}

async function okxSell() {
  
}

export {
  getSolBalance,
  getSplBalances,
  jupQuote,
  okxBuy,
  okxSell
}