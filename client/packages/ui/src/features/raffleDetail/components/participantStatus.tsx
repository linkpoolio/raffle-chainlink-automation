import React from 'react'

import { participantStatus, claimPrize } from '@ui/features/raffleDetail'
import { RaffleType } from '@ui/models'

const Close = ({ reset }) => (
  <div>
    <button onClick={reset}>Close</button>
  </div>
)

const Lost = ({ reset }) => {
  return (
    <>
      <h3>Did I win?</h3>
      <div>Sorry, no luck this time! Try again soon.</div>
      <Close reset={reset} />
    </>
  )
}

const WonUnclaimed = ({ id, store, asyncManager }) => {
  const onClaim = async () => {
    const response = await claimPrize({
      id,
      asyncManager
    })

    if (response)
      store.update({
        participantStatus: participantStatus.WON_CLAIMED
      })
  }

  return (
    <>
      <h3>Did I win?</h3>
      <span>You won!</span>
      <div>
        <button disabled={asyncManager.loading} onClick={onClaim}>
          Claim Prize
        </button>
      </div>
    </>
  )
}

const WonClaimed = ({ store, reset }) => {
  return (
    <>
      <h3>Did I win?</h3>
      <div>
        You Won!
        {store.state.raffle.type == RaffleType.DYNAMIC &&
          ` (and you successfully claimed your prize)`}
      </div>
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
