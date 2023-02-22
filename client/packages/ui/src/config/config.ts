const getEnv = (app, local) => {
  const key = `GLOBAL_${app}`
  return window[key] ? window[key] : local
}

export const env = {
  raffleManagerContractAddress: () =>
    getEnv(
      `RAFFLE_MANAGER_CONTRACT_ADDRESS`,
      // @ts-ignore:next-line
      typeof envContractAddress == 'string' ? envContractAddress : undefined // eslint-disable-line no-undef
    ),
  linkTokenContractAddress: () =>
    getEnv(
      `LINK_TOKEN_CONTRACT_ADDRESS`,
      // @ts-ignore:next-line
      typeof envContractAddress == 'string' ? envContractAddress : undefined // eslint-disable-line no-undef
    )
}
