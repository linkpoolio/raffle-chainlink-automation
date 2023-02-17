import { useContractRead } from 'wagmi'
import { RAFFLE_MANAGER_CONTRACT_ADDRESS } from '@ui/contract/raffle'
import RaffleManager from './abi/RaffleManager.json'

// ******** READ FUNCTIONS ********

export const getAllRaffles = () => {
  try {
    const data = useContractRead({
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

export const getRaffle = (id: number) => {
  try {
    const data = useContractRead({
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
