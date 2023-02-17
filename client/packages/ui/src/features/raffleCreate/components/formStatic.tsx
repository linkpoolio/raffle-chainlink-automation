import React from 'react'

import { CSVUpload } from '@ui/components'

export const initialStaticState = {
  participants: []
}

export const FormStatic = ({ update }) => {
  const onCsvUpload = (data) => {
    const flatten = ([value]) => value
    const bytes32 = (participant) => participant // TODO bytes32 participants
    const participants = data.map(flatten).map(bytes32)
    update({ participants })
  }

  return (
    <>
      <CSVUpload callback={onCsvUpload} />
    </>
  )
}
