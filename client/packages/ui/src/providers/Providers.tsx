import React from 'react'
import { Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import {
  ConnectKitProvider,
  ConnectKitButton,
  getDefaultClient
} from 'connectkit'
import { WagmiConfig, createClient } from 'wagmi'

import { client } from '@ui/config/client'
import { Web3WalletProvider } from './'

const history = createBrowserHistory()

export const Providers = ({ children }) => (
  <Router history={history}>
    <WagmiConfig client={client}>
      <ConnectKitProvider>
        <Web3WalletProvider>{children}</Web3WalletProvider>
      </ConnectKitProvider>
    </WagmiConfig>
  </Router>
)