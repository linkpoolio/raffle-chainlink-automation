import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { Loading, Error } from '@ui/components'
import { useAsyncManager } from '@ui/hooks'
import { Routes } from '@ui/Routes'
import {
  StepManager,
  useStateManager,
  initialState,
  getRaffle,
  steps,
  raffleStatus,
  raffleType
} from '@ui/features/raffleDetail'

import { mockState } from '../mock' // TODO: remove

export const RaffleDetail = ({ id }) => {
  const [raffle, setRaffle] = useState(null)
  const [state, setState] = useState(initialState)
  const asyncManager = useAsyncManager()
  const stateManager = useStateManager(setState)

  const reset = () => setState(initialState)

  const onParticipantStatusClick = () => {
    if (raffle.type == raffleType.STATIC)
      return stateManager(state, 'step', steps.PROVIDE_IDENTIFER)
    // TODO: replace mock with user's wallet address from wagmi
    if (raffle.type == raffleType.DYNAMIC)
      return stateManager(state, 'identifier', mockState.walletAddress)
  }

  const onJoinRaffle = () => stateManager(state, 'step', steps.JOIN)

  const componentDidMount = () => {
    if (id) getRaffle({ id, setRaffle, asyncManager })
    return reset()
  }
  useEffect(componentDidMount, [])

  const raffleDidLoad = () => {
    // TODO: on raffle load, if dynamic and if wallet connected, check if user is a participant or not
    // and save to state (e.g. state.isParticipant)

    // TODO: replace this with real wallet address from actual connection
    if (raffle?.type == raffleType.DYNAMIC)
      stateManager(state, 'identifier', mockState.walletAddress)
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
        state.identifier && (
          <div>
            <button onClick={onJoinRaffle}>Join Raffle</button>
          </div>
        )}
      <StepManager
        id={id}
        state={state}
        stateManager={stateManager}
        reset={reset}
      />
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
