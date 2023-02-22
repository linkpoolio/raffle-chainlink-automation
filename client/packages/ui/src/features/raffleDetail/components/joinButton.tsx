import React from 'react'
import { Button } from '@chakra-ui/react'

import { steps } from '@ui/features/raffleDetail'
import { RaffleStatus, RaffleType, isRaffleParticipant } from '@ui/models'

const onJoinClick = ({ update }) => update({ step: steps.JOIN })

export const JoinButton = ({ update, raffle, address, identifier }) =>
  raffle?.status == RaffleStatus.LIVE &&
  raffle?.type == RaffleType.DYNAMIC &&
  address &&
  identifier &&
  !isRaffleParticipant(raffle, identifier) && (
    <Button onClick={() => onJoinClick({ update })} variant="default">
      Join Raffle
    </Button>
  )
