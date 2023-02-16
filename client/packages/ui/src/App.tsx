import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { Routes } from '@ui/Routes'
import { Nav } from '@ui/features/nav'
import { RaffleDetail } from '@ui/features/raffleDetail'
import { RaffleList } from '@ui/features/raffleList'

export const App = () => (
  <div>
    <Nav />
    <Switch>
      <Route exact path={Routes.RaffleList}>
        <RaffleList />
      </Route>
      <Route
        path={Routes.RaffleDetail}
        render={({ match }) => <RaffleDetail id={match.params.id} />}
      />
      <Redirect to="/" />
    </Switch>
  </div>
)
