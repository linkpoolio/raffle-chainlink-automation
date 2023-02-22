import React from 'react'
import { Button } from '@chakra-ui/react'

import { steps } from '@ui/features/raffleDetail'
import { RaffleStatus, isRaffleOwner } from '@ui/models'

const onPickWinnersClick = ({ update }) => update({ step: steps.PICK_WINNERS })

export const PickWinnersButton = ({ update, raffle, address }) => {
  const validStatus =
    isRaffleOwner(raffle, address) &&
    (raffle?.status === RaffleStatus.LIVE ||
      (raffle?.status === RaffleStatus.STAGED && raffle.automation))

  return (
    validStatus && (
      <Button onClick={() => onPickWinnersClick({ update })} variant="default">
        Pick Winners
      </Button>
    )
  )
}
