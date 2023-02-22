import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { Button, Flex, Input, Heading } from '@chakra-ui/react'

import { Control } from '@ui/components'
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
      <Heading size="md" mb="6">
        Did I win?
      </Heading>
      <Control label="Please enter your unique identifier">
        <Input type="text" value={identifier} onChange={onChange} />
      </Control>
      <Flex mt="2" justify="end">
        <Button
          variant="default"
          disabled={
            asyncManager.loading || asyncManager.pending || identifier == ''
          }
          onClick={onSubmit}>
          Next
        </Button>
      </Flex>
    </>
  )
}
