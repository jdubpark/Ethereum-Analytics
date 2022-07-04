import { providers, utils } from 'ethers'
import EventEmitter from 'node:events'

import { AvalancheOracleAddress, AvalanchePoolDataProviderAddress } from '../constants/addresses'
import { Oracle__factory, PoolAddressesProvider__factory } from '../contracts/types'
import { getKeyByValue } from '../utils'
import { avalancheProvider } from '../utils/provider'

export type ReserveTokens = Map<string, string>

const poolAddressesProvider = PoolAddressesProvider__factory.connect(AvalanchePoolDataProviderAddress, avalancheProvider)
const oracle = Oracle__factory.connect(AvalancheOracleAddress, avalancheProvider)

export async function getAllReserveTokens(): Promise<Map<string, string>> {
  const reserveTokens = await poolAddressesProvider.getAllReservesTokens()
  const assets = new Map<string, string>()
  reserveTokens.forEach(([symbol, tokenAddress]) => {
    assets.set(symbol, tokenAddress)
  })
  return assets
}

export async function getAssetPrices(assets: ReserveTokens): Promise<Map<string, number>> {
  const assetAddresses: string[] = Array.from(assets.values()) // address[]
  const prices = await oracle.getAssetsPrices(assetAddresses)
  const assetPrices = new Map<string, number>()
  prices.forEach((price, idx) => {
    const symbol = getKeyByValue<string>(assets, assetAddresses[idx])
    if (!symbol) return // skip any null stuff
    // all symbols are returned with 8 decimals, denominated in USD
    assetPrices.set(symbol, parseFloat(utils.formatUnits(price, 8)))
  })
  return assetPrices
}

export default class PriceFeed {
  assets: Map<string, string> // asset symbol to address

  public latestAssetPrices: Map<string, number>

  private provider: providers.JsonRpcProvider

  private latestBlockNumber: number

  private lastReserveUpdateNumber: number

  private isFeedOn: boolean

  private isTokenRefreshInited: boolean

  private TOKENS_REFRESH_INTERVAL: number

  public priceEventEmitter: EventEmitter

  public assetEventEmitter: EventEmitter

  constructor() {
    this.assets = new Map<string, string>()
    this.latestAssetPrices = new Map<string, number>()

    this.provider = avalancheProvider
    this.latestBlockNumber = -1
    this.lastReserveUpdateNumber = 0
    this.isFeedOn = false
    this.isTokenRefreshInited = false

    this.TOKENS_REFRESH_INTERVAL = 100

    this.priceEventEmitter = new EventEmitter()
    this.assetEventEmitter = new EventEmitter()
  }

  startFeed() {
    this.attachListener()
  }

  attachListener() {
    if (this.isFeedOn) return
    this.isFeedOn = true

    this.lastReserveUpdateNumber = 0

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.provider.on('block', async (blockNumber: number) => {
      this.latestBlockNumber = blockNumber
      this.lastReserveUpdateNumber += 1

      if (this.lastReserveUpdateNumber >= this.TOKENS_REFRESH_INTERVAL || !this.isTokenRefreshInited) {
        await this.updateReserveTokens()
      }

      await this.updatePrices(blockNumber)
    })
  }

  async updatePrices(blockNumber: number) {
    // oracle price fetch
    const assetPrices = await getAssetPrices(this.assets)

    // skip stale blocks
    if (blockNumber < this.latestBlockNumber) return

    assetPrices.forEach((assetPrice, assetSymbol) => {
      if (!assetSymbol) return // skip any null stuff
      // all symbols are returned with 8 decimals, denominated in USD
      // const priceReformat = assetPrice instanceof 'number' ? assetPrice : parseFloat(utils.formatUnits(assetPrice, 8))
      this.latestAssetPrices.set(assetSymbol.toUpperCase(), assetPrice)
    })

    this.priceEventEmitter.emit('update', blockNumber)
  }

  async updateReserveTokens() {
    // Reset data
    this.lastReserveUpdateNumber = 0
    this.isTokenRefreshInited = true
    this.assets.clear()

    // Get all reserve tokens
    this.assets = await getAllReserveTokens()
    this.assets.forEach(([symbol, tokenAddress]) => {
      this.latestAssetPrices.set(symbol, this.latestAssetPrices.get(symbol) || -1)
    })

    this.assetEventEmitter.emit('update')
  }
}
