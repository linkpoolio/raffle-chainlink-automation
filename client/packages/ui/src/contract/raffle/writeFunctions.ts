import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import { RAFFLE_MANAGER_CONTRACT_ADDRESS } from '@ui/contract/raffle'
import RaffleManager from './abi/RaffleManager.json'

// ******** WRITE FUNCTIONS ********

export const createRaffle = (params: CreateRaffleParams) => {
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
    const { config } = usePrepareContractWrite({
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
    const { data, isLoading, isSuccess } = useContractWrite(config)
    return { data, isLoading, isSuccess }
  } catch (error: any) {
    throw new Error(`Error creating raffle: ${error.message}`)
  }
}

export const enterRaffle = (params: EnterRaffleParams) => {
  try {
    const { raffleId, entries, proof } = params
    const { config } = usePrepareContractWrite({
      address: RAFFLE_MANAGER_CONTRACT_ADDRESS,
      abi: RaffleManager,
      functionName: 'enterRaffle',
      args: [raffleId, entries, proof]
    })
    const { data, isLoading, isSuccess } = useContractWrite(config)
    return { data, isLoading, isSuccess }
  } catch (error: any) {
    throw new Error(`Error entering raffle: ${error.message}`)
  }
}

export const fulfillRandomWords = (params: FulfillRandomWordsParams) => {
  try {
    const { requestId, randomWords } = params
    const { config } = usePrepareContractWrite({
      address: RAFFLE_MANAGER_CONTRACT_ADDRESS,
      abi: RaffleManager,
      functionName: 'fulfillRandomWords',
      args: [requestId, randomWords]
    })
    const { data, isLoading, isSuccess } = useContractWrite(config)
    return { data, isLoading, isSuccess }
  } catch (error: any) {
    throw new Error(`Error fulfilling random words: ${error.message}`)
  }
}

export const claimPrize = (params: ClaimPrizeParams) => {
  try {
    const { raffleId } = params
    const { config } = usePrepareContractWrite({
      address: RAFFLE_MANAGER_CONTRACT_ADDRESS,
      abi: RaffleManager,
      functionName: 'claimPrize',
      args: [raffleId]
    })
    const { data, isLoading, isSuccess } = useContractWrite(config)
    return { data, isLoading, isSuccess }
  } catch (error: any) {
    throw new Error(`Error claiming prize: ${error.message}`)
  }
}

// ******** TYPES ********

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
