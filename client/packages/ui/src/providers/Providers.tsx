import React from 'react'
import { Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { ConnectKitProvider } from 'connectkit'
import { WagmiConfig } from 'wagmi'
import { ChakraProvider } from '@chakra-ui/react'

import { theme } from '@ui/styles/theme'
import { client } from '@ui/config/client'
import { Web3WalletProvider } from './'

const history = createBrowserHistory()

export const Providers = ({ children }) => (
  <Router history={history}>
    <ChakraProvider theme={theme}>
      <WagmiConfig client={client}>
        <ConnectKitProvider>
          <Web3WalletProvider>{children}</Web3WalletProvider>
        </ConnectKitProvider>
      </WagmiConfig>
    </ChakraProvider>
  </Router>
)
