import React from 'react'
import { Link } from 'react-router-dom'

import { Routes, createRoute } from '@ui/Routes'

export const RaffleList = () => {
  const routeId = 1
  const Route = createRoute({ route: Routes.RaffleDetail, id: routeId })

  return (
    <>
      <h2>RaffleList</h2>
      <Link to={Route}>Raffle Detail</Link>
    </>
  )
}
