import React from 'react'

import { steps, raffleStatus, raffleType } from '@ui/features/raffleDetail'

const onJoinClick = ({ update }) => update({ step: steps.JOIN })

export const JoinButton = ({ update, raffle, address, identifier }) =>
  raffle?.status == raffleStatus.IN_PROGRESS &&
  raffle?.type == raffleType.DYNAMIC &&
  address &&
  identifier && (
    <div>
      <button onClick={() => onJoinClick({ update })}>Join Raffle</button>
    </div>
  )
