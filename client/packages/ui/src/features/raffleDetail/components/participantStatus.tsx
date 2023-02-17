import React, { useState } from 'react'

import { participantStatus, claimPrize } from '@ui/features/raffleDetail'

const Close = ({ reset }) => (
  <div>
    <button onClick={reset}>Close</button>
  </div>
)

const Lost = ({ reset }) => {
  return (
    <>
      <div>Sorry, no luck this time! Try again soon.</div>
      <Close reset={reset} />
    </>
  )
}

const WonUnclaimed = ({ id, reset, store, asyncManager }) => {
  const [success, setSuccess] = useState(false)

  const onClaim = async () => {
    const response = await claimPrize({
      id,
      identifier: store.state.identifier,
      asyncManager
    })
    setSuccess(response)
  }

  return (
    <>
      <span>You won!</span>
      {!success ? (
        <div>
          <button disabled={asyncManager.loading} onClick={onClaim}>
            Claim Prize
          </button>
        </div>
      ) : (
        <>
          <div>Success, prize claimed!</div>
          <Close reset={reset} />
        </>
      )}
    </>
  )
}

const WonClaimed = ({ reset }) => {
  return (
    <>
      <div>You Won! (and you already claimed your prize)</div>
      <Close reset={reset} />
    </>
  )
}

export const ParticipantStatus = (props) => {
  switch (props.store.state.participantStatus) {
    case participantStatus.LOST:
      return <Lost {...props} />
    case participantStatus.WON_UNCLAIMED:
      return <WonUnclaimed {...props} />
    case participantStatus.WON_CLAIMED:
      return <WonClaimed {...props} />
    default:
      return null
  }
}
