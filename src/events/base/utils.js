const BigNumber = require('bignumber.js')

function midEllipsis(input, maxLength) {
    if (input.length <= maxLength) return input
    const middle = Math.ceil(input.length / 2)
    const excess = Math.ceil((input.length - maxLength) / 2)
    return `${input.substring(0, middle - excess)}...${input.substring(middle + excess)}`
}

function numberWithCommas(num) {
    if (typeof num === 'number') return num.toLocaleString('en')
    return parseFloat(num).toLocaleString('en')
}

function blockAmountToApproxDays(blockStart, blockEnd) {
    const avgBlockTime = 13 // 13 seconds
    return (new BigNumber(blockEnd)).minus(blockStart).abs().times(avgBlockTime).div(86400).toFixed(2)
}

module.exports = {
    midEllipsis, numberWithCommas, blockAmountToApproxDays,
}