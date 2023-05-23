import { readContract } from '@wagmi/core'
import { useEffect } from 'react'
import { useContractRead } from 'wagmi'
import { env } from '@ui/config'
import {
  transformRaffleItem,
  transformRaffleList,
  transformClaimable,
  RaffleInstance
} from '@ui/models'
import abi from './abi/RaffleManager.json'

const raffleManagerContractAddress = env.raffleManagerContractAddress()
const linkTokenContractAddress = env.linkTokenContractAddress()
const defaultOptions = { abi, watch: true }

export const getAllRaffles = async (): Promise<RaffleInstance[]> => {
  try {
    const data = await readContract({
      ...defaultOptions,
      address: raffleManagerContractAddress,
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
      address: raffleManagerContractAddress,
      functionName: 'getRaffle',
      args: [id]
    })
    return transformRaffleItem(data)
  } catch (error: any) {
    throw new Error(`Error fetching raffle from contract: ${error.message}`)
  }
}

export const getRaffleHook = (store, id) => {
  const { data, isError, isLoading, isSuccess } = useContractRead({
    ...defaultOptions,
    address: raffleManagerContractAddress,
    functionName: 'getRaffle',
    args: [id]
  })
  useEffect(() => {
    if (!id || !isSuccess) return
    const transformedData = transformRaffleItem(data)
    if (
      data &&
      JSON.stringify(store.state.raffle) !== JSON.stringify(transformedData)
    ) {
      store.update({ raffle: transformedData })
    }
  }, [data, store, id, isSuccess])

  return { data, isError, isLoading, isSuccess }
}

export const getClaimableLink = async (id: number): Promise<number> => {
  try {
    const data = await readContract({
      ...defaultOptions,
      address: raffleManagerContractAddress,
      functionName: 'claimableLink',
      args: [id]
    })
    return transformClaimable(data)
  } catch (error: any) {
    throw new Error(`Error getting claimable link: ${error.message}`)
  }
}

export const getClaimableAutomation = async (id: number): Promise<number> => {
  try {
    const data = await readContract({
      ...defaultOptions,
      address: raffleManagerContractAddress,
      functionName: 'claimableAutomation',
      args: [id]
    })
    return transformClaimable(data)
  } catch (error: any) {
    throw new Error(`Error getting claimable link: ${error.message}`)
  }
}

export const getLINKBalance = async (address: string): Promise<number> => {
  try {
    const data = await readContract({
      ...defaultOptions,
      address: linkTokenContractAddress,
      functionName: 'balanceOf',
      args: [address]
    })
    return transformClaimable(data)
  } catch (error: any) {
    throw new Error(`Error getting LINK balance: ${error.message}`)
  }
}
