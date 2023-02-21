import React, { useState, useEffect } from 'react'

import { withdrawLink } from '@ui/features/raffleDetail'

export const Withdraw = ({ id, reset, asyncManager }) => {
  const [success, update] = useState(false)

  const componentDidMount = () => {
    withdrawLink({
      id,
      asyncManager,
      update
    })
  }
  useEffect(componentDidMount, [])

  return (
    success && (
      <>
        <h3>Withdraw LINK</h3>
        <div>Successfully withdrew LINK for raffle id `{id}`.</div>
        <button onClick={reset}>Close</button>
      </>
    )
  )
}
