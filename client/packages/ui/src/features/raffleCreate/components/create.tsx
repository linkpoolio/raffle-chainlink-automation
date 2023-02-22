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
  Grid,
  GridItem,
  Button
} from '@chakra-ui/react'

import { Routes } from '@ui/Routes'
import { Error, Control } from '@ui/components'
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
  prizeName: '',
  totalWinners: 1
}

export const RaffleCreate = () => {
  const { address } = useAccount()

  const store = useStore({
    ...baseInitialState,
    ...initialStaticState
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
          <Control label="Select Raffle Type">
            <Select
              value={type}
              onChange={onTypeChange}
              data-testid="select-type">
              <option value={RaffleType.STATIC}>Static</option>
              <option value={RaffleType.DYNAMIC}>Dynamic</option>
            </Select>
          </Control>
        </GridItem>

        <GridItem>
          <Control label="Raffle Name" helper="Max 40 characters">
            <Input
              type="text"
              placeholder="Name"
              value={state.name}
              onChange={onTextChange('name')}
            />
          </Control>
        </GridItem>

        <GridItem>
          <Control label="Number of winners" helper="Max 120 winners">
            <Input
              type="text"
              placeholder="Number"
              value={state.totalWinners}
              onChange={onTextChange('totalWinners')}
            />
          </Control>
        </GridItem>

        <GridItem>
          <Control label="Prize description" helper="Max 40 charcters">
            <Input
              type="text"
              placeholder="Name"
              value={state.prizeName}
              onChange={onTextChange('prizeName')}
            />
          </Control>
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
