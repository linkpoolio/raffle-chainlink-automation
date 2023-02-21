import { RaffleInstance, RaffleType, RaffleStatus } from '@ui/models'

export const filterRaffleList = (list, filters): RaffleInstance[] =>
  list.filter((raffle) => filters.every((filter) => filter(raffle)))

export const isRaffleOwner = (raffle, account): boolean =>
  raffle?.owner === account

export const isRaffleParticipant = (raffle, account): boolean =>
  raffle?.contestantsAddresses.includes(account)

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
