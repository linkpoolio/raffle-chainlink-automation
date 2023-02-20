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
