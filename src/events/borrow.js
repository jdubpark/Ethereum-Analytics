const LendingPool = require('./base/LendingPool')
const { blockAmountToApproxDays, numberWithCommas } = require('./base/utils')

const DECIMAL_SIG_FIG = 2

// eslint-disable-next-line semi-style
;(async () => {
    const lendingPool = new LendingPool()

    const provider = lendingPool.provider
    await lendingPool.initialize()

    const {
        events: borrowEvents,
        blockStart,
        blockEnd,
    } = await lendingPool.getLastEvents({
        queryAmount: 100000,
        eventName: 'Borrow',
    })

    const { aggregate, failed } = lendingPool.aggregateAmount(borrowEvents, 0, 3)

    console.log('=============================')
    console.log('Total Borrowed in AAVE V2 Ethereum')
    console.log(`Blocks: ${blockStart} ~ ${blockEnd} (${numberWithCommas(blockEnd - blockStart)}) blocks`)
    console.log(`Timeframe: ${blockAmountToApproxDays(blockStart, blockEnd)} days`)
    console.log('=============================')

    Object.keys(aggregate).sort().forEach((tokenSymbol) => {
        console.log(`${tokenSymbol}\t${numberWithCommas(aggregate[tokenSymbol].toFixed(DECIMAL_SIG_FIG))}`)
    })

    if (Object.keys(failed).length) console.log(failed)

    process.exit(1)

    // borrowEvents.forEach((event) => {
    //     console.log('-----------------------------')
    //     console.log(`Block: ${event.blockNumber} // TX Index: ${event.transactionIndex}`)
    //     const [reserveRaw, user, onBehalfOf, amountRaw, referral] = event.args
    //
    //     let reserve = reserveRaw
    //     let amount = new BigNumber(amountRaw.toString())
    //     if (typeof tokenList[reserve] !== 'undefined') {
    //         const [tokenSymbol, tokenDecimal] = tokenList[reserve]
    //         const decimalDivision = (new BigNumber('10')).pow(tokenDecimal)
    //         reserve = `${tokenSymbol} (${midEllipsis(reserve, 10)})`
    //         amount = amount.div(decimalDivision)
    //
    //         if (!totalBorrowed[tokenSymbol]) totalBorrowed[tokenSymbol] = amount
    //         else totalBorrowed[tokenSymbol] = totalBorrowed[tokenSymbol].plus(amount)
    //
    //         amount = `${numberWithCommas(amount.toFixed(DECIMAL_SIG_FIG))} ${tokenSymbol}`
    //     } else {
    //         amount = amount.toString()
    //     }
    //
    //     console.log(`\tReserve: ${reserve}`)
    //     console.log(`\tUser: ${user}`)
    //     if (user !== onBehalfOf) console.log(`\tOn Behalf Of: ${onBehalfOf}`)
    //     console.log(`\tAmount: ${amount}`)
    // })

    // const eventFilterDeposit = lendingPool.filters.Deposit()
    // const eventFilterWithdraw = lendingPool.filters.Withdraw()
})()
