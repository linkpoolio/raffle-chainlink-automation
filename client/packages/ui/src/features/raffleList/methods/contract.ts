// import { contracts } from '@ui/api' // TODO: uncomment when ready to use api request
import { mockList } from '../mock' // TODO: remove when ready to use api request

export const getRaffleList = async ({ asyncManager, update }) => {
  try {
    asyncManager.start()
    const list = mockList // TODO: remove this when enabling the actual request
    // const list = await contracts.getAllRaffles() // TODO uncomment this when ready to use contract request
    asyncManager.success()
    update({ list })
  } catch (error) {
    asyncManager.fail(`Could not get raffle list`)
  }
}
