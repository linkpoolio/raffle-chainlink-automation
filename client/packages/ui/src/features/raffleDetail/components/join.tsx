import React, { useState, useEffect } from 'react'
import { Button, Text, Flex, Heading } from '@chakra-ui/react'

import { joinRaffle } from '@ui/features/raffleDetail'

export const Join = ({ id, reset, asyncManager }) => {
  const [success, update] = useState(false)

  const componentDidMount = () => {
    joinRaffle({
      id,
      asyncManager,
      update
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
          <Button variant="default" onClick={reset}>
            Close
          </Button>
        </Flex>
      </>
    )
  )
}
