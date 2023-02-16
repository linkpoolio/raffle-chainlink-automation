import { useContractRead } from 'wagmi'
import { RAFFLE_MANAGER_CONTRACT_ADDRESS } from './const'
import { getAccount } from '@wagmi/core'

import RaffleManager from './abi/RaffleManager.json'

export const getAllRaffles = async () => {
  try {
    const data = await useContractRead({
      abi: RaffleManager,
      address: RAFFLE_MANAGER_CONTRACT_ADDRESS,
      functionName: 'getAllRaffles',
      watch: true
    })
    return data.data
  } catch (error: any) {
    throw new Error(
      `Error fetching raffles list from contract: ${error.message}`
    )
  }
}

export const getRaffle = async (id: number) => {
  try {
    const data = await useContractRead({
      abi: RaffleManager,
      address: RAFFLE_MANAGER_CONTRACT_ADDRESS,
      functionName: 'getRaffle',
      args: [id],
      watch: true
    })
    return data.data
  } catch (error: any) {
    throw new Error(`Error fetching raffle from contract: ${error.message}`)
  }
}

export const getOwnerRaffles = async () => {
  try {
    const data = await useContractRead({
      abi: RaffleManager,
      address: RAFFLE_MANAGER_CONTRACT_ADDRESS,
      functionName: 'getOwnerRaffles',
      watch: true
    })
    return data.data
  } catch (error: any) {
    throw new Error(
      `Error fetching owner raffles list from contract: ${error.message}`
    )
  }
}

export const account = getAccount()
