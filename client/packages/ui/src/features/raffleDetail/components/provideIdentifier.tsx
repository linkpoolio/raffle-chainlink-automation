import React, { useState, useEffect } from 'react'

import { getParticipantStatus, steps } from '@ui/features/raffleDetail'

export const ProvideIdentifier = ({ id, store, asyncManager }) => {
  const [identifier, setIdentifier] = useState('')

  const onChange = (e) => {
    setIdentifier(e.target.value)
  }

  const onSubmit = async () => {
    const participantStatus = await getParticipantStatus({
      id,
      identifier,
      asyncManager
    })

    if (participantStatus)
      store.update({
        identifier,
        participantStatus,
        step: steps.PARTICIPANT_STATUS
      })
  }

  const componentDidUnmount = () => setIdentifier('')
  useEffect(componentDidUnmount, [])

  return (
    <>
      <div>Please enter your unique identifier</div>
      <input type="text" value={identifier} onChange={onChange} />
      <button
        disabled={asyncManager.loading || identifier == ''}
        onClick={onSubmit}>
        Next
      </button>
    </>
  )
}
