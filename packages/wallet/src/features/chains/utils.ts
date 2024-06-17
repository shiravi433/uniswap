import { BigNumber, BigNumberish } from 'ethers'
import { Chain } from 'uniswap/src/data/graphql/uniswap-data-api/__generated__/types-and-hooks'
import { ChainId } from 'uniswap/src/types/chains'
import {
  ALL_SUPPORTED_CHAINS,
  L2ChainId,
  L2_CHAIN_IDS,
  TESTNET_CHAIN_IDS,
} from 'wallet/src/constants/chains'
import { PollingInterval } from 'wallet/src/constants/misc'

// Some code from the web app uses chainId types as numbers
// This validates them as coerces into SupportedChainId
export function toSupportedChainId(chainId?: BigNumberish): ChainId | null {
  if (!chainId || !ALL_SUPPORTED_CHAINS.includes(chainId.toString())) {
    return null
  }
  return parseInt(chainId.toString(), 10) as ChainId
}

export function chainIdToHexadecimalString(chainId: ChainId): string {
  return BigNumber.from(chainId).toHexString()
}

export function hexadecimalStringToInt(hex: string): number {
  return parseInt(hex, 16)
}

export const isL2Chain = (chainId?: ChainId): boolean =>
  Boolean(chainId && L2_CHAIN_IDS.includes(chainId as L2ChainId))

export function isTestnet(chainId?: ChainId): boolean {
  if (!chainId) {
    return false
  }

  return TESTNET_CHAIN_IDS.includes(chainId)
}

export function fromGraphQLChain(chain: Chain | undefined): ChainId | null {
  switch (chain) {
    case Chain.Ethereum:
      return ChainId.Mainnet
    case Chain.Arbitrum:
      return ChainId.ArbitrumOne
    case Chain.EthereumGoerli:
      return ChainId.Goerli
    case Chain.Optimism:
      return ChainId.Optimism
    case Chain.Polygon:
      return ChainId.Polygon
    case Chain.Base:
      return ChainId.Base
    case Chain.Bnb:
      return ChainId.Bnb
    case Chain.Blast:
      return ChainId.Blast
    case Chain.Avalanche:
      return ChainId.Avalanche
    case Chain.Celo:
      return ChainId.Celo
    case Chain.Zora:
      return ChainId.Zora
  }

  return null
}

export function getPollingIntervalByBlocktime(chainId?: ChainId): PollingInterval {
  return isL2Chain(chainId) ? PollingInterval.LightningMcQueen : PollingInterval.Fast
}

export function fromMoonpayNetwork(moonpayNetwork: string | undefined): ChainId | undefined {
  switch (moonpayNetwork) {
    case Chain.Arbitrum.toLowerCase():
      return ChainId.ArbitrumOne
    case Chain.Optimism.toLowerCase():
      return ChainId.Optimism
    case Chain.Polygon.toLowerCase():
      return ChainId.Polygon
    case Chain.Bnb.toLowerCase():
      return ChainId.Bnb
    // Moonpay still refers to BNB chain as BSC so including both BNB and BSC cases
    case 'bsc':
      return ChainId.Bnb
    case Chain.Base.toLowerCase():
      return ChainId.Base
    case Chain.Avalanche.toLowerCase():
      return ChainId.Avalanche
    case Chain.Celo.toLowerCase():
      return ChainId.Celo
    case undefined:
      return ChainId.Mainnet
    default:
      return undefined
  }
}

export function fromUniswapWebAppLink(network: string | null): ChainId | null {
  switch (network) {
    case Chain.Ethereum.toLowerCase():
      return ChainId.Mainnet
    case Chain.Arbitrum.toLowerCase():
      return ChainId.ArbitrumOne
    case Chain.Optimism.toLowerCase():
      return ChainId.Optimism
    case Chain.Polygon.toLowerCase():
      return ChainId.Polygon
    case Chain.Base.toLowerCase():
      return ChainId.Base
    case Chain.Bnb.toLowerCase():
      return ChainId.Bnb
    case Chain.Blast.toLowerCase():
      return ChainId.Blast
    case Chain.Avalanche.toLowerCase():
      return ChainId.Avalanche
    case Chain.Celo.toLowerCase():
      return ChainId.Celo
    case Chain.Zora.toLowerCase():
      return ChainId.Zora
    default:
      throw new Error(`Network "${network}" can not be mapped`)
  }
}

export function toUniswapWebAppLink(chainId: ChainId): string | null {
  switch (chainId) {
    case ChainId.Mainnet:
      return Chain.Ethereum.toLowerCase()
    case ChainId.ArbitrumOne:
      return Chain.Arbitrum.toLowerCase()
    case ChainId.Optimism:
      return Chain.Optimism.toLowerCase()
    case ChainId.Polygon:
      return Chain.Polygon.toLowerCase()
    case ChainId.Base:
      return Chain.Base.toLowerCase()
    case ChainId.Bnb:
      return Chain.Bnb.toLowerCase()
    case ChainId.Blast:
      return Chain.Blast.toLowerCase()
    case ChainId.Avalanche:
      return Chain.Avalanche.toLowerCase()
    case ChainId.Celo:
      return Chain.Celo.toLowerCase()
    case ChainId.Zora:
      return Chain.Zora.toLowerCase()
    default:
      throw new Error(`ChainID "${chainId}" can not be mapped`)
  }
}
