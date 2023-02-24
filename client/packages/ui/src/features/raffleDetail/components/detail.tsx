import React, { useEffect } from 'react'
import { useAccount } from 'wagmi'
import {
  Container,
  Heading,
  Center,
  Text,
  Box,
  Flex,
  HStack,
  Divider
} from '@chakra-ui/react'

import {
  Loading,
  Pending,
  Error,
  StatusIcons,
  PermissionedIcon
} from '@ui/components'
import { useAsyncManager, useStore } from '@ui/hooks'
import {
  RaffleType,
  isRaffleStatic,
  isRaffleLive,
  isRaffleStaged,
  RaffleStatus
} from '@ui/models'
import {
  StepManager,
  getRaffle,
  JoinButton,
  CheckStatusButton,
  PickWinnersButton,
  WithdrawButton
} from '@ui/features/raffleDetail'
import { formatUnixTs, formatFinishDate } from '@ui/utils'

export const initialState = {
  raffle: null,
  step: null,
  identifier: null,
  participantStatus: null,
  isParticipant: null,
  claimableLink: null
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
  const { address } = useAccount()
  const store = useStore({
    ...initialState,
    identifier: address ? address : initialState.identifier
  })
  const asyncManager = useAsyncManager()

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
    raffle?.id && (
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
        <Center flexDirection="column" mb="6">
          <Heading
            size="xl"
            fontWeight="700"
            mb="6"
            wordBreak={'break-all'}
            textAlign="center">
            {raffle.name}
          </Heading>
        </Center>
        <Center flexDirection="column" mb="14">
          <HStack bg="#F6F7FD" p="4" px="8" borderRadius="2xl" spacing="6">
            <HStack spacing="3" alignItems={'center'}>
              <StatusIcons status={raffle.status} />
              <Text fontSize={'sm'}>
                {isRaffleStaged(raffle)
                  ? 'Staged'
                  : isRaffleLive(raffle)
                  ? 'Live'
                  : 'Finished'}
              </Text>
            </HStack>

            <>
              <Divider orientation="vertical" height="21px" />
              <HStack spacing="3" alignItems={'center'}>
                <Text fontSize="sm">
                  {isRaffleStatic(raffle) ? 'Static' : 'Dynamic'} Raffle
                </Text>
              </HStack>
            </>

            {raffle.permissioned && (
              <>
                <Divider orientation="vertical" height="21px" />
                <HStack spacing="3" alignItems={'center'}>
                  <PermissionedIcon />
                  <Text fontSize="sm">Private</Text>
                </HStack>
              </>
            )}
          </HStack>
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
          <Row name="Name" value={raffle.name} />
          <Row
            name="Type"
            value={isRaffleStatic(raffle) ? 'Static' : 'Dynamic'}
          />
          <Row name="Start Date" value={formatUnixTs(raffle.startDate)} />

          {raffle.status !== RaffleStatus.FINISHED &&
            raffle.type === RaffleType.DYNAMIC && (
              <Row
                name="Active Until"
                value={formatFinishDate(raffle.startDate, raffle.hours)}
              />
            )}

          <Row name="Permissioned" value={raffle.permissioned ? 'Yes' : 'No'} />
          <Row name="Prize Name" value={raffle.prizeName} />
          <Row name="Prize Worth" value={raffle.prizeWorth + ' ETH'} />
          <Row name="Entrance Fee" value={raffle.fee + ' ETH'} />
          <Row
            name="Contestants Number"
            value={raffle.contestantsAddresses?.length}
          />
          <Row name="Owner" value={raffle.owner} />

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
  )
}
