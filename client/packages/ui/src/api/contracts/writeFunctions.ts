import { useContractWrite, usePrepareContractWrite } from 'wagmi'

import { ethers } from 'ethers'

import { env } from '@ui/config'
import { contracts } from '@ui/api'
import raffleManagerABI from './abi/RaffleManager.json'
import linkTokenABI from './abi/LinkToken.json'

const raffleManagerContractAddress = env.raffleManagerContractAddress()
const linkTokenContractAddress = env.linkTokenContractAddress()

export const createRaffle = (params: contracts.CreateRaffleParams) => {
  try {
    const { config } = usePrepareContractWrite({
      address: raffleManagerContractAddress,
      abi: raffleManagerABI,
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
      address: raffleManagerContractAddress,
      abi: raffleManagerABI,
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
      address: raffleManagerContractAddress,
      abi: raffleManagerABI,
      functionName: 'claimPrize',
      args: [id]
    })
    const { data, isLoading, isSuccess } = useContractWrite(config)
    return { data, isLoading, isSuccess }
  } catch (error: any) {
    throw new Error(`Error claiming prize: ${error.message}`)
  }
}

export const resolveRaffle = (params: contracts.ResolveRaffleParams) => {
  try {
    const { value, id } = params
    const { config } = usePrepareContractWrite({
      address: linkTokenContractAddress,
      abi: linkTokenABI,
      functionName: 'transferAndCall',
      args: [
        raffleManagerContractAddress,
        value,
        ethers.utils.solidityPack(['uint256'], [id])
      ]
    })
    const { data, isLoading, isSuccess } = useContractWrite(config)
    return { data, isLoading, isSuccess }
  } catch (error: any) {
    throw new Error(`Error resolving raffle: ${error.message}`)
  }
}

export const withdrawLink = (params: contracts.WithdrawLinkParams) => {
  try {
    const { id } = params
    const { config } = usePrepareContractWrite({
      address: raffleManagerContractAddress,
      abi: raffleManagerABI,
      functionName: 'withdrawLink',
      args: [id]
    })
    const { data, isLoading, isSuccess } = useContractWrite(config)
    return { data, isLoading, isSuccess }
  } catch (error: any) {
    throw new Error(`Error withdrawing link: ${error.message}`)
  }
}
