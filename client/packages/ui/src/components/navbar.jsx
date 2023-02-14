import React from 'react'
import { Flex, Link, Heading } from '@chakra-ui/react'
import styles from '../styles/layout.module.css'
import { useIsMounted } from '../hooks/app-hooks'
import { StandardMenu } from './standard-menu'
import { Wallet } from './wallet'
export default function Navbar({ width }) {
  const isMounted = useIsMounted()
  return (
    <Flex
      justifyContent="space-around"
      alignItems="center"
      height={['8vh', '10vh', '12vh']}
      bg="white"
      boxShadow="Dark lg"
      padding={'15px'}>
      <Flex alignItems="center" justifyContent="space-between" width="100%">
        <Heading
          color="black"
          size="lg"
          letterSpacing={2}
          className={styles.headerTitle}>
          <Link style={{ textDecoration: 'none' }} href="/">
            Chainlink Raffles
          </Link>
        </Heading>
        {isMounted ? null : null}
        <Wallet width={width} />
      </Flex>
      {<StandardMenu width={width} />}
    </Flex>
  )
}
