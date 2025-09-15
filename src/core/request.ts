/**
 * Front-end fetch syste,
 */

const baseApi = "https://api.memeturbo.fun/"
const request_router = {
    search:"lts",
    spot:{
        pump:"spot/pump",
        jup:"spot/jup"
    },
    leverage:{
        pump:"leverage/pump",
        jup:"leverage/jup"
    },
    clone:{
        info:"info",
        clone:"clone",
        create:"create"
    },
    profile:"profile",
    keypair:"keypair"
};

async function requester(url: string, requestOptions: any) {
  try {
    return (await fetch(url, requestOptions)).json();
  } catch (e) {
    console.log("🐞 req error", e);
  }

  return false;
}

function request_method_get(headers: any) {
  var requestOptions = {
    method: "GET",
    headers: headers,
    redirect: "follow",
  };

  return requestOptions;
}

function request_method_post(bodys: any, headers: any) {
  var requestOptions = {
    method: "POST",
    headers: headers,
    body: bodys,
    redirect: "follow",
  };

  return requestOptions;
}

function request_get_unauth() {
  return request_method_get({});
}

function request_post_unauth(data: any) {
  var h = new Headers();

  h.append("Content-Type", "application/json");

  return request_method_post(JSON.stringify(data), h);
}

async function api_search(seed?: string) {
  try {
    let path = baseApi+request_router.search;
    if(seed)
    {
        path+=`?search=${seed}`
    }
    return await requester(
      path,
      request_get_unauth(),
    );
  } catch (e) {
    console.error(e);

    return [];
  }
}

async function api_pump_spot(mint:string,address:string,amount:string) {
  try {
    return await requester(
      `${baseApi+request_router.spot.pump}`,
      request_post_unauth(
        {
            mint,
            address,
            amount
        }
      ),
    );
  } catch (e) {
    console.error(e);

    return 0;
  }
}
async function api_jup_spot(mint:string,address:string,amount:string) {
  try {
    return await requester(
      `${baseApi+request_router.spot.jup}`,
      request_post_unauth(
        {
            mint,
            address,
            amount
        }
      ),
    );
  } catch (e) {
    console.error(e);

    return 0;
  }
}

async function api_leverage_pump(mint:string,address:string,amount:string) {
  try {
    return await requester(
      `${baseApi+request_router.leverage.pump}`,
      request_post_unauth(
        {
            mint,
            address,
            amount
        }
      ),
    );
  } catch (e) {
    console.error(e);

    return 0;
  }
}

async function api_leverage_jup(mint:string,address:string,amount:string) {
  try {
    return await requester(
      `${baseApi+request_router.leverage.jup}`,
      request_post_unauth(
        {
            mint,
            address,
            amount
        }
      ),
    );
  } catch (e) {
    console.error(e);

    return 0;
  }
}

async function api_info(seed: string) {
  try {
    let path = baseApi+request_router.clone.info;
    path+=`/${seed}`
    return await requester(
      path,
      request_get_unauth(),
    );
  } catch (e) {
    console.error(e);

    return [];
  }
}

async function api_clone(user:string,address:string) {
  try {
    let path = baseApi+request_router.clone.clone;
    path+=`/${address}`
    return await requester(
      path,
      request_post_unauth(
        {
            user
        }
      ),
    );
  } catch (e) {
    console.error(e);

    return 0;
  }
}

async function api_create(user:string,metadata:any) {
  try {
    let path = baseApi+request_router.clone.create;
    return await requester(
      path,
      request_post_unauth(
        {
            user,
            metadata
        }
      ),
    );
  } catch (e) {
    console.error(e);

    return 0;
  }
}


async function api_metadata(url: string) {
  try {
    return await requester(
      url,
      request_get_unauth(),
    );
  } catch (e) {
    console.error(e);

    return [];
  }
}

async function api_profile(seed: string) {
  try {
    let path = baseApi+request_router.profile;
    path+=`/${seed}`
    return await requester(
      path,
      request_get_unauth(),
    );
  } catch (e) {
    console.error(e);

    return [];
  }
}

