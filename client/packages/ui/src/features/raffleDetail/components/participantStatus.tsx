import React from 'react'

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

const WonUnclaimed = ({ id, store, asyncManager }) => {
  const onClaim = async () => {
    const response = await claimPrize({
      id,
      identifier: store.state.identifier,
      asyncManager
    })

    if (response)
      store.update({
        participantStatus: participantStatus.WON_CLAIMED
      })
  }

  return (
    <>
      <span>You won!</span>
      <div>
        <button disabled={asyncManager.loading} onClick={onClaim}>
          Claim Prize
        </button>
      </div>
    </>
  )
}

const WonClaimed = ({ reset }) => {
  return (
    <>
      <div>You Won! (and you successfully claimed your prize)</div>
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
