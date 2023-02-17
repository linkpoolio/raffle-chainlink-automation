import { mockList as list } from '../mock' // TODO: remove

const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms)) // TODO: remove, this was for testing only
const defaultMs = 2000

export const getRaffleList = async ({ asyncManager, update }) => {
  try {
    asyncManager.start()
    // TODO: replace mock with contract logic to fetch list
    // const list = await <someImportedAction>()
    await timeout(defaultMs) // TODO: remove this after above action is made
    asyncManager.success()
    update({ list })
  } catch (error) {
    asyncManager.fail(`Could not get raffle list`)
  }
}
