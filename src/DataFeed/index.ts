import BigNumber from 'bignumber.js'
import { providers, utils } from 'ethers'
import { request, gql } from 'graphql-request'
import EventEmitter from 'node:events'

interface AvalancheReservePartialItem {
  name: string
  underlyingAsset: string
  liquidityRate: string
  stableBorrowRate: string
  variableBorrowRate: string
  aEmissionPerSecond: string
  vEmissionPerSecond: string
  sEmissionPerSecond: string
  totalATokenSupply: string
  totalCurrentVariableDebt: string
}

export interface AvalancheReservesPartial {
  reserves: AvalancheReservePartialItem[]
}

type BigNumberCryptoData = Map<string, BigNumber>

interface DepositData {
  APR: BigNumberCryptoData
  APY: BigNumberCryptoData
}

interface BorrowData {
  APR: {
    stable: BigNumberCryptoData
    variable: BigNumberCryptoData
  }
  APY: {
    stable: BigNumberCryptoData
    variable: BigNumberCryptoData
  }
}

export default class DataFeed {
  private query: string

  private gqlUrl: string

  public deposit: DepositData

  public borrow: BorrowData

  private nameToSymbol: Map<string, string>

  private RAY: number

  // const SECONDS_PER_YEAR = 31536000
  private MULTIPLIER: number // use this instead of SECONDS_PER_YEAR (raising power to 500 is already not fast)

  public dataEventEmitter: EventEmitter

  private fetchInterval: number

  constructor() {
    this.query = gql`
      {
        reserves(subgraphError: allow) {
          name
          underlyingAsset
          
          liquidityRate 
          stableBorrowRate
          variableBorrowRate
          
          totalATokenSupply
          totalCurrentVariableDebt
        }
      }
    `

    this.gqlUrl = 'https://api.thegraph.com/subgraphs/name/aave/protocol-v3-avalanche'

    BigNumber.config({
      DECIMAL_PLACES: 8,
      POW_PRECISION: 20,
    })

    this.deposit = {
      APR: new Map(),
      APY: new Map(),
    }

    this.borrow = {
      APR: {
        stable: new Map(),
        variable: new Map(),
      },
      APY: {
        stable: new Map(),
        variable: new Map(),
      },
    }

    this.nameToSymbol = new Map([
      ['Wrapped Ether', 'WETH'],
      ['Wrapped BTC', 'WBTC'],
      ['Chainlink Token', 'LINK'],
      ['Aave Token', 'AAVE'],
      ['TetherToken', 'USDT'],
      ['Wrapped AVAX', 'WAVAX'],
      ['USD Coin', 'USDC'],
      ['Dai Stablecoin', 'DAI.E'],
    ])

    this.RAY = 10 ** 27

    this.MULTIPLIER = 500

    this.fetchInterval = 5000 // 5 seconds

    this.dataEventEmitter = new EventEmitter()
  }

  startFeed() {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.fetch()
      .then(() => {
        setTimeout(() => {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          this.startFeed()
        }, this.fetchInterval)
      })
  }

  async fetch() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data: AvalancheReservesPartial = await request(this.gqlUrl, this.query)
    const { reserves } = data
    reserves.forEach((reserve) => {
      const { name } = reserve
      if (!name) return
      const symbol = this.nameToSymbol.get(reserve.name)
      if (!symbol) return

      // Deposit and Borrow calculations
      // APY and APR are returned here as decimals, multiply by 100 to get the percents

      const depositAPR = (new BigNumber(reserve.liquidityRate)).div(this.RAY)
      const variableBorrowAPR = (new BigNumber(reserve.variableBorrowRate)).div(this.RAY)
      const stableBorrowAPR = (new BigNumber(reserve.variableBorrowRate)).div(this.RAY)

      // ((1 + (depositAPR / SECONDS_PER_YEAR)) ^ SECONDS_PER_YEAR) - 1
      const depositAPY = depositAPR.div(this.MULTIPLIER).plus(1).pow(this.MULTIPLIER).minus(1)
      const variableBorrowAPY = variableBorrowAPR.div(this.MULTIPLIER).plus(1).pow(this.MULTIPLIER).minus(1)
      const stableBorrowAPY = stableBorrowAPR.div(this.MULTIPLIER).plus(1).pow(this.MULTIPLIER).minus(1)

      this.deposit.APR.set(symbol, depositAPR)
      this.deposit.APY.set(symbol, depositAPY)
      this.borrow.APR.stable.set(symbol, stableBorrowAPR)
      this.borrow.APY.stable.set(symbol, stableBorrowAPY)
      this.borrow.APR.variable.set(symbol, variableBorrowAPR)
      this.borrow.APY.variable.set(symbol, variableBorrowAPY)
    })

    this.dataEventEmitter.emit('update')
  }
}
