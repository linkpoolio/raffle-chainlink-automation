import React from 'react'
import { ethers } from 'ethers'

import { CSVUpload } from '@ui/components'

export const initialStaticState = {
  participants: []
}

export const FormStatic = ({ update }) => {
  const onCsvUpload = (data) => {
    const flatten = ([value]) => value
    const bytes32 = (participant) =>
      ethers.utils.formatBytes32String(participant)
    const participants = data.map(flatten).map(bytes32)
    update({ participants })
  }

  return (
    <>
      <CSVUpload callback={onCsvUpload} />
    </>
  )
}
