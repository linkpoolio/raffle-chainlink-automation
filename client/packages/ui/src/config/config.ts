const getEnv = (app, local) => {
  const key = `GLOBAL_${app}`
  return window[key] ? window[key] : local
}

export const env = {
  raffleManagerContractAddress: () =>
    getEnv(
      `UI_RAFFLE_MANAGER_CONTRACT_ADDRESS`,
      // @ts-ignore:next-line
      typeof envRaffleManagerContractAddress == 'string'
        ? // @ts-ignore:next-line
          envRaffleManagerContractAddress
        : undefined // eslint-disable-line no-undef
    ),
  linkTokenContractAddress: () =>
    getEnv(
      `UI_LINK_TOKEN_CONTRACT_ADDRESS`,
      // @ts-ignore:next-line
      typeof envLinkTokenContractAddress == 'string'
        ? // @ts-ignore:next-line
          envLinkTokenContractAddress
        : undefined // eslint-disable-line no-undef
    )
}
