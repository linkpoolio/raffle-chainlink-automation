import { Routes } from '@ui/Routes'
import { contracts } from '@ui/api'
import { BigNumber } from 'ethers'

export const createRaffle = async ({ state, asyncManager, history }) => {
  try {
    asyncManager.start()
    const value = BigNumber.from('5000000000000000000') // 5 LINK (Minimum amount for automation)
    const payload: contracts.CreateRaffleParams = {
      ...state,
      feeToken: null, // Temporary until we have a way to get the fee token
      timeLength: state.hours * 60 * 60,
      value
    }
    const { wait } = await contracts.createRaffle(payload)
    asyncManager.waiting()

    const isSuccess = await wait().then((receipt) => receipt.status === 1)

    if (!isSuccess)
      throw new Error('Request to create raffle was not successful')

    asyncManager.success()

    history.push({
      pathname: Routes.RaffleList,
      search: '?create-success'
    })
  } catch (error) {
    asyncManager.fail(`Could not create raffle`)
  }
}
