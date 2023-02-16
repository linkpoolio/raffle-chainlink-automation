import { SendTransactionResult } from '@wagmi/core'

export interface ClaimPrizeParams {
  raffleId: number
}

export interface FulfillRandomWordsParams {
  requestId: string
  randomWords: string[]
}

export interface EnterRaffleParams {
  raffleId: number
  entries: number
  proof: string[]
}

export interface CreateRaffleParams {
  prize: string // name of prize in hexadicimal
  timeLength: number // time length
  fee: number // fee
  name: string // name of raffle in hexadicimal
  feeToken: string // fee token
  merkleRoot: string // merkle root bytes32 hexadicimal
  automation: boolean // automation boolean
  participants: string[] // participants array of bytes32 hexadicimal
  totalWinners: number
  entriesPerUser: number
}

export interface TransactionResponse {
  data?: SendTransactionResult
  error?: Error
  isLoading: boolean
  isSuccess: boolean
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
