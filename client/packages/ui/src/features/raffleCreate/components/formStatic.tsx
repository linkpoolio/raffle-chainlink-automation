import React from 'react'
import { ethers } from 'ethers'
import { GridItem } from '@chakra-ui/react'

import { CSVUpload, Control } from '@ui/components'

export const initialStaticState = {
  participants: []
}

const filterNull = (i) => i !== ''

export const FormStatic = ({ update }) => {
  const onCsvUpload = (data) => {
    const flatten = ([value]) => value
    const bytes32 = (participant) =>
      ethers.utils.formatBytes32String(participant)
    const participants = data.map(flatten).filter(filterNull).map(bytes32)

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
