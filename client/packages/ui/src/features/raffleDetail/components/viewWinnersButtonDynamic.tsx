import React from 'react'
import { Button } from '@chakra-ui/react'
import { steps } from '@ui/features/raffleDetail'
import { RaffleStatus, isRaffleOwner, RaffleType } from '@ui/models'

const onViewWinnerClick = ({ update }) =>
  update({ step: steps.VIEW_WINNERS_DYNAMIC })

export const CheckWinnersButtonDynamic = ({ update, raffle, address }) =>
  raffle?.status == RaffleStatus.FINISHED &&
  raffle?.type == RaffleType.DYNAMIC &&
  isRaffleOwner(raffle, address) && (
    <>
      <Button onClick={() => onViewWinnerClick({ update })} variant="default">
        View Winners
      </Button>
    </>
  )
