import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { Button, Flex, Input, Heading } from '@chakra-ui/react'

import { Control } from '@ui/components'
import { steps } from '@ui/features/raffleDetail'
import { isRaffleClaimedPrize, isRaffleWinner } from '@ui/models'

export const ProvideIdentifier = ({ store, asyncManager }) => {
  const [identifier, setIdentifier] = useState('')

  const onChange = (e) => {
    setIdentifier(e.target.value)
  }

  const onSubmit = () => {
    const { raffle } = store.state

    const bytes32Identifier = ethers.utils.formatBytes32String(identifier)
    const winner = isRaffleWinner(raffle, bytes32Identifier)
    const claimedPrize = isRaffleClaimedPrize(raffle, bytes32Identifier)

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
