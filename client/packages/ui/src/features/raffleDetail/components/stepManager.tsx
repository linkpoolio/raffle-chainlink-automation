import React from 'react'

import { Error, Loading, Modal } from '@ui/components'
import { useAsyncManager } from '@ui/hooks'
import {
  Join,
  ProvideIdentifier,
  ParticipantStatus,
  steps
} from '@ui/features/raffleDetail'

const getComponent = (props) => {
  switch (props.store.state.step) {
    case steps.JOIN:
      return <Join {...props} />
    case steps.PROVIDE_IDENTIFER:
      return <ProvideIdentifier {...props} />
    case steps.PARTICIPANT_STATUS:
      return <ParticipantStatus {...props} />
    default:
      return null
  }
}

export const StepManager = ({ id, store }) => {
  const asyncManager = useAsyncManager()

  const { step } = store.state

  const reset = () => store.update({ step: null })

  return (
    step && (
      <Modal onClose={reset}>
        <Loading asyncManager={asyncManager} />
        <Error asyncManager={asyncManager} />
        <h3>{step == steps.JOIN ? 'Join Raffle' : 'Did I win?'}</h3>
        {getComponent({ id, store, asyncManager, reset })}
      </Modal>
    )
  )
}
