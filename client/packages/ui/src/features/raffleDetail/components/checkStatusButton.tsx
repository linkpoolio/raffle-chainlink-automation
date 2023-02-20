import React from 'react'

import { steps } from '@ui/features/raffleDetail'
import { RaffleStatus, RaffleType } from '@ui/models'

const onParticipantStatusClick = async ({ update, raffle, identifier }) => {
  // Require user to provide unique identifier
  if (raffle.type == RaffleType.STATIC)
    return update({ step: steps.PROVIDE_IDENTIFER })
  // Automatically use users wallet address as unique identifier
  if (raffle.type == RaffleType.DYNAMIC) {
    let winner = false
    let claimedPrize = false

    raffle.winners.map((bytes32) => {
      if (identifier == bytes32) winner = true
    })

    if (winner) {
      raffle.claimedPrizes.map((bytes32) => {
        if (identifier == bytes32) claimedPrize = true
      })
    }

    const participantStatus =
      winner && claimedPrize ? 'WON_CLAIMED' : winner ? 'WON_UNCLAIMED' : 'LOST'

    if (participantStatus)
      update({
        identifier,
        participantStatus,
        step: steps.PARTICIPANT_STATUS
      })
  }
}

export const CheckStatusButton = (props) =>
  props.raffle?.status == RaffleStatus.FINISHED && (
    <div>
      <button onClick={() => onParticipantStatusClick(props)}>
        Did I win?
      </button>
    </div>
  )
