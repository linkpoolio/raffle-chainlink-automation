import { RaffleInstance, RaffleType, RaffleStatus } from '@ui/models'
import { ethers } from 'ethers'

export const filterRaffleList = (list, filters): RaffleInstance[] =>
  list.filter((raffle) => filters.every((filter) => filter(raffle)))

export const isRaffleOwner = (raffle, account): boolean =>
  raffle?.owner === account

export const isRaffleParticipant = (raffle, account): boolean => {
  console.log('raffle ->', raffle, 'account ->', account)
  return raffle?.contestantsAddresses.includes(
    ethers.utils.solidityKeccak256(['string'], [account])
  )
}

export const isRaffleParticipantDynamic = (raffle, account): boolean =>
  raffle?.contestantsAddresses.includes(
    ethers.utils.solidityKeccak256(['address'], [account])
  )

export const isRaffleWinner = (raffle, account): boolean =>
  raffle?.winners.includes(
    ethers.utils.solidityKeccak256(['string'], [account])
  )

export const isRaffleWinnerDynamic = (raffle, account): boolean =>
  raffle?.winners.includes(
    ethers.utils.solidityKeccak256(['address'], [account])
  )

export const isRaffleClaimedPrize = (raffle, account): boolean =>
  raffle?.claimedPrizes.includes(
    ethers.utils.solidityKeccak256(['address'], [account])
  )

export const isRaffleStatic = (raffle): boolean =>
  raffle?.type === RaffleType.STATIC

export const isRaffleDynamic = (raffle): boolean =>
  raffle?.type === RaffleType.DYNAMIC

export const isRaffleStaged = (raffle): boolean =>
  raffle?.status === RaffleStatus.STAGED

export const isRaffleLive = (raffle): boolean =>
  raffle?.status === RaffleStatus.LIVE

export const isRaffleFinished = (raffle): boolean =>
  raffle?.status === RaffleStatus.FINISHED
