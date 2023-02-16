import { readContract } from '@wagmi/core'
import { RAFFLE_MANAGER_CONTRACT_ADDRESS } from './const'
import { getAccount } from '@wagmi/core'

import RaffleManager from './abi/RaffleManager.json'

export const getAllRaffles = async () => {
  try {
    const data = await readContract({
      abi: RaffleManager,
      address: RAFFLE_MANAGER_CONTRACT_ADDRESS,
      functionName: 'getAllRaffles'
    })
    return data
  } catch (error: any) {
    throw new Error(
      `Error fetching raffles list from contract: ${error.message}`
    )
  }
}

export const getRaffle = async (id: number) => {
  try {
    const data = await readContract({
      abi: RaffleManager,
      address: RAFFLE_MANAGER_CONTRACT_ADDRESS,
      functionName: 'getRaffle',
      args: [id]
    })
    return data
  } catch (error: any) {
    throw new Error(`Error fetching raffle from contract: ${error.message}`)
  }
}

export const getOwnerRaffles = async () => {
  try {
    const data = await readContract({
      abi: RaffleManager,
      address: RAFFLE_MANAGER_CONTRACT_ADDRESS,
      functionName: 'getOwnerRaffles'
    })
    return data
  } catch (error: any) {
    throw new Error(
      `Error fetching owner raffles list from contract: ${error.message}`
    )
  }
}

export const account = getAccount()
