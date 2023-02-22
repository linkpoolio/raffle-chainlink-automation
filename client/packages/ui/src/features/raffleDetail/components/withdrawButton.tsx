import React, { useState, useEffect } from 'react'
import { Button } from '@chakra-ui/react'

import { steps, canWithdraw } from '@ui/features/raffleDetail'
import { RaffleStatus, isRaffleOwner } from '@ui/models'

const onWithdrawClick = ({ update }) => update({ step: steps.WITHDRAW })

export const WithdrawButton = ({ update, raffle, address }) => {
  const [hasPermission, setHasPermission] = useState(false)

  const checkCanWithdraw = () => {
    const validStatus =
      raffle?.status == RaffleStatus.FINISHED &&
      isRaffleOwner(raffle, address) &&
      !raffle.withdrawn

    if (validStatus) canWithdraw({ id: raffle.id, update: setHasPermission })
  }

  const componentDidMount = () => {
    checkCanWithdraw()
  }
  useEffect(componentDidMount, [])

  const stateDidChange = () => {
    checkCanWithdraw()
  }
  useEffect(stateDidChange, [raffle, address])

  return (
    hasPermission && (
      <Button onClick={() => onWithdrawClick({ update })} variant="default">
        Withdraw LINK
      </Button>
    )
  )
}
