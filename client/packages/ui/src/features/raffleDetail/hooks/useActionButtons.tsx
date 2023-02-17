import React from 'react'

import { steps, raffleStatus, raffleType } from '@ui/features/raffleDetail'

import { mockState } from '../mock' // TODO: remove

const onParticipantStatusClick = ({ update, raffle }) => {
  if (raffle.type == raffleType.STATIC)
    return update({ step: steps.PROVIDE_IDENTIFER })
  // TODO: replace mock with user's wallet address from wagmi
  if (raffle.type == raffleType.DYNAMIC)
    return update({ identifier: mockState.walletAddress })
}

const onJoinClick = ({ update }) => update({ step: steps.JOIN })

export const useActionButtons = ({ update }) => ({
  JoinRaffle: ({ raffle, identifier }) =>
    raffle?.status == raffleStatus.IN_PROGRESS &&
    raffle?.type == raffleType.DYNAMIC &&
    identifier && (
      <div>
        <button onClick={() => onJoinClick({ update })}>Join Raffle</button>
      </div>
    ),
  CheckStatus: ({ raffle }) =>
    raffle?.status == raffleStatus.COMPLETE && (
      <div>
        <button onClick={() => onParticipantStatusClick({ update, raffle })}>
          Did I win?
        </button>
      </div>
    )
})
