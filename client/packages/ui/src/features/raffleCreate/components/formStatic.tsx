import React from 'react'
import { ethers } from 'ethers'
import { GridItem } from '@chakra-ui/react'

import { CSVUpload, Control } from '@ui/components'

export const initialStaticState = {
  participants: []
}

export const FormStatic = ({ update }) => {
  const onCsvUpload = (data) => {
    const flatten = ([value]) => value
    const hashed = (participant) =>
      ethers.utils.solidityKeccak256(['string'], [participant])
    const participants = data.map(flatten).map(hashed)
    update({ participants })
  }

  return (
    <GridItem colSpan={2}>
      <Control
        label="Participants"
        helper={
          <>
            {' '}
            <button>Click here to download</button> CSV file example
          </>
        }>
        <CSVUpload callback={onCsvUpload} />
      </Control>
    </GridItem>
  )
}
