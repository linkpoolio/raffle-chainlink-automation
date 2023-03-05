import React from 'react'
import { ethers } from 'ethers'
import { GridItem } from '@chakra-ui/react'
import { RaffleStatus, isRaffleOwner } from '@ui/models'
import { CSVUpload } from '@ui/components'

export const initialStaticState = {
  participants: []
}

export const UploadWinners = ({ update, raffle, address }) => {
  const onCsvUpload = (data) => {
    const flatten = ([value]) => value
    const removeNull = (value) => value !== ''
    const hash = (participant) =>
      ethers.utils.solidityKeccak256(['string'], [participant])
    const stringParticipants = data.map(flatten).filter(removeNull)
    const hashParticipants = data.map(flatten).filter(removeNull).map(hash)
    update({ hashParticipants, stringParticipants, uploaded: true })
  }
  if (
    raffle?.status == RaffleStatus.FINISHED &&
    isRaffleOwner(raffle, address)
  ) {
    return (
      <GridItem colSpan={2}>
        <CSVUpload
          callback={onCsvUpload}
          details="Upload contestants CSV to see who won"
          isInvalid={false}
        />
      </GridItem>
    )
  } else {
    return null
  }
}
