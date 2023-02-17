import { getMockRaffle, mockState } from '../mock' // TODO: remove
const status = mockState.participantStatus // TODO: remove

const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms)) // TODO: remove, this was for testing only
const defaultMs = 2000

export const getRaffle = async ({ id, asyncManager, update }) => {
  try {
    asyncManager.start()
    // TODO: replace mock with contract logic to fetch by id
    // const raffle = await <someImportedAction>({ id })
    await timeout(defaultMs) // TODO: remove this after above action is made
    const raffle = getMockRaffle(id) // TODO: remove this after above action is made
    asyncManager.success()
    update({ raffle })
  } catch (error) {
    asyncManager.fail(`Could not get raffle id \`${id}\``)
  }
}

export const getParticipantStatus = async ({
  id,
  identifier,
  asyncManager
}) => {
  try {
    asyncManager.start()
    // TODO: replace mock with contract logic to fetch if pariticpant identifer was included in the winners array
    // const status = await <someImportedAction>({ id, identifier })
    await timeout(defaultMs) // TODO: remove this after above action is made
    asyncManager.success()
    return status
  } catch (error) {
    asyncManager.fail(
      `Could not check participant status on raffle id \`${id}\` for participant \`${identifier}\``
    )
    return false
  }
}

export const claimPrize = async ({ id, identifier, asyncManager }) => {
  try {
    asyncManager.start()
    // TODO: replace mock with contract logic claim the prize
    // const claimResult = await <someImportedAction>({ id, identifier })
    await timeout(defaultMs) // TODO: remove this after above action is made
    asyncManager.success()
    return true
  } catch (error) {
    asyncManager.fail(
      `Could not claim prize on raffle id \`${id}\` for participant \`${identifier}\``
    )
    return false
  }
}

export const joinRaffle = async ({ id, identifier, entries, asyncManager }) => {
  try {
    asyncManager.start()
    // TODO: replace mock with contract logic claim the prize
    // const claimResult = await <someImportedAction>({ id, identifier })
    await timeout(defaultMs) // TODO: remove this after above action is made
    asyncManager.success()
    return true
  } catch (error) {
    asyncManager.fail(
      `Could not join raffle id \`${id}\` for participant \`${identifier}\` with \`${entries}\` entries.`
    )
    return false
  }
}
