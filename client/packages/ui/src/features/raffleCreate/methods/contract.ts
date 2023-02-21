import { Routes } from '@ui/Routes'
import { contracts } from '@ui/api'

const hoursToTimestamp = (hours) => hours * 60 * 60

export const createRaffle = async ({ state, asyncManager, history }) => {
  try {
    asyncManager.start()
    const payload: contracts.CreateRaffleParams = {
      ...state,
      timeLength: hoursToTimestamp(state.hours)
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
