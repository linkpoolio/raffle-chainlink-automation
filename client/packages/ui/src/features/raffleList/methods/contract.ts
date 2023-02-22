import { contracts } from '@ui/api' 

export const getRaffleList = async ({ asyncManager, update }) => {
  try {
    asyncManager.start()
    const list = await contracts.getAllRaffles() 
    console.log({ list })
    asyncManager.success()
    update({ list })
  } catch (error) {
    console.log({ error })
    asyncManager.fail(`Could not get raffle list`)
  }
}


// ui error on create (false)
// update all other api interactions to use non hook