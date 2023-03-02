import { BigNumber } from 'ethers'

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
  value: BigNumber // link amount for funding txn
  prizeName: string
  timeLength?: number // time length
  fee: string
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
  value: BigNumber // link amount for funding txn
}

export interface WithdrawLinkParams {
  id: number
}

export enum Service {
  VRF = 0,
  AUTOMATION = 1
}
