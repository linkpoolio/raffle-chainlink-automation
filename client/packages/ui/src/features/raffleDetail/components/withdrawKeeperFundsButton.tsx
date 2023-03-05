import React from 'react'
import { Button, Tooltip } from '@chakra-ui/react'

import { steps } from '@ui/features/raffleDetail'
import { RaffleStatus, isRaffleOwner } from '@ui/models'

const onWithdrawClick = ({ update }) => update({ step: steps.WITHDRAW_KEEPER })

export const WithdrawKeeperButton = ({ update, raffle, address }) =>
  raffle?.status == RaffleStatus.FINISHED &&
  isRaffleOwner(raffle, address) && (
    <Tooltip
      hasArrow
      arrowSize={10}
      placement="right"
      label="Block time must be reached before withdrawal is available">
      <Button onClick={() => onWithdrawClick({ update })} variant="default">
        Withdraw Automation LINK
      </Button>
    </Tooltip>
  )
