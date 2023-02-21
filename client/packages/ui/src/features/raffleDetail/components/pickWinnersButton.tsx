import React, { useState, useEffect } from 'react'

import { steps, canWithdraw } from '@ui/features/raffleDetail'
import { RaffleStatus, isRaffleOwner } from '@ui/models'

const onPickWinnersClick = ({ update }) => update({ step: steps.PICK_WINNERS })

export const PickWinnersButton = ({ update, raffle, address }) => {
  const [hasPermission, setHasPermission] = useState(false)

  const componentDidMount = () => {
    const validStatus =
      raffle?.status == RaffleStatus.LIVE ||
      (raffle?.status == RaffleStatus.STAGED && raffle.automation)

    if (validStatus && isRaffleOwner(raffle, address))
      canWithdraw({ id: raffle.id, update: setHasPermission })
  }
  useEffect(componentDidMount, [])

  return (
    hasPermission && (
      <div>
        <button onClick={() => onPickWinnersClick({ update })}>
          Pick Winners
        </button>
      </div>
    )
  )
}
