import React, { useState, useEffect } from 'react'
import { Button, Text, Flex, Heading, Link } from '@chakra-ui/react'
import { useNetwork } from 'wagmi'

import { pickWinners } from '@ui/features/raffleDetail'

export const PickWinners = ({ id, reset, asyncManager, store }) => {
  const [success, setSuccess] = useState(false)
  const [txHash, setTxHash] = useState(null)
  const { chain } = useNetwork()

  useEffect(() => {
    pickWinners({
      id,
      asyncManager,
      success: setSuccess,
      txHash: setTxHash
    })
  }, [])

  return (
    success && (
      <>
        <Heading size="md" mb="6">
          Pick Winners
        </Heading>
        <Text>Successfully picked winners for raffle id `{id}`.</Text>
        {txHash && (
          <Text>
            <Link
              href={`${chain.blockExplorers.default.url}/tx/${txHash}/#eventlogs`}
              isExternal>
              View VRF Request
            </Link>
          </Text>
        )}
        <Flex mt="2" justify="end">
          <Button variant="default" onClick={() => reset(store)}>
            Close
          </Button>
        </Flex>
      </>
    )
  )
}
