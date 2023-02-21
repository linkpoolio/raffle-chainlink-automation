import React from 'react'
import { ethers } from 'ethers'
import {
  FormControl,
  FormLabel,
  FormHelperText,
  GridItem
} from '@chakra-ui/react'

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
      <GridItem colSpan={2}>
        <FormControl>
          <FormLabel>Participants</FormLabel>
          <CSVUpload callback={onCsvUpload} />
          <FormHelperText>
            <button>Click here to download</button> CSV file example
          </FormHelperText>
        </FormControl>
      </GridItem>
    </>
  )
}
