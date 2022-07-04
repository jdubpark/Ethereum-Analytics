// TODO: auto-fill token info using `lendingPool.getReservesList()` & Etherscan API
const tokenList = {
    // FORMAT: address: [symbol, decimal]
    // stable
    '0xdAC17F958D2ee523a2206206994597C13D831ec7': ['USDT', 6],
    '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48': ['USDC', 6],
    '0x6B175474E89094C44Da98b954EedeAC495271d0F': ['DAI', 18],
    '0x57Ab1ec28D129707052df4dF418D58a2D46d5f51': ['sUSD', 18],
    '0x0000000000085d4780B73119b644AE5ecd22b376': ['TUSD', 18],
    '0x056Fd409E1d7A124BD7017459dFEa2F387b6d5Cd': ['GUSD', 2],
    '0x956F47F50A910163D8BF957Cf5846D573E7f87CA': ['FEI', 18],
    '0xD46bA6D942050d489DBd938a2C909A5d5039A161': ['AMPL', 9],
    '0x03ab458634910AaD20eF5f1C8ee96F1D6ac54919': ['RAI', 18],
    '0x853d955aCEf822Db058eb8505911ED77F175b99e': ['FRAX', 18],
    '0x4Fabb145d64652a948d72533023f6E7A623C7C53': ['BUSD', 18],
    // non-stable
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2': ['WETH', 18],
    '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599': ['WBTC', 8],
    '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84': ['stETH', 18],
    '0xD533a949740bb3306d119CC777fa900bA034cd52': ['CRV', 18],
    '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9': ['AAVE', 18],
    '0x4e3FBD56CD56c3e72c1403e103b45Db9da5B9D2B': ['CVX', 18],
    '0x514910771AF9Ca656af840dff83E8264EcF986CA': ['LINK', 18],
    '0xba100000625a3754423978a60c9317c58a424e3D': ['BAL', 18],
    '0x1494CA1F11D487c2bBe4543E90080AeBa4BA3C2b': ['DPI', 18],
    '0x408e41876cCCDC0F92210600ef50372656052a38': ['REN', 18],
    '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e': ['YFI', 18],
    '0x0F5D2fB29fb7d3CFeE444a200298f468908cC942': ['MANA', 18],
    '0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272': ['xSUSHI', 18],
    '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984': ['UNI', 18],
    '0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72': ['ENS', 18],
    '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F': ['SNX', 18],
    '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2': ['MKR', 18],
}
// const tokenListAddresses = Object.keys(tokenList)

module.exports = {
    tokenList,
}