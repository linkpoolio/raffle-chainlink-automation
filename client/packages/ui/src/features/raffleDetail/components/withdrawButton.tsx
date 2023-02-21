import React from 'react'

import { steps } from '@ui/features/raffleDetail'
import { RaffleStatus, isRaffleOwner } from '@ui/models'

const onWithdrawClick = ({ update }) => update({ step: steps.JOIN })

// TODO: this should be a call to the contract function called something like "canWithdraw"
const canWithdraw = (id) => !!id

export const WithdrawButton = ({ update, raffle, address }) =>
  raffle?.status == RaffleStatus.FINISHED &&
  isRaffleOwner(raffle, address) &&
  !raffle.withdrawn &&
  canWithdraw(raffle.id) && (
    <div>
      <button onClick={() => onWithdrawClick({ update })}>Withdraw LINK</button>
    </div>
  )
