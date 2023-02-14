import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import NavBar from './components/navbar'

// const client = createClient({
//   autoConnect: true,
//   connectors: [
//     new MetaMaskConnector({ chains }),
//     new CoinbaseWalletConnector({
//       chains,
//       options: {
//         appName: 'wagmi'
//       }
//     }),
//     new WalletConnectConnector({
//       chains,
//       options: {
//         qrcode: true
//       }
//     }),
//     new InjectedConnector({
//       chains,
//       options: {
//         name: 'Injected',
//         shimDisconnect: true
//       }
//     })
//   ],
//   provider,
//   webSocketProvider
// })

export function App() {
  return (
    <>
      <NavBar />
      <Switch>
        <Route exact path="/"></Route>
        <Redirect to="/" />
      </Switch>
    </>
  )
}
