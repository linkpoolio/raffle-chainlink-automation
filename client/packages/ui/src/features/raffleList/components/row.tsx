import React from 'react'
import { Link } from 'react-router-dom'

import { Routes, createRoute } from '@ui/Routes'

export const Row = (raffle) => (
  <div key={raffle.id}>
    <Link to={createRoute({ route: Routes.RaffleDetail, id: raffle.id })}>
      {raffle.name}
    </Link>
  </div>
)
