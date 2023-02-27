import React, { useState, useEffect } from 'react'
import { Button, Text, Flex, Heading } from '@chakra-ui/react'

import { joinRaffle } from '@ui/features/raffleDetail'

export const Join = ({ id, store, reset, asyncManager }) => {
  const [success, setSuccess] = useState(false)

  const componentDidMount = () => {
    joinRaffle({
      id,
      fee: store.state.raffle.fee,
      asyncManager,
      success: setSuccess,
      update: store.update
    })
  }
  useEffect(componentDidMount, [])

  return (
    success && (
      <>
        <Heading size="md" mb="6">
          Join Raffle
        </Heading>
        <Text>Successfully joined raffle id `{id}`.</Text>
        <Flex mt="2" justify="end">
          <Button variant="default" onClick={() => reset(store)}>
            Close
          </Button>
        </Flex>
      </>
    )
  )
}
