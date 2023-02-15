import React from 'react'
import { Link } from 'react-router-dom'

import { Routes } from '@ui/Routes'

export const RaffleDetail = () => {
  return (
    <>
      <h2>RaffleDetail</h2>
      <Link to={Routes.RaffleList}>Raffle List</Link>
    </>
  )
}
