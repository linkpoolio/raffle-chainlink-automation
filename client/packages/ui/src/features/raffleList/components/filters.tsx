import React, { useEffect } from 'react'

import { raffleStatus } from '@ui/features/raffleDetail'

export const Filters = ({ walletAddress, store }) => {
  const { state, update, reset } = store

  const onFilterStatus = (e) => update({ status: e.target.value })
  const onFilterOwnedByMe = () => update({ ownedByMe: !state.ownedByMe })

  const componentDidUnmount = () => reset()
  useEffect(componentDidUnmount, [])

  return (
    <>
      <h4>Filters</h4>
      {walletAddress && (
        <>
          <span>Owned by Me</span>
          <input
            type="checkbox"
            checked={state.ownedByMe}
            onChange={onFilterOwnedByMe}
          />
        </>
      )}
      <>
        <span>Status</span>
        <select value={state.status} onChange={onFilterStatus}>
          <option value="">All</option>
          <option value={raffleStatus.IN_PROGRESS}>In Progress</option>
          <option value={raffleStatus.COMPLETE}>Complete</option>
        </select>
      </>
    </>
  )
}
