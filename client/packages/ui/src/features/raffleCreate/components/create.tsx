import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useAccount } from 'wagmi'
import {
  Container,
  Heading,
  Center,
  Text,
  Select,
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  Grid,
  GridItem,
  Button
} from '@chakra-ui/react'

import { Routes } from '@ui/Routes'
import { Error } from '@ui/components'
import { useAsyncManager, useStore } from '@ui/hooks'
import {
  createRaffle,
  FormStatic,
  FormDynamic,
  initialStaticState,
  initialDynamicState
} from '@ui/features/raffleCreate'
import { RaffleType } from '@ui/models'

export const baseInitialState = {
  name: '',
  createdBy: null,
  totalWinners: 1,
  prize: ''
}

// TODO: (nice to have) add resuable form components with form validation
export const RaffleCreate = () => {
  const { address } = useAccount()

  const store = useStore({
    ...baseInitialState,
    ...initialStaticState,
    createdBy: address
  })
  const asyncManager = useAsyncManager()
  const history = useHistory()
  const [type, setType] = useState(RaffleType.STATIC)

  const { state, update } = store

  const componentDidMount = () => {
    if (!address) history.push(Routes.RaffleList)
  }

  const componentDidUnmount = () => store.reset()

  useEffect(componentDidMount, [])
  useEffect(componentDidUnmount, [])

  const onTypeChange = (e) => {
    if (e.target.value == RaffleType.STATIC) {
      setType(RaffleType.STATIC)
      update({
        ...baseInitialState,
        ...initialStaticState
      })
    }
    if (e.target.value == RaffleType.DYNAMIC) {
      setType(RaffleType.DYNAMIC)
      update({
        ...baseInitialState,
        ...initialDynamicState
      })
    }
  }

  const onTextChange = (key) => (e) => update({ [key]: e.target.value })

  const onCheckboxChange = (key) => () => update({ [key]: !state[key] })

  const onSubmit = () => createRaffle({ state, asyncManager, history })

  return (
    <Container
      maxW="container.xl"
      my="20"
      p="10"
      pb="24"
      bg="brand.white"
      boxShadow="brand.base"
      borderRadius="base">
      <Error asyncManager={asyncManager} />

      <Center flexDirection="column" mb="14">
        <Heading size="2xl" fontWeight="700" mb="6">
          Create Raffle
        </Heading>
        <Text fontSize="lg" color="brand.gray_70" fontWeight="600">
          Create dynamic or static raffle
        </Text>
      </Center>
      <Grid templateColumns="repeat(3, 1fr)" gap={14} rowGap={14} mb={12}>
        <GridItem>
          <FormControl>
            <FormLabel>Select Raffle Type</FormLabel>
            <Select
              value={type}
              onChange={onTypeChange}
              data-testid="select-type">
              <option value={RaffleType.STATIC}>Static</option>
              <option value={RaffleType.DYNAMIC}>Dynamic</option>
            </Select>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel>Raffle Name</FormLabel>
            <Input
              type="text"
              placeholder="Name"
              value={state.name}
              onChange={onTextChange('name')}
            />
            <FormHelperText>Max 40 characters.</FormHelperText>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel>Number of winners</FormLabel>
            <Input
              type="text"
              placeholder="Number"
              value={state.totalWinners}
              onChange={onTextChange('totalWinners')}
            />
            <FormHelperText>Max 120 winners</FormHelperText>
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl>
            <FormLabel>Prize description</FormLabel>
            <Input
              type="text"
              placeholder="Number"
              value={state.prize}
              onChange={onTextChange('prize')}
            />
            <FormHelperText>Max 40 charcters</FormHelperText>
          </FormControl>
        </GridItem>
        {type == RaffleType.STATIC ? (
          <FormStatic update={update} />
        ) : (
          <FormDynamic
            state={state}
            onTextChange={onTextChange}
            onCheckboxChange={onCheckboxChange}
          />
        )}
      </Grid>
      <Center>
        <Button
          variant="default"
          disabled={asyncManager.loading}
          onClick={onSubmit}
          isLoading={asyncManager.loading}
          loadingText="Submitting">
          Create
        </Button>
      </Center>
    </Container>
  )
}
