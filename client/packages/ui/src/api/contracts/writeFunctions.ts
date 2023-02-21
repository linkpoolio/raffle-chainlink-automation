import { useContractWrite, usePrepareContractWrite } from 'wagmi'

import { env } from '@ui/config'
import { contracts } from '@ui/api'
import abi from './abi/RaffleManager.json'

const address = env.contractAddress()
const defaultOptions = { abi, address }

export const createRaffle = (params: contracts.CreateRaffleParams) => {
  try {
    const { config } = usePrepareContractWrite({
      ...defaultOptions,
      functionName: 'createRaffle',
      args: [
        params.prizeName,
        params.timeLength ? params.timeLength : 0,
        params.fee,
        params.name,
        params.feeToken,
        params.merkleRoot ? params.merkleRoot : '',
        params.automation ? params.automation : false,
        params.participants ? params.participants : [],
        params.totalWinners,
        params.entriesPerUser ? params.entriesPerUser : 1
      ]
    })
    const { data, isLoading, isSuccess } = useContractWrite(config)
    return { data, isLoading, isSuccess }
  } catch (error: any) {
    throw new Error(`Error creating raffle: ${error.message}`)
  }
}

export const enterRaffle = (params: contracts.EnterRaffleParams) => {
  try {
    const { id, proof } = params
    const { config } = usePrepareContractWrite({
      ...defaultOptions,
      functionName: 'enterRaffle',
      args: [id, params.entries ? params.entries : 1, proof ? proof : []]
    })
    const { data, isLoading, isSuccess } = useContractWrite(config)
    return { data, isLoading, isSuccess }
  } catch (error: any) {
    throw new Error(`Error entering raffle: ${error.message}`)
  }
}

export const claimPrize = (params: contracts.ClaimPrizeParams) => {
  try {
    const { id } = params
    const { config } = usePrepareContractWrite({
      ...defaultOptions,
      functionName: 'claimPrize',
      args: [id]
    })
    const { data, isLoading, isSuccess } = useContractWrite(config)
    return { data, isLoading, isSuccess }
  } catch (error: any) {
    throw new Error(`Error claiming prize: ${error.message}`)
  }
}

// TODO: add function for picking winners to call erc677
// TODO: include abi for this contract as well
// TODO: reference the new env var for the contract address

// TODO: add function for withdrawing link
