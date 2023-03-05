import React from 'react'
import { Button } from '@chakra-ui/react'
import { steps } from '@ui/features/raffleDetail'
import { RaffleStatus, isRaffleOwner } from '@ui/models'

const onCheckWinnerClick = ({ update }) => update({ step: steps.CHECK_WINNERS })

export const CheckWinnersButton = ({ update, raffle, address, uploaded }) =>
  raffle?.status == RaffleStatus.FINISHED &&
  uploaded &&
  isRaffleOwner(raffle, address) && (
    <>
      <Button onClick={() => onCheckWinnerClick({ update })} variant="default">
        Check Winners
      </Button>
    </>
  )
