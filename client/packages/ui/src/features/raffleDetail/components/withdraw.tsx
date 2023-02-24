import React, { useState, useEffect } from 'react'
import { Button, Text, Flex, Heading } from '@chakra-ui/react'

import { withdrawLink } from '@ui/features/raffleDetail'

export const Withdraw = ({ id, reset, asyncManager, store }) => {
  const [success, setSuccess] = useState(false)

  const componentDidMount = () => {
    withdrawLink({
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
          Withdraw LINK
        </Heading>
        <Text>Successfully withdrew LINK for raffle id `{id}`.</Text>
        <Flex mt="2" justify="end">
          <Button variant="default" onClick={reset}>
            Close
          </Button>
        </Flex>
      </>
    )
  )
}
