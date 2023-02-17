import { Routes } from '@ui/Routes'

const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms)) // TODO: remove, this was for testing only
const defaultMs = 2000

export const createRaffle = async ({ state, asyncManager, history }) => {
  try {
    if (!state) return // TODO: remove this line after building the action
    asyncManager.start()
    // TODO: replace mock with contract logic to fetch list
    // const create = await <someImportedAction>(payload)
    await timeout(defaultMs) // TODO: remove this after above action is made

    asyncManager.success()

    history.push({
      pathname: Routes.RaffleList,
      search: '?create-success'
    })
  } catch (error) {
    asyncManager.fail(`Could not create raffle`)
  }
}
