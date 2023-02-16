import { ethers } from 'ethers'
import { bigNumberToNumber } from '@ui/utils'

export const transformRaffleItem = (raffle): RaffleInstance => {
  try {
    return {
      base: {
        raffleType: raffle.base.raffleType,
        id: bigNumberToNumber(raffle.base.id),
        automation: raffle.base.automation,
        feeToken: raffle.base.feeToken,
        feeTokenAddress: raffle.base.feeTokenAddress,
        startDate: bigNumberToNumber(raffle.base.startDate),
        permissioned: raffle.base.permissioned,
        totalWinners: raffle.base.totalWinners,
        provenanceHash: raffle.base.provenanceHash,
        entriesPerUser: raffle.base.entriesPerUser
      },
      owner: raffle.owner,
      raffleName: ethers.utils.parseBytes32String(raffle[2]),
      contestantsAddresses: raffle.contestantsAddresses,
      winners: raffle.winners,
      prizeWorth: bigNumberToNumber(raffle.prizeWorth),
      requestStatus: {
        requestId: bigNumberToNumber(raffle.requestStatus[0]),
        paid: bigNumberToNumber(raffle.requestStatus[1]),
        fulfilled: raffle.requestStatus[2],
        randomWords: raffle.requestStatus[3].map((word) => word.toString())
      },
      timeLength: bigNumberToNumber(raffle.timeLength),
      fee: bigNumberToNumber(raffle.fee),
      raffleState: raffle.raffleState,
      prize: {
        prizeName: raffle.prize.prizeName,
        claimedPrizes: raffle.prize.claimedPrizes
      },
      paymentNeeded: raffle.paymentNeeded,
      merkleRoot: raffle.merkleRoot,
      linkTotal: bigNumberToNumber(raffle.linkTotal)
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

export enum RaffleState {
  STAGED,
  LIVE,
  FINISHED
}

export enum RaffleType {
  DYNAMIC = 0,
  STATIC = 1
}

export interface RaffleBase {
  raffleType: RaffleType
  id: number | BigInt // uint256
  automation: boolean
  feeToken: boolean
  feeTokenAddress: string // address
  startDate: number | BigInt // uint256
  permissioned: boolean
  totalWinners: number // uint8
  provenanceHash: string // bytes
  entriesPerUser: number // uint8
}

export interface RequestStatus {
  requestId: number | BigInt // uint256
  paid: number | BigInt // uint256
  fulfilled: boolean
  randomWords: Array<number> // uint256[]
}

export interface Prize {
  prizeName: string
  claimedPrizes: Array<string> // bytes32[]
}

export interface RequestConfig {
  callbackGasLimit: number // uint32
  requestConfirmations: number // uint16
  numWords: number // uint32
}

export interface RaffleInstance {
  base: RaffleBase
  owner: string // address
  raffleName: string // bytes32
  contestantsAddresses: Array<string> // bytes32[]
  winners: Array<string> // bytes32[]
  prizeWorth: number | BigInt // uint256
  requestStatus: RequestStatus
  timeLength: number | BigInt // uint256
  fee: number | BigInt // uint256
  raffleState: RaffleState
  prize: Prize
  paymentNeeded: boolean
  merkleRoot: string // bytes32
  linkTotal: number | BigInt // uint256
}
