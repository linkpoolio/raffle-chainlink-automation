import { RaffleInstance } from '@ui/models'
import { ethers } from 'ethers'

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
      prizeWorth: ethers.utils.formatEther(raffle.prizeWorth.toString()),
      paymentNeeded: raffle.paymentNeeded,
      fee: ethers.utils.formatEther(raffle.fee.toString()),
      feeTokenAddress: raffle.base.feeTokenAddress,
      automation: raffle.base.automation,
      merkleRoot: raffle.merkleRoot,
      permissioned: raffle.base.permissioned,
      provenanceHash: raffle.base.provenanceHash,
      contestantsAddresses: raffle.contestants,
      winners: raffle.winners,
      claimedPrizes: raffle.prize.claimedPrizes,
      withdrawn: raffle.requestStatus.withdrawn
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
