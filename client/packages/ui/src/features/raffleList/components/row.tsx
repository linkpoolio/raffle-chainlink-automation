import React from 'react'
import { Link } from 'react-router-dom'
import { SkeletonText, Box } from '@chakra-ui/react'

import { Routes, createRoute } from '@ui/Routes'

export const Row = (raffle) => (
  <Box
    key={raffle.id}
    as={Link}
    to={createRoute({ route: Routes.RaffleDetail, id: raffle.id })}
    padding="6"
    boxShadow="brand.base"
    bg="white"
    borderRadius="md">
    {raffle.name}
    <SkeletonText mt="4" noOfLines={4} spacing="4" skeletonHeight="6" />
  </Box>
)
