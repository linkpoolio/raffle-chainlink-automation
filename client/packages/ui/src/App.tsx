import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import { Routes } from '@ui/Routes'
import { NavigationBar } from '@ui/features/navigationBar'
import { RaffleList, RaffleDetail } from '@ui/features/raffle'

export const App = () => (
  <>
    <NavigationBar />
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
  </>
)
