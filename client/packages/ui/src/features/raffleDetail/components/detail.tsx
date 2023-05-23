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
  Divider,
  useMediaQuery
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
  isRaffleFinished,
  RaffleStatus
} from '@ui/models'
import {
  StepManager,
  JoinButton,
  CheckStatusButton,
  PickWinnersButton,
  WithdrawButton,
  CancelUpkeepButton,
  WithdrawKeeperButton,
  CheckWinnersButton
} from '@ui/features/raffleDetail'
import { formatUnixTs, formatFinishDate, shortenAddress } from '@ui/utils'
import { UploadWinners } from '@ui/features/raffleDetail'
import { getRaffleHook } from '@ui/api/contracts'

export const initialState = {
  raffle: null,
  step: null,
  identifier: null,
  participantStatus: null,
  isParticipant: null,
  claimableLink: null,
  participants: []
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
  const [isLargerThanMd] = useMediaQuery('(min-width: 48em)')
  const { address } = useAccount()
  const store = useStore({
    ...initialState,
    identifier: address ? address : initialState.identifier
  })
  const asyncManager = useAsyncManager()

  const { raffle } = store.state
  getRaffleHook(store, id)

  console.log(raffle)

  const addressOrRaffleDidChange = () => {
    if (raffle?.type == RaffleType.DYNAMIC)
      store.update({ identifier: address })
  }
  useEffect(addressOrRaffleDidChange, [address, raffle])

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
                  : isRaffleFinished(raffle)
                  ? 'Finished'
                  : 'Resolving'}
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
          <Row name="ID" value={raffle.id} />
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
                value={
                  raffle.automation
                    ? formatFinishDate(raffle.startDate, raffle.hours)
                    : 'Open-Ended'
                }
              />
            )}

          <Row name="Permissioned" value={raffle.permissioned ? 'Yes' : 'No'} />
          <Row name="Prize Name" value={raffle.prizeName} />
          <Row name="Prize Worth" value={raffle.prizeWorth + ' ETH'} />
          <Row name="Entrance Fee" value={raffle.fee + ' ETH'} />
          <Row name="Contestants" value={raffle.contestantsAddresses?.length} />
          <Row
            name="Owner"
            value={isLargerThanMd ? raffle.owner : shortenAddress(raffle.owner)}
          />

          {raffle.status !== RaffleStatus.RESOLVING && (
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
                  address={address}
                />
                <PickWinnersButton
                  raffle={raffle}
                  update={store.update}
                  address={address}
                />

                <CancelUpkeepButton
                  raffle={raffle}
                  update={store.update}
                  address={address}
                />
                <WithdrawButton
                  raffle={raffle}
                  update={store.update}
                  address={address}
                />
                <WithdrawKeeperButton
                  raffle={raffle}
                  update={store.update}
                  address={address}
                />
                <CheckWinnersButton
                  raffle={raffle}
                  update={store.update}
                  address={address}
                  uploaded={store.state.uploaded}
                />
                <StepManager
                  id={id}
                  upkeepId={raffle.upkeepId}
                  store={store}
                  address={address}
                  raffle={raffle}
                />
              </HStack>
            </Center>
          )}
          <Center h="60px">
            <UploadWinners
              update={store.update}
              raffle={raffle}
              address={address}
            />
          </Center>
        </Box>
      </Container>
    )
  )
}
