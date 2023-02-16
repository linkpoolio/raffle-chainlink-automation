import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { Routes } from '@ui/Routes'
import { Nav } from '@ui/features/nav'
import { RaffleList, RaffleDetail } from '@ui/features/raffle'

export const App = () => (
  <div>
    <Nav />
    <Switch>
      <Route exact path={Routes.RaffleList}>
        <RaffleList />
      </Route>
      <Route exact path={Routes.RaffleDetail}>
        <RaffleDetail />
      </Route>
      <Redirect to="/" />
    </Switch>
  </div>
)
