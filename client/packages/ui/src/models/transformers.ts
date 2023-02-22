import { ethers } from 'ethers'

import { RaffleInstance } from '@ui/models'

export const transformRaffleItem = (raffle): RaffleInstance => {
  try {
    return {
      id: raffle.base.id.toString(),
      name: raffle[2],
      type: raffle.base.raffleType,
      status: raffle.raffleState,
      owner: raffle.owner,
      startDate: raffle.base.startDate.toString(), // consider converting unix timestamp to new date format 
      hours: raffle.timeLength.toString() / 60 / 60,
      entriesPerUser: raffle.base.entriesPerUser,
      totalWinners: raffle.base.totalWinners,
      prizeName: raffle.prize.prizeName,
      prizeWorth: raffle.prizeWorth.toString(),
      paymentNeeded: raffle.paymentNeeded,
      fee: raffle.fee.toString(),
      feeTokenAddress: raffle.base.feeTokenAddress,
      automation: raffle.base.automation,
      merkleRoot: raffle.merkleRoot,
      permissioned: raffle.base.permissioned,
      provenanceHash: raffle.base.provenanceHash,
      contestantsAddresses: raffle.contestantsAddresses,
      winners: raffle.winners,
      claimedPrizes: raffle.prize.claimedPrizes,
      withdrawn: raffle.requests?.withdrawn ? raffle.requests.withdrawnn : false
    }
  } catch (error: any) {
    throw new Error(`Error transforming raffle item: ${error.message}`)
  }
}

export const transformRaffleList = (raffleList): RaffleInstance[] => {
  return raffleList.map((raffleInstance) => {
    return transformRaffleItem(raffleInstance)
  })
}
