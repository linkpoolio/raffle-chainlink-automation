import React from 'react'
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure
} from '@chakra-ui/react'
import { goerli, useConnect } from 'wagmi'

export const ConnectButton = () => {
  const { connect, error, connectors, isLoading, pendingConnector } =
    useConnect({
      chainId: goerli.id
    })
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button onClick={onOpen} variant="base"></Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="rgb(55,91,210)">
          <ModalHeader color="white">Connect</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack>
              {connectors &&
                connectors.map((connector) => (
                  <Button
                    variant="wallet"
                    disabled={!connector.ready}
                    key={connector.id}
                    onClick={() => connect({ connector })}>
                    {connector.name}
                    {isLoading &&
                      pendingConnector?.id === connector.id &&
                      ' (connecting)'}
                  </Button>
                ))}
              {error && <Box>{error?.message ?? 'Failed to connect'}</Box>}
            </Stack>
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </Modal>
    </>
  )
}
