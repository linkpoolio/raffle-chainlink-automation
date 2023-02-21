import React, { useState, useEffect } from 'react'

import { pickWinners } from '@ui/features/raffleDetail'

export const PickWinners = ({ id, reset, asyncManager }) => {
  const [success, update] = useState(false)

  const componentDidMount = () => {
    pickWinners({
      id,
      asyncManager,
      update
    })
  }
  useEffect(componentDidMount, [])

  return (
    success && (
      <>
        <h3>Pick Winners</h3>
        <div>Successfully picked winners for raffle id `{id}`.</div>
        <button onClick={reset}>Close</button>
      </>
    )
  )
}
