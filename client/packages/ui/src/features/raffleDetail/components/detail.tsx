import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

import { Loading, Error } from '@ui/components'
import { useAsyncManager, useStore } from '@ui/hooks'
import { Routes } from '@ui/Routes'
import {
  StepManager,
  getRaffle,
  raffleType,
  useActionButtons
} from '@ui/features/raffleDetail'

import { mockState } from '../mock' // TODO: remove

export const initialState = {
  raffle: null,
  step: null,
  identifier: null,
  participantStatus: null,
  isParticipant: null
}

// TODO: check for is participant on static after indentifer provided; and present a "you did not participant" type message

export const RaffleDetail = ({ id }) => {
  const store = useStore(initialState)
  const asyncManager = useAsyncManager()
  const ActionButtons = useActionButtons({ update: store.update })

  const { update } = store
  const { raffle } = store.state

  const componentDidMount = () => {
    if (id) getRaffle({ id, update, asyncManager })
  }
  useEffect(componentDidMount, [])

  const raffleDidLoad = () => {
    // TODO: on raffle load, if dynamic and if wallet connected, check if user is a participant or not
    // and save to state (e.g. store.state.isParticipant)

    // TODO: replace this with real wallet address from actual connection
    if (raffle?.type == raffleType.DYNAMIC)
      update({ identifier: mockState.walletAddress })
  }
  useEffect(raffleDidLoad, [raffle])

  return (
    <>
      <h2>Raffle Detail</h2>
      <Link to={Routes.RaffleList}>Raffle List</Link>
      <Loading asyncManager={asyncManager} />
      <Error asyncManager={asyncManager} />
      <ActionButtons.JoinRaffle
        raffle={raffle}
        identifier={store.state.identifier}
      />
      <ActionButtons.CheckStatus raffle={raffle} />
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
