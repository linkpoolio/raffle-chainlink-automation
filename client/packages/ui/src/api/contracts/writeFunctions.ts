import { prepareWriteContract, writeContract } from '@wagmi/core'

import { ethers, BigNumber } from 'ethers'

import { env } from '@ui/config'
import { contracts } from '@ui/api'
import raffleManagerABI from './abi/RaffleManager.json'
import linkTokenABI from './abi/LinkToken.json'

const raffleManagerContractAddress = env.raffleManagerContractAddress()
const linkTokenContractAddress = env.linkTokenContractAddress()

export const createRaffle = async (params: contracts.CreateRaffleParams) => {
  try {
    const config = await prepareWriteContract({
      address: raffleManagerContractAddress,
      abi: raffleManagerABI,
      functionName: 'createRaffle',
      args: [
        params.prizeName,
        params.timeLength ? params.timeLength : 0,
        params.fee ? ethers.utils.parseEther(params.fee) : 0,
        params.name,
        params.feeToken ? params.feeToken : ethers.constants.AddressZero,
        params.merkleRoot
          ? params.merkleRoot
          : '0x0000000000000000000000000000000000000000000000000000000000000000',
        params.automation ? params.automation : false,
        params.participants ? params.participants : [],
        params.totalWinners,
        params.entriesPerUser ? params.entriesPerUser : 1
      ]
    })
    const data = await writeContract(config)
    return data
  } catch (error: any) {
    throw new Error(`Error creating raffle: ${error.message}`)
  }
}

export const enterRaffle = async (params: contracts.EnterRaffleParams) => {
  try {
    const { id, proof, fee } = params
    const config = await prepareWriteContract({
      address: raffleManagerContractAddress,
      abi: raffleManagerABI,
      functionName: 'enterRaffle',
      overrides: {
        value: ethers.utils.parseEther(fee)
      },
      args: [id, params.entries ? params.entries : 1, proof ? proof : []]
    })
    const data = await writeContract(config)
    return data
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
    const data = await writeContract(config)
    return data
  } catch (error: any) {
    throw new Error(`Error claiming prize: ${error.message}`)
  }
}

export const resolveRaffle = async (params: contracts.ResolveRaffleParams) => {
  try {
    const { value, id } = params

    const paramsConfig = {
      address: linkTokenContractAddress,
      abi: linkTokenABI,
      functionName: 'transferAndCall',
      overrides: {
        gasLimit: BigNumber.from(`500000`) // 500k gas limit
      },
      args: [
        raffleManagerContractAddress,
        value,
        ethers.utils.solidityPack(['uint256'], [id])
      ]
    }
    const config = await prepareWriteContract(paramsConfig)
    const data = await writeContract(config)
    return data
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
    const data = await writeContract(config)
    return data
  } catch (error: any) {
    throw new Error(`Error withdrawing link: ${error.message}`)
  }
}
