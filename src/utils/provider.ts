import { providers } from 'ethers'

import { AvalancheRPC } from '../constants/Avalanche'

export const avalancheProvider = new providers.JsonRpcProvider(AvalancheRPC)
