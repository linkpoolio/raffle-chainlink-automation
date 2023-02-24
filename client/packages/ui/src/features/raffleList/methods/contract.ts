import { contracts } from '@ui/api'

export const getRaffleList = async ({ asyncManager, update }) => {
  try {
    asyncManager.start()
    const list = await contracts.getAllRaffles()
    asyncManager.success()
    update({ list })
  } catch (error) {
    asyncManager.fail(
      `Could not get raffle list, please check your're connected to the correct network.`
    )
  }
}
