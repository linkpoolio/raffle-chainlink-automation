import React, { useState, useEffect } from 'react'
import { Button, Text, Flex, Heading } from '@chakra-ui/react'

import { pickWinners } from '@ui/features/raffleDetail'

export const PickWinners = ({ id, reset, asyncManager }) => {
  const [success, update] = useState(false)

  const componentDidMount = () => {
    pickWinners({
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
          Pick Winners
        </Heading>
        <Text>Successfully picked winners for raffle id `{id}`.</Text>
        <Flex mt="2" justify="end">
          <Button variant="default" onClick={reset}>
            Close
          </Button>
        </Flex>
      </>
    )
  )
}
