import React, { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { Switch, FormLabel, Select, HStack, Box, Flex } from '@chakra-ui/react'

import { RaffleStatus } from '@ui/models'

export const initialFilterState = {
  ownedByMe: false,
  status: ''
}

export const filterList = (filters, address) => (raffle) => {
  const status = filters.status == '' || filters.status == raffle.status
  const ownedByMe = !filters.ownedByMe || raffle.owner == address

  return status && ownedByMe
}

export const Filters = ({ store }) => {
  const { address } = useAccount()

  const { state, update, reset } = store

  const onFilterStatus = (e) => update({ status: e.target.value })
  const onFilterOwnedByMe = () => update({ ownedByMe: !state.ownedByMe })

  const componentDidUnmount = () => reset()
  useEffect(componentDidUnmount, [])

  return (
    <>
      <Box my="8">
        <HStack spacing="24px">
          {address && (
            <Flex align="center">
              <FormLabel htmlFor="ownerd-by-me" mb="0" w="105px">
                Owned by Me
              </FormLabel>
              <Switch
                id="ownerd-by-me"
                checked={state.ownedByMe}
                onChange={onFilterOwnedByMe}
              />
            </Flex>
          )}
          <Select
            bg="white"
            value={state.status}
            onChange={onFilterStatus}
            maxWidth="250px">
            <option value="">All</option>
            <option value={RaffleStatus.STAGED}>Staged</option>
            <option value={RaffleStatus.LIVE}>Live</option>
            <option value={RaffleStatus.RESOLVING}>Resolving</option>
            <option value={RaffleStatus.FINISHED}>Finished</option>
          </Select>
        </HStack>
      </Box>
    </>
  )
}
