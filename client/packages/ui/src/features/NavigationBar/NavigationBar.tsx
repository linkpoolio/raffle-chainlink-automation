import React from 'react'
import { ConnectKitButton } from 'connectkit'
import {
  getAllRaffles,
  getOwnerRaffles,
  account,
  CreateRaffleParams,
  createRaffle
} from '@ui/contract/raffle'
import { transformRaffleList } from '@ui/transformers'

export const NavigationBar = () => {
  const exampleParams: CreateRaffleParams = {
    prize: '0x74657374',
    timeLength: 60000,
    fee: 1000000,
    name: '0x7465737400000000000000000000000000000000000000000000000000000000',
    feeToken: '0x63bfb2118771bd0da7A6936667A7BB705A06c1bA',
    merkleRoot:
      '0x63bfb2118771bd0da7a6936667a7bb705a06c1ba000000000000000000000000',
    automation: true,
    participants: [
      '0xb42d67899636f08a9019659dcbeafac33a27461c000000000000000000000000',
      '0x4ad091cd0efdeb4ac7acf4efea264ef1136228cc000000000000000000000000'
    ],
    totalWinners: 1,
    entriesPerUser: 1
  }
  console.log('account', account)

  const handleClick = () => {
    console.log('clicked')
    getOwnerRaffles().then((raffles) => {
      console.log('>>>', raffles)
    })
  }
  // createRaffle(exampleParams)
  getAllRaffles().then((raffles) => {
    // This is the data we want to display in the UI
    const raffleList = transformRaffleList(raffles)

    // We can now use the raffleList data in our UI
    console.log(raffleList)
  })

  return (
    <>
      <a href="/">Chainlink Raffles</a>
      <ConnectKitButton />
      <button onClick={handleClick}>Create raffle</button>
    </>
  )
}
