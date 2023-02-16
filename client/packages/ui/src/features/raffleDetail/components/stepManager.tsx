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
  switch (props.state.step) {
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

export const StepManager = (props) => {
  const asyncManager = useAsyncManager()

  return (
    props.state.step && (
      <Modal onClose={props.reset}>
        <Loading asyncManager={asyncManager} />
        <Error asyncManager={asyncManager} />
        <h3>{props.state.step == steps.JOIN ? 'Join Raffle' : 'Did I win?'}</h3>
        {getComponent({ ...props, asyncManager })}
      </Modal>
    )
  )
}
