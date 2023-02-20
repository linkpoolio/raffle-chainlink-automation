import React, { useEffect } from 'react'
import { useAccount } from 'wagmi'

import { raffleStatus } from '@ui/features/raffleDetail'

export const initialFilterState = {
  ownedByMe: false,
  status: ''
}

export const filterList = (filters, address) => (raffle) => {
  const status = filters.status == '' || filters.status == raffle.status
  const ownedByMe = !filters.ownedByMe || raffle.creatorId == address

  return status && ownedByMe
}

export const Filters = ({ store }) => {
  const { address } = useAccount()

  const { state, update, reset } = store

  const onFilterStatus = (e) => update({ status: e.target.value })
  const onFilterOwnedByMe = () => update({ ownedByMe: !state.ownedByMe })

  const componentDidUnmount = () => reset()
  useEffect(componentDidUnmount, [])

  return (
    <>
      <h4>Filters</h4>
      {address && (
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
