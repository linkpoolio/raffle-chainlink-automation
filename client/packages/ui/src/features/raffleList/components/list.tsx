import React, { useEffect } from 'react'
import { Container, Grid } from '@chakra-ui/react'

import { LoadingList, Error } from '@ui/components'
import { useAsyncManager, useStore } from '@ui/hooks'
import { getRaffleList, Row, Filters } from '@ui/features/raffleList'

export const initialState = {
  list: []
}

const initialFilterState = {
  ownedByMe: false,
  status: ''
}

export const RaffleList = () => {
  const store = useStore(initialState)
  const filterStore = useStore(initialFilterState)
  const asyncManager = useAsyncManager()

  const { state, update } = store
  const filters = filterStore.state

  const walletAddress = '0x98765432109876543210' // TODO: remove; replace with real address from wagmi

  const componentDidMount = () => {
    getRaffleList({ update, asyncManager })
  }
  useEffect(componentDidMount, [])

  const componentDidUnmount = () => filterStore.reset()
  useEffect(componentDidUnmount, [])

  const filterList = (raffle) => {
    const status = filters.status == '' || filters.status == raffle.status
    const ownedByMe = !filters.ownedByMe || raffle.creatorId == walletAddress

    return status && ownedByMe
  }

  return (
    <Container maxW="container.xl" my="8">
      <Error asyncManager={asyncManager} />
      <Filters walletAddress={walletAddress} store={filterStore} />
      <Grid templateColumns="repeat(3, 1fr)" gap={16} my="4">
        <LoadingList asyncManager={asyncManager} />
        {state.list.filter(filterList).map(Row)}
      </Grid>
    </Container>
  )
}
