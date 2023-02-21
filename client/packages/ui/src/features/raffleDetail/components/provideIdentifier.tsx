import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'

import { steps } from '@ui/features/raffleDetail'

export const ProvideIdentifier = ({ store, asyncManager }) => {
  const [identifier, setIdentifier] = useState('')

  const onChange = (e) => {
    setIdentifier(e.target.value)
  }

  const onSubmit = () => {
    let winner = false
    let claimedPrize = false

    const { raffle } = store.state

    raffle.winners.map((bytes32) => {
      if (identifier == ethers.utils.parseBytes32String(bytes32)) winner = true
    })

    if (winner) {
      raffle.claimedPrizes.map((bytes32) => {
        if (identifier == ethers.utils.parseBytes32String(bytes32))
          claimedPrize = true
      })
    }

    const participantStatus =
      winner && claimedPrize ? 'WON_CLAIMED' : winner ? 'WON_UNCLAIMED' : 'LOST'

    if (participantStatus)
      store.update({
        identifier,
        participantStatus,
        step: steps.PARTICIPANT_STATUS
      })
  }

  const componentDidUnmount = () => setIdentifier('')
  useEffect(componentDidUnmount, [])

  return (
    <>
      <h3>Did I win?</h3>
      <div>Please enter your unique identifier</div>
      <input type="text" value={identifier} onChange={onChange} />
      <button
        disabled={asyncManager.loading || identifier == ''}
        onClick={onSubmit}>
        Next
      </button>
    </>
  )
}
