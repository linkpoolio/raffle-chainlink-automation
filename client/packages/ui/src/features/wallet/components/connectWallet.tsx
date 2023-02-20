import React, { useEffect } from 'react'
import { useAccount, useConnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

import { WalletIcon } from './walletIcon'
import { MetaMaskIcon } from './metaMaskIcon'
import {
  useDisclosure,
  Button,
  Center,
  Flex,
  Heading,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton
} from '@chakra-ui/react'

export function ConnectWallet() {
  const { address } = useAccount()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { connect } = useConnect({
    connector: new InjectedConnector()
  })

  const addressDidChange = () => {
    if (address) onClose()
  }
  useEffect(addressDidChange, [address])

  return (
    <>
      <Button
        onClick={onOpen}
        display={{ base: 'none', md: 'flex' }}
        variant="nav"
        gap="2">
        <WalletIcon />
        Connect Wallet
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading size="lg" fontWeight="600">
              Connect your wallet
            </Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb="6" my="4" onClick={() => connect}>
            <Center>
              <Flex
                as="button"
                bg="brand.zircon"
                p="5"
                px="8"
                direction="column"
                gap="2"
                border="1px solid transparent"
                _hover={{ borderColor: 'brand.primary' }}
                borderRadius={4}>
                <MetaMaskIcon fontSize="5rem" />
                <Text color="brand.primary" fontSize="md" fontWeight="600">
                  MetaMask
                </Text>
              </Flex>
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
