import { ethers } from 'ethers'

import { RaffleInstance } from '@ui/models'

// TODO: review this list in depth for accuracy
export const transformRaffleItem = (raffle): RaffleInstance => {
  try {
    return {
      id: raffle.base.id.toString(),
      name: ethers.utils.parseBytes32String(raffle[2]),
      type: raffle.base.raffleType,
      status: raffle.raffleState,
      owner: raffle.owner,
      startDate: raffle.base.startDate.toString(),
      timeLength: raffle.timeLength.toString(),
      entriesPerUser: raffle.base.entriesPerUser,
      totalWinners: raffle.base.totalWinners,
      prizeName: raffle.prize.prizeName,
      prizeWorth: raffle.prizeWorth.toString(),
      paymentNeeded: raffle.paymentNeeded,
      fee: raffle.fee.toString(),
      feeToken: raffle.base.feeToken,
      feeTokenAddress: raffle.base.feeTokenAddress,
      linkTotal: raffle.linkTotal.toString(),
      automation: raffle.base.automation,
      merkleRoot: raffle.merkleRoot,
      permissioned: raffle.base.permissioned,
      provenanceHash: raffle.base.provenanceHash,
      contestantsAddresses: raffle.contestantsAddresses,
      winners: raffle.winners,
      claimedPrizes: raffle.prize.claimedPrizes,
      requestId: raffle.requestStatus[0].toString(),
      paid: raffle.requestStatus[1].toString(),
      fulfilled: raffle.requestStatus[2],
      randomWords: raffle.requestStatus[3].map((word) => word.toString())
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
