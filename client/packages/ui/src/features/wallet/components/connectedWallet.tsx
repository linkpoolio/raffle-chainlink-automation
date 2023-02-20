import React from 'react'
import { useAccount, useDisconnect } from 'wagmi'

import { shortenAddress } from '@ui/utils'
import { WalletIcon } from './walletIcon'
import { MetaMaskIcon } from './metaMaskIcon'
import { ChevronDownIcon, ExternalLinkIcon } from '@chakra-ui/icons'
import {
  Button,
  Text,
  Flex,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Link
} from '@chakra-ui/react'

export function ConnectedWallet() {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          variant="nav"
          gap="2"
          borderColor="brand.gray_20"
          borderWidth="1px"
          color="brand.biscay">
          <WalletIcon />
          {shortenAddress(address)}
          <ChevronDownIcon w={6} h={6} />
        </Button>
      </PopoverTrigger>
      <PopoverContent p="3">
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader as={Flex} alignItems="center">
          <Text mr="2">Connected with MetaMask</Text>
          <MetaMaskIcon fontSize="1rem" />
        </PopoverHeader>
        <PopoverBody>
          <Flex
            as={Link}
            alignItems="center"
            color="brand.link"
            fontWeight="bold"
            to="https://etherscan.io"
            isExternal
            fontSize="sm">
            {shortenAddress(address)} <ExternalLinkIcon mx="2px" />
          </Flex>
        </PopoverBody>
        <Button
          onClick={() => disconnect()}
          display={{ base: 'none', md: 'flex' }}
          variant="nav"
          gap="2">
          Disconnect
        </Button>
      </PopoverContent>
    </Popover>
  )
}
