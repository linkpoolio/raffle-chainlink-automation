import { contracts } from '@ui/api'

// TODO: everywhere we check `isSuccess` needs updated

export const getRaffleList = async ({ asyncManager, update }) => {
  try {
    asyncManager.start()
    const list = await contracts.getAllRaffles()
    asyncManager.success()
    update({ list })
  } catch (error) {
    asyncManager.fail(`Could not get raffle list`)
  }
}
