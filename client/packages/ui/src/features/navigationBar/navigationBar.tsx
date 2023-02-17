import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Heading, Box, Container, Flex, Link, Circle } from '@chakra-ui/react'
import { ConnectWallet } from '../connectWallet'

export const NavigationBar = () => (
  <Box bg="brand.white" as="header">
    <Container py="6" px="4" maxW="container.2xl">
      <Flex as="nav" height={10} alignItems="center" gap="8">
        <Link
          as={RouterLink}
          to="/"
          _hover={{
            textTransform: 'none'
          }}
          display="flex"
          alignItems="center">
          <Circle size="18px" bg="brand.primary" color="white" mr="3"></Circle>
          <Heading
            as="h1"
            size="md"
            color="brand.primary"
            fontSize="lg"
            fontWeight="700">
            Chainlink Raffles
          </Heading>
        </Link>
        <Flex alignItems="center" justifyContent="space-between" flex="1">
          <Flex gap="6">
            <Link
              as={RouterLink}
              to="/"
              fontSize="sm"
              color="brand.gray_70"
              fontWeight={600}
              _hover={{
                textTransform: 'none',
                color: 'brand.primary'
              }}
              href="/home">
              Home
            </Link>
            <Link
              as={RouterLink}
              to="/"
              fontSize="sm"
              color="brand.gray_70"
              fontWeight={600}
              _hover={{
                textTransform: 'none',
                color: 'brand.primary'
              }}
              href="/home">
              Create Raffle
            </Link>
          </Flex>
          <ConnectWallet />
        </Flex>
      </Flex>
    </Container>
  </Box>
)
