import React from 'react'

import {
  steps,
  raffleStatus,
  raffleType,
  getParticipantStatus
} from '@ui/features/raffleDetail'

const onParticipantStatusClick = async ({
  update,
  asyncManager,
  raffle,
  identifier
}) => {
  // Require user to provide unique identifier
  if (raffle.type == raffleType.STATIC)
    return update({ step: steps.PROVIDE_IDENTIFER })
  // Automatically use users wallet address as unique identifier
  if (raffle.type == raffleType.DYNAMIC) {
    const participantStatus = await getParticipantStatus({
      id: raffle.id,
      identifier,
      asyncManager
    })

    if (participantStatus)
      update({
        identifier,
        participantStatus,
        step: steps.PARTICIPANT_STATUS
      })
  }
}

export const CheckStatusButton = (props) =>
  props.raffle?.status == raffleStatus.COMPLETE && (
    <div>
      <button onClick={() => onParticipantStatusClick(props)}>
        Did I win?
      </button>
    </div>
  )
