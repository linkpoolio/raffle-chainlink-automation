// import { contracts } from '@ui/api' // TOD: uncomment when ready to use api request

import { getMockRaffle } from '../mock' // TODO: remove

const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms)) // TODO: remove, this was for testing only

export const getRaffle = async ({ id, asyncManager, update }) => {
  try {
    asyncManager.start()
    const raffle = getMockRaffle(id) // TODO: remove this when enabling the actual request
    // const raffle = await contracts.getRaffle(id) // TODO uncomment this when ready to use contract request
    asyncManager.success()
    update({ raffle })
  } catch (error) {
    asyncManager.fail(`Could not get raffle id \`${id}\``)
  }
}

export const claimPrize = async ({ id, identifier, asyncManager }) => {
  try {
    asyncManager.start()
    // const payload: contracts.ClaimPrizeParams = { raffleId: id, contestant: identifier } // TODO: encode relevant state for payload
    // const { isSuccess } = await contracts.claimPrize(payload) // TODO uncomment this when function is ready
    // if (!isSuccess) throw new Error('Request to create raffle was not successful') // TODO uncomment this when function is ready
    await timeout(2000) // TODO: remove this after above action is made
    asyncManager.success()
    return true
  } catch (error) {
    asyncManager.fail(
      `Could not claim prize on raffle id \`${id}\` for participant \`${identifier}\``
    )
    return false
  }
}

// enterRaffle = (params: contracts.EnterRaffleParams) => {
export const joinRaffle = async ({ id, identifier, entries, asyncManager }) => {
  try {
    asyncManager.start()
    // const payload: contracts.EnterRaffleParams = { raffleId: id, entries, contestant: identifier } // TODO: encode relevant state for payload
    // const { isSuccess } = await contracts.enterRaffle(payload) // TODO uncomment this when function is ready
    // if (!isSuccess) throw new Error('Request to create raffle was not successful') // TODO uncomment this when function is ready
    await timeout(2000) // TODO: remove this after above action is made
    asyncManager.success()
    return true
  } catch (error) {
    asyncManager.fail(
      `Could not join raffle id \`${id}\` for participant \`${identifier}\` with \`${entries}\` entries.`
    )
    return false
  }
}

// TODO: need a method for the owner marking the raffle as finished and paying for it
