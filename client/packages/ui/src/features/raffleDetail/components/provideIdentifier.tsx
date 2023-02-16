import React, { useState, useEffect } from 'react'

import { getParticipantStatus, steps } from '@ui/features/raffleDetail'

export const ProvideIdentifier = ({
  id,
  state,
  stateManager,
  asyncManager
}) => {
  const [input, setInput] = useState('')

  const onChange = (e) => {
    setInput(e.target.value)
  }

  const onSubmit = async () => {
    const response = await getParticipantStatus({
      id,
      identifier: input,
      asyncManager
    })

    if (response)
      stateManager(
        state,
        ['identifier', 'participantStatus', 'step'],
        [input, response, steps.PARTICIPANT_STATUS]
      )
  }

  const componentDidUnmount = () => setInput('')
  useEffect(componentDidUnmount, [])

  return (
    <>
      <div>Please enter your unique identifier</div>
      <input type="text" value={input} onChange={onChange} />
      <button disabled={asyncManager.loading || input == ''} onClick={onSubmit}>
        Next
      </button>
    </>
  )
}