async function api_keypair(keypair: string) {
  try {
    let path = baseApi+request_router.keypair;
    path+=`/${keypair}`
    return await requester(
      path,
      request_get_unauth(),
    );
  } catch (e) {
    console.error(e);

    return [];
  }
}

async function api_jup_quote() {
  try {
    let path = `https://lite-api.jup.ag/swap/v1/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=GKT7vc3BejEFmJBiWF3GwDXvyN3s57aWwRcUm4Vcpump&amount=100000000&slippageBps=50&restrictIntermediateTokens=true`;
    return await requester(
      path,
      request_get_unauth(),
    );
  } catch (e) {
    console.error(e);

    return [];
  }
}

async function api_okx_swap() {
  try {
    let path = `https://web3.okx.com/priapi/v1/dx/trade/market-trade/prepare-order`;
    return await requester(
      path,
      request_post_unauth(
        {
    "minimumReceived": "1956.401178",
    "dexRouterList": [
        {
            "percent": "100",
            "router": "So11111111111111111111111111111111111111112--J8wbDmjJ9sJNptG6sv4TanUtwKTZJBY2joQvsf6pump",
            "subRouterList": [
                {
                    "dexQuoteInfoList": [
                        {
                            "amountOut": "1976.162807",
                            "blockHeight": 366102132,
                            "dexName": "PumpSwap",
                            "dexShowName": "PumpSwap",
                            "exchangeDirection": "1",
                            "extraInfo": "{\"feeAccount\":\"62qc2CNXwrYqQScmEdiZFFAnJR262PxWEuNQtxfafNgV\",\"fromTokenAccount\":\"HYgtUo6j8Af95giAuppoNXfiyyHJNN6jsbp85Ai66Zp5\",\"coinCreator\":\"WbvN4EyqakrPkbJu7mRAMCHHgEdu4F5m7NJoksd5ELE\",\"amountIn\":0.000991500,\"factoryAddress\":\"pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA\",\"toTokenAccount\":\"4UEFijvgZcAUYqbBMWrctUgFqzcgo3gkMTAddAyEDQYj\"}",
                            "feeRate": "0",
                            "fromTokenIndex": "",
                            "isUnderlying": "",
                            "okLinkUrl": "https://solscan.io/account/JZKUahYSN3oFrRawYpEicvX27DLcPtKANWTx53yr3Fq",
                            "pairAddress": "JZKUahYSN3oFrRawYpEicvX27DLcPtKANWTx53yr3Fq",
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
                        "tokenContractAddress": "So11111111111111111111111111111111111111112",
                        "tokenLogoUrl": "https://web3.okx.com/cdn/web3/currency/token/501-So11111111111111111111111111111111111111112-1.png/type=default_350_0?v=1735212244286",
                        "tokenSymbol": "wSOL"
                    },
                    "toToken": {
                        "chainId": 501,
                        "chainLogoUrl": "https://web3.okx.com/cdn/wallet/logo/SOL-20220525.png",
                        "chainName": "Solana",
                        "decimals": 6,
                        "id": 0,
                        "tokenContractAddress": "J8wbDmjJ9sJNptG6sv4TanUtwKTZJBY2joQvsf6pump",
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
        // "quoteId": "2130276040889630004",
        "referenceSlippage": ""
    },
    "chainId": 501,
    "direction": "0",
    "fromTokenAddress": "11111111111111111111111111111111",
    "fromAmount": "0.001",
    "toTokenAddress": "pumpCmXqMfrsAkQ5r49WcJnRayYRqmXz6ae8H7H9Dfn",
    "toAmount": "1976.162807",
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
    "userWalletAddress": "6QJnyDfQHu1mfCpMiyamBhshbjsAQm9T8baSpHPyrtNe",
    "teeSignMarketRelTs": "60000",
    "teeSignTpslRelTs": "604800000",
    "defiPlatformId": "11",
    "executeSilentSignPreExecInConfirm": false
}
      ),
    );
  } catch (e) {
    console.error(e);

    return [];
  }
}
export {
    api_search,
    api_pump_spot,
    api_jup_spot,
    api_leverage_pump,
    api_leverage_jup,
    api_info,
    api_clone,
    api_metadata,
    api_create,
    api_profile,
    api_keypair,
    api_jup_quote,
    api_okx_swap
};