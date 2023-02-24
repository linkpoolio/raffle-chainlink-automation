import React from 'react'
import { Button } from '@chakra-ui/react'

import { steps } from '@ui/features/raffleDetail'
import {
  RaffleStatus,
  RaffleType,
  isRaffleParticipant,
  isRaffleWinner,
  isRaffleClaimedPrize
} from '@ui/models'
import { ethers } from 'ethers'

const hashedUserAddress = (identifier) =>
  ethers.utils.solidityKeccak256(['address'], [identifier])

const onParticipantStatusClick = async ({ update, raffle, identifier }) => {
  // Require user to provide unique identifier
  if (raffle.type == RaffleType.STATIC)
    return update({ step: steps.PROVIDE_IDENTIFER })
  // Automatically use users wallet address as unique identifier
  if (raffle.type == RaffleType.DYNAMIC) {
    const winner = isRaffleWinner(raffle, hashedUserAddress(identifier))
    const claimedPrize = isRaffleClaimedPrize(
      raffle,
      hashedUserAddress(identifier)
    )

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

export const CheckStatusButton = (props) => {
  if (
    props.raffle?.status === RaffleStatus.FINISHED &&
    (props.raffle?.type === RaffleType.STATIC ||
      isRaffleParticipant(props.raffle, hashedUserAddress))
  ) {
    return (
      <Button onClick={() => onParticipantStatusClick(props)} variant="default">
        Did I win?
      </Button>
    )
  } else {
    return null
  }
}
