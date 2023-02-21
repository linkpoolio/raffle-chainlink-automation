// import { contracts } from '@ui/api' // TOD: uncomment when ready to use api request

import { getMockRaffle } from '../mock' // TODO: remove

export const getRaffle = async ({ id, asyncManager, update }) => {
  try {
    asyncManager.start()
    const raffle = getMockRaffle(id) // TODO: remove this when enabling the actual request
    // const raffle = await contracts.getRaffle(id)
    asyncManager.success()
    update({ raffle })
  } catch (error) {
    asyncManager.fail(`Could not get raffle id \`${id}\``)
  }
}

export const claimPrize = async ({ id, asyncManager }) => {
  try {
    asyncManager.start()
    // const payload: contracts.ClaimPrizeParams = { id }
    // const { isSuccess } = await contracts.claimPrize(payload)
    // if (!isSuccess) throw new Error('Request to create raffle was not successful')
    asyncManager.success()
    return true
  } catch (error) {
    asyncManager.fail(`Could not claim prize on raffle id \`${id}\``)
    return false
  }
}

export const joinRaffle = async ({ id, asyncManager, update }) => {
  try {
    asyncManager.start()
    // const payload: contracts.EnterRaffleParams = { id }
    // const { isSuccess } = await contracts.enterRaffle(payload)
    // if (!isSuccess) throw new Error('Request to create raffle was not successful')
    asyncManager.success()
    update(true)
    return true
  } catch (error) {
    asyncManager.fail(`Could not join raffle id \`${id}\``)
    return false
  }
}

// TODO: need a method for the owner marking the raffle as finished and paying for it
