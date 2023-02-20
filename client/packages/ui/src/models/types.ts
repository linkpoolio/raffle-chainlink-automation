export enum RaffleStatus {
  STAGED = 0,
  LIVE = 1,
  FINISHED = 2
}

export enum RaffleType {
  DYNAMIC = 0,
  STATIC = 1
}

export interface RaffleInstance {
  id: string
  name: string // bytes32
  type: typeof RaffleType
  status: typeof RaffleStatus
  owner: string // address
  startDate: string
  timeLength: string
  entriesPerUser: number // uint8
  totalWinners: number // uint8
  prizeName: string
  prizeWorth: string
  paymentNeeded: boolean
  fee: string
  feeToken: boolean
  feeTokenAddress: string // address
  linkTotal: string
  automation: boolean
  merkleRoot: string // bytes32
  permissioned: boolean
  provenanceHash: string // bytes
  contestantsAddresses: Array<string> // bytes32[]
  winners: Array<string> // bytes32[]
  claimedPrizes: Array<string> // bytes32[]
  requestId: string
  paid: string
  fulfilled: boolean
  randomWords: Array<number> // uint256[]
}
