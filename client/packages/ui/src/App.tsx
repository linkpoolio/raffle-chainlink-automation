import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import { Routes } from '@ui/Routes'
import { RaffleList } from '@ui/features/raffleList'
import { RaffleDetail } from '@ui/features/raffleDetail'

export const App = () => (
  <>
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
