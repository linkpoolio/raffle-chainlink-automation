import { ethers } from 'ethers'

// *********** Transformers ***********

export const transformRaffleItem = (raffle): RaffleInstance => {
  try {
    return {
      base: {
        raffleType: raffle.base.raffleType,
        id: raffle.base.id.toString(),
        automation: raffle.base.automation,
        feeToken: raffle.base.feeToken,
        feeTokenAddress: raffle.base.feeTokenAddress,
        startDate: raffle.base.startDate.toString(),
        permissioned: raffle.base.permissioned,
        totalWinners: raffle.base.totalWinners,
        provenanceHash: raffle.base.provenanceHash,
        entriesPerUser: raffle.base.entriesPerUser
      },
      owner: raffle.owner,
      raffleName: ethers.utils.parseBytes32String(raffle[2]),
      contestantsAddresses: raffle.contestantsAddresses,
      winners: raffle.winners,
      prizeWorth: raffle.prizeWorth.toString(),
      requestStatus: {
        requestId: raffle.requestStatus[0].toString(),
        paid: raffle.requestStatus[1].toString(),
        fulfilled: raffle.requestStatus[2],
        randomWords: raffle.requestStatus[3].map((word) => word.toString())
      },
      timeLength: raffle.timeLength.toString(),
      fee: raffle.fee.toString(),
      raffleState: raffle.raffleState,
      prize: {
        prizeName: raffle.prize.prizeName,
        claimedPrizes: raffle.prize.claimedPrizes
      },
      paymentNeeded: raffle.paymentNeeded,
      merkleRoot: raffle.merkleRoot,
      linkTotal: raffle.linkTotal.toString()
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

// *********** Filters ***********

export const filterRaffleList = (raffleList, filters): RaffleInstance[] => {
  return raffleList.filter((raffleInstance) => {
    return filters.every((filter) => filter(raffleInstance))
  })
}

export const isRaffleOwner = (raffleInstance, account): boolean => {
  return raffleInstance.owner === account
}

export const isRaffleParticipant = (raffleInstance, account): boolean => {
  return raffleInstance.contestantsAddresses.includes(account)
}

export const isRaffleStatic = (raffleInstance): boolean => {
  return raffleInstance.base.raffleType === RaffleType.STATIC
}

export const isRaffleDynamic = (raffleInstance): boolean => {
  return raffleInstance.base.raffleType === RaffleType.DYNAMIC
}

export const isRaffleStaged = (raffleInstance): boolean => {
  return raffleInstance.raffleState === RaffleState.STAGED
}

export const isRaffleLive = (raffleInstance): boolean => {
  return raffleInstance.raffleState === RaffleState.LIVE
}

export const isRaffleFinished = (raffleInstance): boolean => {
  return raffleInstance.raffleState === RaffleState.FINISHED
}

// *********** Types ***********

export enum RaffleState {
  STAGED = 0,
  LIVE = 1,
  FINISHED = 2
}

export enum RaffleType {
  DYNAMIC = 0,
  STATIC = 1
}

export interface RaffleBase {
  raffleType: number
  id: string
  automation: boolean
  feeToken: boolean
  feeTokenAddress: string // address
  startDate: string
  permissioned: boolean
  totalWinners: number // uint8
  provenanceHash: string // bytes
  entriesPerUser: number // uint8
}

export interface RequestStatus {
  requestId: string
  paid: string
  fulfilled: boolean
  randomWords: Array<number> // uint256[]
}

export interface Prize {
  prizeName: string
  claimedPrizes: Array<string> // bytes32[]
}

export interface RaffleInstance {
  base: RaffleBase
  owner: string // address
  raffleName: string // bytes32
  contestantsAddresses: Array<string> // bytes32[]
  winners: Array<string> // bytes32[]
  prizeWorth: string
  requestStatus: RequestStatus
  timeLength: string
  fee: string
  raffleState: number
  prize: Prize
  paymentNeeded: boolean
  merkleRoot: string // bytes32
  linkTotal: string
}
