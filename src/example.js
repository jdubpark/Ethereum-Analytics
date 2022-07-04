const { providers, utils, Contract } = require('ethers')

const ABIAvalanchePoolAddressesProvider = require('./contracts/abis/Avalanche/PoolAddressesProvider.json')
const ABIAvalancheUIPoolDataProvider = require('./contracts/abis/Avalanche/UiPoolDataProvider.json')

const AvalancheRPC = 'https://api.avax.network/ext/bc/C/rpc'
const AvalancheChainId = 43114

// deployed code: https://github.com/aave/aave-v3-periphery/blob/master/contracts/misc/UiPoolDataProviderV3.sol
const AvalancheUiPoolDataProviderAddress = '0xdBbFaFC45983B4659E368a3025b81f69Ab6E5093'
// deployed code: https://github.com/aave/aave-v3-core/blob/master/contracts/misc/AaveProtocolDataProvider.sol
const AvalanchePoolDataProviderAddress = '0x69FA688f1Dc47d4B5d8029D5a35FB7a548310654'

// StableFi Manual
const user = '0x3a68bb6f1679b01144f03bfac531760cd45be170'

// Lending Pool Address Provider -> Pool Address Provider (v2 -> v3)
const poolAddressProvider = '0xa97684ead0e402dc232d5a977953df7ecbab3cdb'

// eslint-disable-next-line semi-style
;(async () => {
    const provider = new providers.JsonRpcProvider(AvalancheRPC)
    const contract = new Contract(AvalanchePoolDataProviderAddress, ABIAvalanchePoolAddressesProvider, provider)
    const contractUiPool = new Contract(AvalancheUiPoolDataProviderAddress, ABIAvalancheUIPoolDataProvider, provider)

    const reserveTokens = await contract.getAllReservesTokens()
    const underlyingAssetToSymbol = new Map()
    reserveTokens.forEach(([symbol, tokenAddress]) => {
        underlyingAssetToSymbol.set(tokenAddress, symbol)
    })

    const [userReservesData, userEmodeCategoryId] = await contractUiPool.getUserReservesData(
        poolAddressProvider,
        user,
    )

    console.log(userReservesData)
    userReservesData.forEach((userReserveData) => {
        const [
            underlyingAsset, // address
            scaledATokenBalance, // BigNumber
            usageAsCollateralEnabledOnUser, // bool
            stableBorrowRate, // BigNumber
            scaledVariableDebt, // BigNumber
            principalStableDebt, // BigNumber
            stableBorrowLastUpdateTimestamp, // BigNumber
        ] = userReserveData
        const assetSymbol = underlyingAssetToSymbol.get(underlyingAsset)

        console.log('underlyingAsset', assetSymbol)
        console.log('usageAsCollateralEnabledOnUser', usageAsCollateralEnabledOnUser)
        console.log('stableBorrowLastUpdateTimestamp', stableBorrowLastUpdateTimestamp.toString())

        const prettierTokens = {
            scaledATokenBalance,
            scaledVariableDebt,
            principalStableDebt,
        }
        const prettierRates = {
            stableBorrowRate,
        }

        // token decimals from: https://docs.aave.com/developers/v/1.0/deployed-contracts/deployed-contract-instances
        // rate decimals is 10e-27, set by Aave
        const tokenDecimals = ['usdc', 'usdt'].includes(assetSymbol.toLowerCase()) ? 6 : assetSymbol === 'WBTC' ? 8 : 18
        const rateDecimals = 27
        Object.keys(prettierTokens).forEach((key) => {
            console.log(key, utils.formatUnits(prettierTokens[key], tokenDecimals))
        })
        Object.keys(prettierRates).forEach((key) => {
            console.log(key, utils.formatUnits(prettierRates[key], rateDecimals))
        })
    })
})()
