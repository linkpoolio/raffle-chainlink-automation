import { useContractWrite, usePrepareContractWrite } from 'wagmi'

import { env } from '@ui/config'
import { contracts } from '@ui/api'
import abi from './abi/RaffleManager.json'

const address = env.contractAddress()
const defaultOptions = { abi, address }

// TODO: doesn't this need the address of the creator/owner?
// TODO: we never specified entries per user in the UI, so we need to either add it to the UI or set
// a default setting in the api method
// TODO: verify that if we are creating a static raffle and the value is null for fee, timeLength, feeToken, etc
// the method will still work
// TODO: this is missing token and tokenAmount (for the prizes)
export const createRaffle = (params: contracts.CreateRaffleParams) => {
  try {
    const { config } = usePrepareContractWrite({
      ...defaultOptions,
      functionName: 'createRaffle',
      args: [
        params.prize,
        params.timeLength,
        params.fee,
        params.name,
        params.feeToken,
        params.merkleRoot,
        params.automation,
        params.participants,
        params.totalWinners,
        params.entriesPerUser
      ]
    })
    const { data, isLoading, isSuccess } = useContractWrite(config)
    return { data, isLoading, isSuccess }
  } catch (error: any) {
    throw new Error(`Error creating raffle: ${error.message}`)
  }
}

// TODO: doesn't this need the identifier of the individual entering?
export const enterRaffle = (params: contracts.EnterRaffleParams) => {
  try {
    const { raffleId, entries, proof } = params
    const { config } = usePrepareContractWrite({
      ...defaultOptions,
      functionName: 'enterRaffle',
      args: [raffleId, entries, proof]
    })
    const { data, isLoading, isSuccess } = useContractWrite(config)
    return { data, isLoading, isSuccess }
  } catch (error: any) {
    throw new Error(`Error entering raffle: ${error.message}`)
  }
}

// TODO: question- what is this doing -- is this the action for the creator to mark the static raffle as done?
export const fulfillRandomWords = (
  params: contracts.FulfillRandomWordsParams
) => {
  try {
    const { requestId, randomWords } = params
    const { config } = usePrepareContractWrite({
      ...defaultOptions,
      functionName: 'fulfillRandomWords',
      args: [requestId, randomWords]
    })
    const { data, isLoading, isSuccess } = useContractWrite(config)
    return { data, isLoading, isSuccess }
  } catch (error: any) {
    throw new Error(`Error fulfilling random words: ${error.message}`)
  }
}

// TODO: doesn't this also need the identifier?
export const claimPrize = (params: contracts.ClaimPrizeParams) => {
  try {
    const { raffleId } = params
    const { config } = usePrepareContractWrite({
      ...defaultOptions,
      functionName: 'claimPrize',
      args: [raffleId]
    })
    const { data, isLoading, isSuccess } = useContractWrite(config)
    return { data, isLoading, isSuccess }
  } catch (error: any) {
    throw new Error(`Error claiming prize: ${error.message}`)
  }
}
