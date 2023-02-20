import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { Container } from '@chakra-ui/react'

import { Routes } from '@ui/Routes'
import { Loading, Error } from '@ui/components'
import { useAsyncManager, useStore } from '@ui/hooks'
import {
  createRaffle,
  FormStatic,
  FormDynamic,
  initialStaticState,
  initialDynamicState
} from '@ui/features/raffleCreate'
import { raffleType } from '@ui/features/raffleDetail'

export const baseInitialState = {
  name: '',
  createdBy: null,
  winners: 1,
  prize: ''
}

// TODO: add form validation (required inputs, input requirements, etc)
// TODO: add reusable form input components
export const RaffleCreate = () => {
  const { address } = useAccount()

  const store = useStore({
    ...baseInitialState,
    ...initialStaticState,
    createdBy: address
  })
  const asyncManager = useAsyncManager()
  const history = useHistory()
  const [type, setType] = useState(raffleType.STATIC)

  const { state, update } = store

  const componentDidMount = () => {
    if (!address) history.push(Routes.RaffleList)
  }

  const componentDidUnmount = () => store.reset()

  useEffect(componentDidMount, [])
  useEffect(componentDidUnmount, [])

  const onTypeChange = (e) => {
    if (e.target.value == raffleType.STATIC) {
      setType(raffleType.STATIC)
      update({
        ...baseInitialState,
        ...initialStaticState
      })
    }
    if (e.target.value == raffleType.DYNAMIC) {
      setType(raffleType.DYNAMIC)
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
    <Container maxW="container.xl" my="8">
      <Loading asyncManager={asyncManager} />
      <Error asyncManager={asyncManager} />
      <h2>Create Raffle</h2>

      <div>
        <select value={type} onChange={onTypeChange} data-testid="select-type">
          <option value={raffleType.STATIC}>Static</option>
          <option value={raffleType.DYNAMIC} data-testid="select-dynamic">
            Dynamic
          </option>
        </select>
      </div>

      <span>Name</span>
      <input type="text" value={state.name} onChange={onTextChange('name')} />

      <div>
        <span>Number of winners</span>
        <input
          type="text"
          value={state.winners}
          onChange={onTextChange('winners')}
        />
      </div>

      <div>
        <span>Prize description</span>
        <input
          type="text"
          value={state.prize}
          onChange={onTextChange('prize')}
        />
      </div>

      {type == raffleType.STATIC ? (
        <FormStatic update={update} />
      ) : (
        <FormDynamic
          state={state}
          onTextChange={onTextChange}
          onCheckboxChange={onCheckboxChange}
        />
      )}

      <div>
        <button disabled={asyncManager.loading} onClick={onSubmit}>
          Create
        </button>
      </div>
    </Container>
  )
}
