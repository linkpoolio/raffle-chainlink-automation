import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import { Routes } from '@ui/Routes'
import { RaffleList } from '@ui/features/raffleList'
import { RaffleDetail } from '@ui/features/raffleDetail'
import { Hero } from '@ui/components'

export const App = () => (
  <>
    <Switch>
      <Route exact path={Routes.RaffleList}>
        <Hero />
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
