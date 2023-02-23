import { BigNumber } from 'ethers'

import { contracts } from '@ui/api'

export const getRaffle = async ({ id, asyncManager, update }) => {
  try {
    asyncManager.start()
    const raffle = await contracts.getRaffle(id)
    asyncManager.success()
    update({ raffle })
  } catch (error) {
    asyncManager.fail(`Could not get raffle id \`${id}\``)
  }
}

export const claimPrize = async ({ id, asyncManager }) => {
  try {
    asyncManager.start()
    const payload: contracts.ClaimPrizeParams = { id }
    const { wait } = await contracts.claimPrize(payload)
    asyncManager.waiting()
    const isSuccess = await wait().then((receipt) => receipt.status === 1)
    if (!isSuccess) throw new Error('Request to claim prize was not successful')
    asyncManager.success()
    return true
  } catch (error) {
    asyncManager.fail(`Could not claim prize on raffle id \`${id}\``)
    return false
  }
}

export const joinRaffle = async ({
  id,
  fee,
  asyncManager,
  update,
  success
}) => {
  try {
    asyncManager.start()
    const payload: contracts.EnterRaffleParams = { id, fee }
    const { wait } = await contracts.enterRaffle(payload)
    asyncManager.waiting()
    const isSuccess = await wait().then((receipt) => receipt.status === 1)
    if (!isSuccess) throw new Error('Request to join raffle was not successful')
    asyncManager.success()
    await getRaffle({ id, asyncManager, update })
    success(true)
    return true
  } catch (error) {
    asyncManager.fail(`Could not join raffle id \`${id}\``)
    return false
  }
}

export const pickWinners = async ({ id, asyncManager, update }) => {
  try {
    /*
     * @FeatureEnhancement
     * For now we harcode value to 10 LINK to cover all reasonable cases for funding the txn.
     * Later we will need to have this be smarter, as the actual amount required is variable.
     * The risk of a high fixed amount is offset both by (a) initial deployment is on eth goerli
     * and (b) the owner can withdraw excess link amount after the raffle has been resolved.
     */
    const value = BigNumber.from('1000000000000000000') // 1 LINK
    asyncManager.start()
    const payload: contracts.ResolveRaffleParams = { id, value }
    const { wait } = await contracts.resolveRaffle(payload)
    asyncManager.waiting()
    const isSuccess = await wait().then((receipt) => receipt.status === 1)
    if (!isSuccess)
      throw new Error('Request to pick winners was not successful')
    asyncManager.success()
    update(true)
    return true
  } catch (error) {
    asyncManager.fail(`Could not pick winners for raffle id \`${id}\``)
    return false
  }
}

export const withdrawLink = async ({ id, asyncManager, update }) => {
  try {
    asyncManager.start()
    const payload: contracts.WithdrawLinkParams = { id }
    const { wait } = await contracts.withdrawLink(payload)
    asyncManager.waiting()
    const isSuccess = await wait().then((receipt) => receipt.status === 1)
    if (!isSuccess)
      throw new Error('Request to withdraw LINK was not successful')
    asyncManager.success()
    update(true)
    return true
  } catch (error) {
    asyncManager.fail(`Could not withdraw LINK for raffle id \`${id}\``)
    return false
  }
}

export const canWithdraw = async ({ id, update }) => {
  try {
    // const response: bool = await contracts.canWithdraw(id) // TODO: contract method for checking if excess LINK is available to withdraw
    const response = true || id // TODO: remove mock response
    update(response)
    return true
  } catch (error) {
    return false
  }
}
