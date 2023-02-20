import { useContractRead } from 'wagmi'

import { env } from '@ui/config'
import {
  transformRaffleItem,
  transformRaffleList,
  RaffleInstance
} from '@ui/models'
import abi from './abi/RaffleManager.json'

const address = env.contractAddress()
const defaultOptions = { abi, address, watch: true }

export const getAllRaffles = (): RaffleInstance[] => {
  try {
    const data = useContractRead({
      ...defaultOptions,
      functionName: 'getAllRaffles'
    })
    return transformRaffleList(data.data)
  } catch (error: any) {
    throw new Error(
      `Error fetching raffles list from contract: ${error.message}`
    )
  }
}

export const getRaffle = (id: number): RaffleInstance => {
  try {
    const data = useContractRead({
      ...defaultOptions,
      functionName: 'getRaffle',
      args: [id]
    })
    return transformRaffleItem(data.data)
  } catch (error: any) {
    throw new Error(`Error fetching raffle from contract: ${error.message}`)
  }
}
