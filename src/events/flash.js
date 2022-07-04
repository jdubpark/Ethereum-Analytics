const LendingPool = require('./base/LendingPool')
const { blockAmountToApproxDays, numberWithCommas } = require('./base/utils')

const DECIMAL_SIG_FIG = 2

// eslint-disable-next-line semi-style
;(async () => {
    const lendingPool = new LendingPool()

    const provider = lendingPool.provider
    await lendingPool.initialize()

    const {
        events: flashEvents,
        blockStart,
        blockEnd,
    } = await lendingPool.getLastEvents({
        queryAmount: 100000,
        eventName: 'FlashLoan',
    })

    // event.args: [target (user), initiator, asset, amount, premium, referralCode]
    const { aggregate, failed } = lendingPool.aggregateAmount(flashEvents, 2, 3)

    console.log('=============================')
    console.log('Total Flash Loan in AAVE V2 Ethereum')
    console.log(`Blocks: ${blockStart} ~ ${blockEnd} (${numberWithCommas(blockEnd - blockStart)}) blocks`)
    console.log(`Timeframe: ${blockAmountToApproxDays(blockStart, blockEnd)} days`)
    console.log('=============================')

    Object.keys(aggregate).sort().forEach((tokenSymbol) => {
        console.log(`${tokenSymbol}\t${numberWithCommas(aggregate[tokenSymbol].toFixed(DECIMAL_SIG_FIG))}`)
    })

    if (Object.keys(failed).length) console.log(failed)

    process.exit(1)
})()
