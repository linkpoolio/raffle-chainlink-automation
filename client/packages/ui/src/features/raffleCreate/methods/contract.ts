import { Routes } from '@ui/Routes'
import { contracts } from '@ui/api'

// TODO: everywhere we check `isSuccess` needs updated

export const createRaffle = async ({ state, asyncManager, history }) => {
  try {
    asyncManager.start()
    const payload: contracts.CreateRaffleParams = {
      ...state,
      timeLength: state.hours * 60 * 60
    }
    const { isSuccess } = await contracts.createRaffle(payload)
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
