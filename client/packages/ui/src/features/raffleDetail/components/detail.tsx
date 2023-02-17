import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { Loading, Error } from '@ui/components'
import { useAsyncManager, useStore } from '@ui/hooks'
import { Routes } from '@ui/Routes'
import {
  StepManager,
  getRaffle,
  steps,
  raffleStatus,
  raffleType
} from '@ui/features/raffleDetail'

import { mockState } from '../mock' // TODO: remove

export const initialState = {
  step: null,
  identifier: null,
  participantStatus: null,
  isParticipant: null
}

// TODO: check for is participant on static after indentifer provided; and present a "you did not participant" type message

export const RaffleDetail = ({ id }) => {
  const [raffle, setRaffle] = useState(null)
  const asyncManager = useAsyncManager()
  const store = useStore(initialState)

  const { update } = store

  const onParticipantStatusClick = () => {
    if (raffle.type == raffleType.STATIC)
      return update({ step: steps.PROVIDE_IDENTIFER })
    // TODO: replace mock with user's wallet address from wagmi
    if (raffle.type == raffleType.DYNAMIC)
      return update({ identifier: mockState.walletAddress })
  }

  const onJoinRaffle = () => update({ step: steps.JOIN })

  const componentDidMount = () => {
    if (id) getRaffle({ id, setRaffle, asyncManager })
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
      {raffle?.status == raffleStatus.COMPLETE && (
        <div>
          <button onClick={onParticipantStatusClick}>Did I win?</button>
        </div>
      )}
      {raffle?.status == raffleStatus.IN_PROGRESS &&
        raffle?.type == raffleType.DYNAMIC &&
        store.state.identifier && (
          <div>
            <button onClick={onJoinRaffle}>Join Raffle</button>
          </div>
        )}
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
