import { prepareWriteContract, writeContract } from '@wagmi/core'

import { ethers } from 'ethers'

import { env } from '@ui/config'
import { contracts } from '@ui/api'
import raffleManagerABI from './abi/RaffleManager.json'
import linkTokenABI from './abi/LinkToken.json'

const raffleManagerContractAddress = env.raffleManagerContractAddress()
const linkTokenContractAddress = env.linkTokenContractAddress()

export const createRaffle = async (params: contracts.CreateRaffleParams) => {
  try {
    const configParams = {
      address: raffleManagerContractAddress,
      abi: raffleManagerABI,
      functionName: 'createRaffle',
      args: [
        params.prizeName,
        params.timeLength ? params.timeLength : 0,
        params.fee ? params.fee : 0,
        params.name,
        params.feeToken ? params.feeToken : ethers.constants.AddressZero,
        params.merkleRoot ? params.merkleRoot : '0x0000000000000000000000000000000000000000000000000000000000000000',
        params.automation ? params.automation : false,
        params.participants ? params.participants : [],
        params.totalWinners,
        params.entriesPerUser ? params.entriesPerUser : 1
      ]
    }

    const config = await prepareWriteContract(configParams)
    return writeContract(config)
  } catch (error: any) {
    console.log({ error })
    throw new Error(`Error creating raffle: ${error.message}`)
  }
}

export const enterRaffle = async (params: contracts.EnterRaffleParams) => {
  try {
    const { id, proof } = params
    const config = await prepareWriteContract({
      address: raffleManagerContractAddress,
      abi: raffleManagerABI,
      functionName: 'enterRaffle',
      args: [id, params.entries ? params.entries : 1, proof ? proof : []]
    })
    return writeContract(config)
  } catch (error: any) {
    throw new Error(`Error entering raffle: ${error.message}`)
  }
}

export const claimPrize = async (params: contracts.ClaimPrizeParams) => {
  try {
    const { id } = params
    const config = await prepareWriteContract({
      address: raffleManagerContractAddress,
      abi: raffleManagerABI,
      functionName: 'claimPrize',
      args: [id]
    })
    return writeContract(config)
  } catch (error: any) {
    throw new Error(`Error claiming prize: ${error.message}`)
  }
}

export const resolveRaffle = async (params: contracts.ResolveRaffleParams) => {
  try {
    const { value, id } = params
    const config = await prepareWriteContract({
      address: linkTokenContractAddress,
      abi: linkTokenABI,
      functionName: 'transferAndCall',
      args: [
        raffleManagerContractAddress,
        value,
        ethers.utils.solidityPack(['uint256'], [id])
      ]
    })
    return writeContract(config)
  } catch (error: any) {
    throw new Error(`Error resolving raffle: ${error.message}`)
  }
}

export const withdrawLink = async (params: contracts.WithdrawLinkParams) => {
  try {
    const { id } = params
    const config = await prepareWriteContract({
      address: raffleManagerContractAddress,
      abi: raffleManagerABI,
      functionName: 'withdrawLink',
      args: [id]
    })
    return writeContract(config)
  } catch (error: any) {
    throw new Error(`Error withdrawing link: ${error.message}`)
  }
}
