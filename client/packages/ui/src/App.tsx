import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import { Routes } from '@ui/Routes'
import { RaffleList } from '@ui/features/raffleList'
import { RaffleDetail } from '@ui/features/raffleDetail'
import { RaffleCreate } from '@ui/features/raffleCreate'
import { Hero } from '@ui/components'

export const App = () => (
  <>
    <Switch>
      <Route
        exact
        path={Routes.RaffleList}
        render={(props) => (
          <>
            <Hero />
            <RaffleList {...props} />
          </>
        )}
      />

      <Route
        path={Routes.RaffleDetail}
        render={({ match }) => <RaffleDetail id={match.params.id} />}
      />

      <Route exact path={Routes.RaffleCreate}>
        <RaffleCreate />
      </Route>

      <Redirect to="/" />
    </Switch>
  </>
)
