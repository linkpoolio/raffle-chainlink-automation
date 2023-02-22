export interface ClaimPrizeParams {
  id: number
}

export interface EnterRaffleParams {
  id: number
  entries?: number
  proof?: string[]
  fee: string
}

export interface CreateRaffleParams {
  prizeName: string
  timeLength?: number // time length
  fee: number
  name: string
  feeToken: string
  merkleRoot?: string // merkle root bytes32 hexadicimal
  automation?: boolean
  participants?: string[] // participants array of bytes32 hexadicimal
  totalWinners: number
  entriesPerUser?: number
}

export interface ResolveRaffleParams {
  id: number
  value: number // link amount for funding txn
}

export interface WithdrawLinkParams {
  id: number
}
