import { createClient } from 'wagmi'
import { getDefaultClient } from 'connectkit'
import { mainnet, goerli, polygon, optimism, arbitrum } from 'wagmi/chains'

export const client = createClient(
  getDefaultClient({
    appName: 'Raffle Manager',
    chains: [mainnet, goerli, polygon, optimism, arbitrum]
  })
)
