import { readContract } from '@wagmi/core'

import { env } from '@ui/config'
import {
  transformRaffleItem,
  transformRaffleList,
  transformClaimable,
  RaffleInstance
} from '@ui/models'
import abi from './abi/RaffleManager.json'

const raffleContractAddress = env.raffleManagerContractAddress()
const defaultOptions = { abi, address: raffleContractAddress, watch: true }

export const getAllRaffles = async (): Promise<RaffleInstance[]> => {
  try {
    const data = await readContract({
      ...defaultOptions,
      functionName: 'getAllRaffles'
    })
    return transformRaffleList(data)
  } catch (error: any) {
    throw new Error(
      `Error fetching raffles list from contract: ${error.message}`
    )
  }
}

export const getRaffle = async (id: number): Promise<RaffleInstance> => {
  try {
    const data = await readContract({
      ...defaultOptions,
      functionName: 'getRaffle',
      args: [id]
    })
    return transformRaffleItem(data)
  } catch (error: any) {
    throw new Error(`Error fetching raffle from contract: ${error.message}`)
  }
}

export const getClaimableLink = async (id: number): Promise<number> => {
  try {
    const data = await readContract({
      ...defaultOptions,
      functionName: 'claimableLink',
      args: [id]
    })
    return transformClaimable(data)
  } catch (error: any) {
    throw new Error(`Error getting claimable link: ${error.message}`)
  }
}
