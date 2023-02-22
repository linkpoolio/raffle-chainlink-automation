import React, { useEffect } from 'react'
import { useAccount } from 'wagmi'
import {
  Container,
  Heading,
  Center,
  Text,
  Box,
  Flex,
  HStack
} from '@chakra-ui/react'

import { Loading, Pending, Error } from '@ui/components'
import { useAsyncManager, useStore } from '@ui/hooks'
import {
  RaffleType,
  isRaffleStatic,
  isRaffleLive,
  isRaffleStaged
} from '@ui/models'
import {
  StepManager,
  getRaffle,
  JoinButton,
  CheckStatusButton,
  PickWinnersButton,
  WithdrawButton
} from '@ui/features/raffleDetail'

export const initialState = {
  raffle: null,
  step: null,
  identifier: null,
  participantStatus: null,
  isParticipant: null
}

const Row = ({ name, value }) => {
  return (
    <Flex
      justifyContent="space-between"
      borderBottom="1px"
      borderColor="brand.gray_10"
      pb="6"
      my="6">
      <Text>{name}</Text>
      <Text>{value}</Text>
    </Flex>
  )
}

export const RaffleDetail = ({ id }) => {
  const store = useStore(initialState)
  const asyncManager = useAsyncManager()
  const { address } = useAccount()

  const { raffle } = store.state
  const componentDidMount = () => {
    if (id) getRaffle({ id, update: store.update, asyncManager })
  }
  useEffect(componentDidMount, [])

  const addressOrRafleDidChange = () => {
    if (raffle?.type == RaffleType.DYNAMIC)
      store.update({ identifier: address })
  }
  useEffect(addressOrRafleDidChange, [address, raffle])

  return (
    <Container
      maxW="container.md"
      my="20"
      p="10"
      pb="24"
      bg="brand.white"
      boxShadow="brand.base"
      borderRadius="base">
      <Loading asyncManager={asyncManager} />
      <Pending asyncManager={asyncManager} />
      <Error asyncManager={asyncManager} />
      <Center flexDirection="column" mb="14">
        <Heading
          size="xl"
          fontWeight="700"
          mb="6"
          wordBreak={'break-all'}
          textAlign="center">
          {raffle?.name}
        </Heading>
        <Text fontSize="lg" color="brand.gray_70" fontWeight="600">
          View and manage raffle
        </Text>
      </Center>

      <Box>
        <Row
          name="Status"
          value={
            isRaffleStaged(raffle)
              ? 'Staged'
              : isRaffleLive(raffle)
              ? 'Live'
              : 'Finished'
          }
        />
        <Row name="Name" value={raffle?.name} />
        <Row
          name="Type"
          value={isRaffleStatic(raffle) ? 'Static' : 'Dynamic'}
        />
        <Row name="Owner" value={raffle?.owner} />
        <Center>
          <HStack spacing="6">
            <JoinButton
              update={store.update}
              raffle={raffle}
              address={address}
              identifier={store.state.identifier}
            />
            <CheckStatusButton
              update={store.update}
              raffle={raffle}
              identifier={store.state.identifier}
            />
            <PickWinnersButton
              raffle={raffle}
              update={store.update}
              address={address}
            />
            <WithdrawButton
              raffle={raffle}
              update={store.update}
              address={address}
            />
            <StepManager id={id} store={store} />
          </HStack>
        </Center>
      </Box>
    </Container>
  )
}
