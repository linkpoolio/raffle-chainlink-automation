import { writeContract, prepareWriteContract } from '@wagmi/core'
import { RAFFLE_MANAGER_CONTRACT_ADDRESS } from './const'
import type { providers } from 'ethers'
import RaffleManager from './abi/RaffleManager.json'

export const createRaffle = async (
  params: CreateRaffleParams
): Promise<TransactionResponse> => {
  try {
    const {
      prize,
      timeLength,
      fee,
      name,
      feeToken,
      merkleRoot,
      automation,
      participants,
      totalWinners,
      entriesPerUser
    } = params
    const config = await prepareWriteContract({
      address: RAFFLE_MANAGER_CONTRACT_ADDRESS,
      abi: RaffleManager,
      functionName: 'createRaffle',
      args: [
        prize,
        timeLength,
        fee,
        name,
        feeToken,
        merkleRoot,
        automation,
        participants,
        totalWinners,
        entriesPerUser
      ]
    })
    const response = await writeContract(config)
    return response
  } catch (error: any) {
    throw new Error(`Error creating raffle: ${error.message}`)
  }
}

export const enterRaffle = async (
  params: EnterRaffleParams
): Promise<TransactionResponse> => {
  try {
    const { raffleId, entries, proof } = params
    const config = await prepareWriteContract({
      address: RAFFLE_MANAGER_CONTRACT_ADDRESS,
      abi: RaffleManager,
      functionName: 'enterRaffle',
      args: [raffleId, entries, proof]
    })
    const response = await writeContract(config)
    return response
  } catch (error: any) {
    throw new Error(`Error entering raffle: ${error.message}`)
  }
}

export const fulfillRandomWords = async (
  params: FulfillRandomWordsParams
): Promise<TransactionResponse> => {
  try {
    const { requestId, randomWords } = params
    const config = await prepareWriteContract({
      address: RAFFLE_MANAGER_CONTRACT_ADDRESS,
      abi: RaffleManager,
      functionName: 'fulfillRandomWords',
      args: [requestId, randomWords]
    })
    const response = await writeContract(config)
    return response
  } catch (error: any) {
    throw new Error(`Error fulfilling random words: ${error.message}`)
  }
}

export const claimPrize = async (
  params: ClaimPrizeParams
): Promise<TransactionResponse> => {
  try {
    const { raffleId } = params
    const config = await prepareWriteContract({
      address: RAFFLE_MANAGER_CONTRACT_ADDRESS,
      abi: RaffleManager,
      functionName: 'claimPrize',
      args: [raffleId]
    })
    const response = await writeContract(config)
    return response
  } catch (error: any) {
    throw new Error(`Error claiming prize: ${error.message}`)
  }
}

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
  hash: string
  wait: (confirmations?: number) => Promise<providers.TransactionReceipt>
}
