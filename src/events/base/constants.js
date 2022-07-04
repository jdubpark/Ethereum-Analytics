const ABIAAVEV2LendingPool = require('../../contracts/abis/AAVEV2/LendingPool.json')
const ABIAAVEV2LendingPoolAddressesProvider = require('../../contracts/abis/AAVEV2/LendingPoolAddressesProvider.json')

// Deployed addresses:
// https://docs.aave.com/developers/v/2.0/deployed-contracts/deployed-contracts

// https://etherscan.io/address/0xb53c1a33016b2dc2ff3653530bff1848a515c8c5#code
const AAVEV2LendingPoolAddressesProviderAddress = '0xb53c1a33016b2dc2ff3653530bff1848a515c8c5'

module.exports = {
    ABIAAVEV2LendingPool,
    ABIAAVEV2LendingPoolAddressesProvider,
    AAVEV2LendingPoolAddressesProviderAddress,
}