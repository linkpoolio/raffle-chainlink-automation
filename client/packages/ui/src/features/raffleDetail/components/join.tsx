import React, { useState, useEffect } from 'react'

import { joinRaffle } from '@ui/features/raffleDetail'

export const Join = ({ id, reset, asyncManager }) => {
  const [success, update] = useState(false)

  const componentDidMount = () => {
    joinRaffle({
      id,
      asyncManager,
      update
    })
  }
  useEffect(componentDidMount, [])

  return (
    success && (
      <>
        <div>Successfully joined raffle id `{id}`.</div>
        <button onClick={reset}>Close</button>
      </>
    )
  )
}
