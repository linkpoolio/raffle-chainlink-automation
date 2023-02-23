import React from 'react'
import { Button } from '@chakra-ui/react'
import { getAccount } from '@wagmi/core'

import { steps } from '@ui/features/raffleDetail'
import {
  RaffleStatus,
  RaffleType,
  isRaffleParticipantDynamic,
  isRaffleClaimedPrize
} from '@ui/models'

const realIdentifier = getAccount().address

const onParticipantStatusClick = async ({ update, raffle, identifier }) => {
  // Require user to provide unique identifier
  if (raffle.type == RaffleType.STATIC)
    return update({ step: steps.PROVIDE_IDENTIFER })
  // Automatically use users wallet address as unique identifier
  if (raffle.type == RaffleType.DYNAMIC) {
    console.log('raffle', raffle)
    console.log('identifier', getAccount().address)
    const winner = isRaffleParticipantDynamic(raffle, realIdentifier)
    const claimedPrize = isRaffleClaimedPrize(raffle, realIdentifier)

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
  props.raffle?.status == RaffleStatus.FINISHED &&
  isRaffleParticipantDynamic(props.raffle, realIdentifier) &&
  !isRaffleClaimedPrize(props.raffle, realIdentifier) && (
    <Button onClick={() => onParticipantStatusClick(props)} variant="default">
      Did I win?
    </Button>
  )
