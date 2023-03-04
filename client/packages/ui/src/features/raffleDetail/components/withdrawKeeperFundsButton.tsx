import React from 'react'
import { Button } from '@chakra-ui/react'

import { steps } from '@ui/features/raffleDetail'
import { RaffleStatus, isRaffleOwner } from '@ui/models'

const onWithdrawClick = ({ update }) => update({ step: steps.WITHDRAW_KEEPER })

export const WithdrawKeeperButton = ({ update, raffle, address }) =>
  raffle?.status == RaffleStatus.FINISHED &&
  isRaffleOwner(raffle, address) && (
    <Button onClick={() => onWithdrawClick({ update })} variant="default">
      Withdraw Automation LINK
    </Button>
  )
