import { prepareWriteContract, writeContract } from '@wagmi/core'

import { ethers, BigNumber } from 'ethers'

import { env } from '@ui/config'
import { contracts } from '@ui/api'
import raffleManagerABI from './abi/RaffleManager.json'
import linkTokenABI from './abi/LinkToken.json'
import keeperRegistryABI from './abi/KeeperRegistry.json'

const raffleManagerContractAddress = env.raffleManagerContractAddress()
const linkTokenContractAddress = env.linkTokenContractAddress()
const keeperRegistryContractAddress = env.keeperRegistryContractAddress()

export const createRaffle = async (params: contracts.CreateRaffleParams) => {
  try {
    const encodedRaffleParams = ethers.utils.defaultAbiCoder.encode(
      [
        'tuple(string prizeName, uint256 timeLength, uint256 fee, string name, address feeToken, bytes32 merkleRoot, bool automation, bytes32[] participants, uint8 totalWinners, uint8 entriesPerUser)'
      ],
      [
        {
          prizeName: params.prizeName,
          timeLength: params.timeLength ? params.timeLength : 0,
          fee: params.fee ? ethers.utils.parseEther(params.fee) : 0,
          name: params.name,
          feeToken: params.feeToken
            ? params.feeToken
            : ethers.constants.AddressZero,
          merkleRoot: params.merkleRoot
            ? params.merkleRoot
            : '0x0000000000000000000000000000000000000000000000000000000000000000',
          automation: params.automation ? params.automation : false,
          participants: params.participants ? params.participants : [],
          totalWinners: params.totalWinners,
          entriesPerUser: params.entriesPerUser ? params.entriesPerUser : 1
        }
      ]
    )

    const config = await prepareWriteContract({
      address: linkTokenContractAddress,
      abi: linkTokenABI,
      functionName: 'transferAndCall',
      args: [raffleManagerContractAddress, params.value, encodedRaffleParams]
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

export const cancelUpkeep = async (params: contracts.CancelUpkeepParams) => {
  try {
    const { upkeepId } = params

    const config = await prepareWriteContract({
      address: keeperRegistryContractAddress,
      abi: keeperRegistryABI,
      functionName: 'cancelUpkeep',
      args: [upkeepId.toString()]
    })
    const data = await writeContract(config)
    return data
  } catch (error: any) {
    throw new Error(`Error cancelling upkeep: ${error.message}`)
  }
}

export const withdrawFunds = async (params: contracts.WithdrawFundsParams) => {
  try {
    const { upkeepId, address } = params
    const config = await prepareWriteContract({
      address: keeperRegistryContractAddress,
      abi: keeperRegistryABI,
      functionName: 'withdrawFunds',
      args: [upkeepId, address]
    })
    const data = await writeContract(config)
    return data
  } catch (error: any) {
    throw new Error(`Error cancelling upkeep: ${error.message}`)
  }
}
