import React from 'react'
import { Button } from '@chakra-ui/react'

import { steps } from '@ui/features/raffleDetail'
import { RaffleStatus, isRaffleOwner } from '@ui/models'

const onCancelClick = ({ update }) => update({ step: steps.CANCEL_UPKEEP })

export const CancelUpkeepButton = ({ update, raffle, address }) =>
  raffle?.status == RaffleStatus.FINISHED &&
  isRaffleOwner(raffle, address) && (
    <Button onClick={() => onCancelClick({ update })} variant="default">
      Cancel Upkeep
    </Button>
  )
