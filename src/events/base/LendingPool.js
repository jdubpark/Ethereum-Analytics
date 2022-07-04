const BigNumber = require('bignumber.js')
const { ethers, Contract } = require('ethers')

const { AAVEV2LendingPoolAddressesProviderAddress, ABIAAVEV2LendingPoolAddressesProvider, ABIAAVEV2LendingPool } = require('./constants')
const { tokenList } = require('./token-list')

module.exports = class LendingPool {
    constructor() {
        this.provider = new ethers.providers.WebSocketProvider('ws://127.0.0.1:8545')
        this.initialized = false
    }

    async initialize() {
        this.poolAddressesProvider = new Contract(AAVEV2LendingPoolAddressesProviderAddress, ABIAAVEV2LendingPoolAddressesProvider, this.provider)

        // Since LendingPool is an upgradable contract, we need to use the
        // LendingPoolAddressesProvider to retrieve the latest LendingPool contract address
        const lendingPoolAddress = await this.poolAddressesProvider.getLendingPool()

        this.lendingPool = new Contract(lendingPoolAddress, ABIAAVEV2LendingPool, this.provider)
        this.initialized = true
        return this.lendingPool
    }

    requireInitialized() {
        if (!this.initialized) throw Error('LendingPool instance needs to be initialized')
        return true
    }

    async getReserveList() {
        this.requireInitialized()
        return this.lendingPool.getReservesList()
    }

    // e.g. reserveAddress: 0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2 (WETH)
    async getReserveData(reserveAddress) {
        this.requireInitialized()
        return this.lendingPool.getReserveData(reserveAddress)
    }

    // e.g. userAddress: 0xffc97d72e13e01096502cb8eb52dee56f74dad7b
    async getUserAccountData(userAddress) {
        this.requireInitialized()
        return this.lendingPool.getUserAccountData(userAddress)
    }

    // e.g. queryAmount: 100000, eventName: Borrow
    async getLastEvents({ queryAmount, eventName }) {
        this.requireInitialized()

        console.time(`eventFilter: ${eventName}`)

        const blockEnd = await this.provider.getBlockNumber()
        const blockStart = blockEnd - queryAmount

        const eventFilterBorrow = this.lendingPool.filters[eventName]()
        const events = await this.lendingPool.queryFilter(eventFilterBorrow, blockStart, blockEnd)

        // contractPool.getPastEvents('Borrow', {
        //     // filter: {myIndexedParam: [20,23], myOtherIndexedParam: '0x123456789...'}, // Using an array means OR: e.g. 20 or 23
        //     fromBlock: blockHeight - BLOCK_QUERY_COUNT,
        //     toBlock: blockHeight // 'latest'
        // })
        //     .then((events) => {
        //         console.log(events) // same results as the optional callback above
        //     })
        //     .catch((err) => {
        //         console.log(err)
        //     })

        console.timeEnd(`eventFilter: ${eventName}`)
        return { events, blockStart, blockEnd }
    }

    // reserveIdx: index of the reserve address in Event args
    // amountIdx: index of the amount in Event args
    aggregateAmount(events, reserveIdx, amountIdx) {
        const aggregate = {}
        const failed = {}

        events.forEach((event) => {
            const reserveAddress = event.args[reserveIdx]
            let amount = new BigNumber(event.args[amountIdx].toString())

            if (typeof tokenList[reserveAddress] !== 'undefined') {
                const [tokenSymbol, tokenDecimal] = tokenList[reserveAddress]
                const decimalDivision = (new BigNumber('10')).pow(tokenDecimal)
                amount = amount.div(decimalDivision)
                if (!aggregate[tokenSymbol]) aggregate[tokenSymbol] = amount
                else aggregate[tokenSymbol] = aggregate[tokenSymbol].plus(amount)
            } else {
                if (!failed[reserveAddress]) failed[reserveAddress] = amount
                else failed[reserveAddress] = failed[reserveAddress].plus(amount)
            }
        })

        return { aggregate, failed }
    }
}