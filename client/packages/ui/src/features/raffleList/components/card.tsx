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

import { StatusIcons, ArrowIcon, PermissionedIcon } from '@ui/components'
import { Routes, createRoute } from '@ui/Routes'
import {
  RaffleStatus,
  RaffleType,
  RaffleInstance,
  isRaffleLive,
  isRaffleStaged
} from '@ui/models'
import { formatUnixTs, formatFinishDate } from '@ui/utils'

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
            <StatusIcons status={raffle.status} />
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
              <PermissionedIcon />
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
        <Divider orientation="horizontal" />
        {raffle.prizeName && (
          <Flex justify="space-between" w="100%">
            <Text fontSize={'sm'}>Prize:</Text>
            <Text fontSize={'sm'}>{raffle.prizeName}</Text>
          </Flex>
        )}
        {raffle.startDate && (
          <Flex justify="space-between" w="100%">
            <Text fontSize={'sm'}>Start Date:</Text>
            <Text fontSize={'sm'}>{formatUnixTs(raffle.startDate)}</Text>
          </Flex>
        )}

        {raffle.status !== RaffleStatus.FINISHED &&
          raffle.type === RaffleType.DYNAMIC && (
            <Flex justify="space-between" w="100%">
              <Text fontSize={'sm'}>Active Until:</Text>
              <Text fontSize={'sm'}>
                {formatFinishDate(raffle.startDate, raffle.hours)}
              </Text>
            </Flex>
          )}
      </VStack>
      <Box w="100%" mt="auto">
        <Divider orientation="horizontal" mb="6" />
        <Flex justify="end" w="100%">
          <ArrowIcon className="arrow" />
        </Flex>
      </Box>
    </Flex>
  )
}

// startDate
