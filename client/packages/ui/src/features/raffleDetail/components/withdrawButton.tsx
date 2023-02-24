import React from 'react'
import { Button } from '@chakra-ui/react'

import { steps } from '@ui/features/raffleDetail'
import { RaffleStatus, RaffleType, isRaffleOwner } from '@ui/models'

const onWithdrawClick = ({ update }) => update({ step: steps.WITHDRAW })

export const WithdrawButton = ({ update, raffle, address }) =>
  raffle?.type == RaffleType.DYNAMIC &&
  raffle?.status == RaffleStatus.FINISHED &&
  isRaffleOwner(raffle, address) &&
  !raffle.withdrawn && (
    <Button onClick={() => onWithdrawClick({ update })} variant="default">
      Withdraw LINK
    </Button>
  )
