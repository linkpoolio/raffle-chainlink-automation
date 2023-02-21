import { ethers } from 'ethers'

import { RaffleInstance } from '@ui/models'

export const transformRaffleItem = (raffle): RaffleInstance => {
  try {
    return {
      id: raffle.base.id.toString(),
      name: ethers.utils.parseBytes32String(raffle[2]),
      type: raffle.base.raffleType,
      status: raffle.raffleState,
      owner: raffle.owner,
      startDate: raffle.base.startDate.toString(), // TODO: convert unix timestamp to new date format probably
      timeLength: raffle.timeLength.toString(), // TODO: convert unix seconds to hours probably
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
      withdrawn: raffle.requests.withdrawn
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
