import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAccount } from 'wagmi'

import { Routes } from '@ui/Routes'
import { Loading, Error } from '@ui/components'
import { useAsyncManager, useStore } from '@ui/hooks'
import {
  StepManager,
  getRaffle,
  raffleType,
  JoinButton,
  CheckStatusButton
} from '@ui/features/raffleDetail'

export const initialState = {
  raffle: null,
  step: null,
  identifier: null,
  participantStatus: null,
  isParticipant: null
}

export const RaffleDetail = ({ id }) => {
  const store = useStore(initialState)
  const asyncManager = useAsyncManager()
  const { address } = useAccount()

  const { raffle } = store.state

  const componentDidMount = () => {
    if (id) getRaffle({ id, update: store.update, asyncManager })
  }
  useEffect(componentDidMount, [])

  const addressOrRafleDidChange = () => {
    if (raffle?.type == raffleType.DYNAMIC)
      store.update({ identifier: address })
  }
  useEffect(addressOrRafleDidChange, [address, raffle])

  return (
    <>
      <h2>Raffle Detail</h2>
      <Link to={Routes.RaffleList}>Raffle List</Link>
      <Loading asyncManager={asyncManager} />
      <Error asyncManager={asyncManager} />
      <JoinButton
        update={store.update}
        raffle={raffle}
        address={address}
        identifier={store.state.identifier}
      />
      <CheckStatusButton
        update={store.update}
        raffle={raffle}
        identifier={store.state.identifier}
        asyncManager={asyncManager}
      />
      <StepManager id={id} store={store} />
      <div>
        {raffle &&
          Object.keys(raffle).map((key) => (
            <div key={key}>
              <b>{key}</b>: {raffle[key]}
            </div>
          ))}
      </div>
    </>
  )
}
