import React from 'react'
import { ethers } from 'ethers'
import { WagmiConfig, createClient } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { mainnet } from 'wagmi/chains'

const defaultChains = [mainnet]

const getProvider = () =>
  new ethers.providers.JsonRpcProvider('https://main-light.eth.linkpool.io', 1)

const connectors = () => {
  return [
    new InjectedConnector({
      chains: defaultChains,
      options: { shimDisconnect: true }
    })
  ]
}

const client = createClient({
  autoConnect: true,
  connectors,
  provider: getProvider
})

export const Web3WalletProvider = ({ children }) => (
  <WagmiConfig client={client}>{children}</WagmiConfig>
)
