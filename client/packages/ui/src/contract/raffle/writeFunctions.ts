import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import { RAFFLE_MANAGER_CONTRACT_ADDRESS } from './const'
import type {
  ClaimPrizeParams,
  FulfillRandomWordsParams,
  EnterRaffleParams,
  CreateRaffleParams,
  TransactionResponse
} from './types'
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

export const enterRaffle = async (
  params: EnterRaffleParams
): Promise<TransactionResponse> => {
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

export const fulfillRandomWords = async (
  params: FulfillRandomWordsParams
): Promise<TransactionResponse> => {
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

export const claimPrize = async (
  params: ClaimPrizeParams
): Promise<TransactionResponse> => {
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
