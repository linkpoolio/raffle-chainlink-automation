import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import { RaffleList } from '@ui/features/raffle'

export function App() {
  return (
    <>
      <Switch>
        <Route exact path="/">
          <RaffleList />
        </Route>
        <Redirect to="/" />
      </Switch>
    </>
  )
}
