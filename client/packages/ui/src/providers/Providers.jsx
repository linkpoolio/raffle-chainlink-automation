import React from 'react'
import { Router } from 'react-router-dom'
import { Web3WalletProvider } from './'

export const Providers = ({ children, history }) => (
  <Router history={history}>
    <Web3WalletProvider>{children}</Web3WalletProvider>
  </Router>
)
