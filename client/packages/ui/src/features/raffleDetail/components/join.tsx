import React, { useState, useEffect } from 'react'

import { joinRaffle } from '@ui/features/raffleDetail'

export const Join = ({ id, reset, store, asyncManager }) => {
  const [entries, setEntries] = useState('')
  const [success, setSuccess] = useState(false)

  const { identifier } = store.state

  const onChange = (e) => {
    setEntries(e.target.value)
  }

  const onSubmit = async () => {
    const response = await joinRaffle({
      id,
      identifier,
      entries,
      asyncManager
    })

    setSuccess(response)
  }

  const componentDidUnmount = () => setEntries('')
  useEffect(componentDidUnmount, [])

  return !success ? (
    <>
      <div>Please select your entries</div>
      <input type="number" value={entries} onChange={onChange} />
      <button
        disabled={asyncManager.loading || entries == ''}
        onClick={onSubmit}>
        Join Raffle
      </button>
    </>
  ) : (
    <>
      <div>
        Successfully joined raffle id `{id}` with `{entries}` entries for
        participant `{identifier}`.
      </div>
      <button onClick={reset}>Close</button>
    </>
  )
}
