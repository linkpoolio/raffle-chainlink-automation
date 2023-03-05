import React from 'react'
import { Button, Tooltip } from '@chakra-ui/react'

import { steps } from '@ui/features/raffleDetail'
import { RaffleStatus, isRaffleOwner } from '@ui/models'

const onCancelClick = ({ update }) => update({ step: steps.CANCEL_UPKEEP })

export const CancelUpkeepButton = ({ update, raffle, address }) =>
  raffle?.status == RaffleStatus.FINISHED &&
  isRaffleOwner(raffle, address) && (
    <Tooltip
      hasArrow
      arrowSize={10}
      placement="left"
      label="Upkeep must be cancelled to withdraw Automation LINK">
      <Button onClick={() => onCancelClick({ update })} variant="default">
        Cancel Upkeep
      </Button>
    </Tooltip>
  )
