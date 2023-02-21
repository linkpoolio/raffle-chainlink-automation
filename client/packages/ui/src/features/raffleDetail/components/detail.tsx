import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAccount } from 'wagmi'

import { Routes } from '@ui/Routes'
import { Loading, Error } from '@ui/components'
import { useAsyncManager, useStore } from '@ui/hooks'
import { RaffleType } from '@ui/models'
import {
  StepManager,
  getRaffle,
  JoinButton,
  CheckStatusButton,
  PickWinnersButton,
  WithdrawButton
} from '@ui/features/raffleDetail'

export const initialState = {
  raffle: null,
  step: null,
  identifier: null,
  participantStatus: null,
  isParticipant: null
}

// TODO: need a contextual action button for the creator of the contract marking it as finished and performing VRF direct
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
    if (raffle?.type == RaffleType.DYNAMIC)
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
      />
      <PickWinnersButton
        raffle={raffle}
        update={store.update}
        address={address}
      />
      <WithdrawButton raffle={raffle} update={store.update} address={address} />
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
