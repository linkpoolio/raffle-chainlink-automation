import { Routes } from '@ui/Routes'
// import { contracts } from '@ui/api' // TODO uncomment when ready to use

const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms)) // TODO: remove, this was for testing only
const defaultMs = 2000

export const createRaffle = async ({ state, asyncManager, history }) => {
  try {
    // TODO: convert state.store.timeLength from hours to seconds and possible convert other relevant
    // params from string to hexadecimal or bytes32 acording to types definition on api/contracts/types
    if (!state) return // TODO: remove this line after building the action
    asyncManager.start()
    await timeout(defaultMs) // TODO: remove this after above action is made
    // const payload: contracts.CreateRaffleParams = {} // TODO: encode relevant state for payload
    // const { isSuccess } = await contracts.createRaffle(payload) // TODO uncomment this when function is ready
    // if (!isSuccess) throw new Error('Request to create raffle was not successful') // TODO uncomment this when function is ready

    asyncManager.success()

    history.push({
      pathname: Routes.RaffleList,
      search: '?create-success'
    })
  } catch (error) {
    asyncManager.fail(`Could not create raffle`)
  }
}
