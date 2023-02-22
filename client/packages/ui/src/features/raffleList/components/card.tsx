import React from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  HStack,
  Text,
  Flex,
  Divider,
  VStack,
  Heading
} from '@chakra-ui/react'

import { Status, Arrow, Permissioned } from './icons'

import { Routes, createRoute } from '@ui/Routes'
import {
  RaffleStatus,
  RaffleType,
  RaffleInstance,
  isRaffleStatic,
  isRaffleLive,
  isRaffleStaged
} from '@ui/models'

export const Card = (raffle: RaffleInstance) => {
  return (
    <Flex
      sx={{
        transform:
          'translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg)',
        transformStyle: 'preserve-3d',
        transition: 'all 250ms ease-in-out',
        ':hover': {
          transform:
            'translate3d(0px, -8px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg)',
          transformStyle: 'preserve-3d'
        },
        '.arrow': {
          transform:
            'translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg)',
          transformStyle: 'preserve-3d',
          transition: 'all 250ms ease-in-out'
        },
        '&:hover': {
          '.arrow': {
            transform:
              'translate3d(8px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg)',
            transformStyle: 'preserve-3d'
          }
        }
      }}
      direction="column"
      key={raffle.id}
      border="1px"
      borderColor="brand.gray_10"
      _hover={{
        borderColor: 'brand.primary'
      }}
      padding="6"
      bg="white"
      boxShadow="brand.base"
      borderRadius="base"
      as={Link}
      to={createRoute({ route: Routes.RaffleDetail, id: raffle.id })}>
      <VStack spacing="6" mb="6" alignItems="start">
        <Flex justify="space-between" w="100%">
          <HStack spacing="3" alignItems={'center'}>
            <Status status={raffle.status} />
            <Text fontSize={'sm'}>
              {isRaffleStaged(raffle)
                ? 'Staged'
                : isRaffleLive(raffle)
                ? 'Live'
                : 'Finished'}
            </Text>
          </HStack>
          {raffle.permissioned && (
            <HStack spacing="3" alignItems={'center'}>
              <Permissioned />
              <Text fontSize="sm">Private</Text>
            </HStack>
          )}
        </Flex>
        <Divider orientation="horizontal" />
        <Heading
          size="md"
          fontWeight="700"
          mb="6"
          color="brand.primary"
          wordBreak="break-all">
          {raffle.name}
        </Heading>
        <Divider
          display={
            isRaffleLive(raffle) && isRaffleStatic(raffle) ? 'none' : 'block'
          }
          orientation="horizontal"
        />

        {raffle.status !== RaffleStatus.FINISHED &&
          raffle.type === RaffleType.DYNAMIC && (
            <Flex justify="space-between" w="100%">
              <Text fontSize={'sm'}>Active Until:</Text>
              <Text fontSize={'sm'}>14.02.2023</Text>
            </Flex>
          )}
        {raffle.status === RaffleStatus.FINISHED && (
          <Flex justify="space-between" w="100%">
            <Text fontSize={'sm'}>Completed at:</Text>
            <Text fontSize={'sm'}>14.02.2023</Text>
          </Flex>
        )}
        {raffle.prizeName && (
          <Flex justify="space-between" w="100%">
            <Text fontSize={'sm'}>Price:</Text>
            <Text fontSize={'sm'}>{raffle.prizeName}</Text>
          </Flex>
        )}
      </VStack>
      <Box w="100%" mt="auto">
        <Divider orientation="horizontal" mb="6" />
        <Flex justify="end" w="100%">
          <Arrow className="arrow" />
        </Flex>
      </Box>
    </Flex>
  )
}
