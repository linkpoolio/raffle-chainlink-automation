import React, { useState, useEffect } from 'react'
import { Button, Text, Flex, Heading } from '@chakra-ui/react'

import { cancelRaffle } from '@ui/features/raffleDetail'

export const CancelRaffle = ({ id, upkeepId, store, reset, asyncManager }) => {
  const [success, setSuccess] = useState(false)

  const componentDidMount = () => {
    cancelRaffle({
      id,
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
          Cancel Raffle
        </Heading>
        <Text>Successfully cancelled raffle for id `{id}`.</Text>
        <Flex mt="2" justify="end">
          <Button variant="default" onClick={() => reset(store)}>
            Close
          </Button>
        </Flex>
      </>
    )
  )
}
