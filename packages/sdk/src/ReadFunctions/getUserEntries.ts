export const parseRaffleId = (raffleId: string): number => {
  const raffleIdNumber = Number(raffleId);
  if (isNaN(raffleIdNumber)) {
    throw new Error(`The parameter raffleId: ${raffleId} is not a number`);
  }
  return raffleIdNumber;
};

export const getUserEntries = async (
  contract: any,
  user: string,
  raffleId: string
): Promise<number> => {
  try {
    const parsedRaffleId = parseRaffleId(raffleId);
    const userEntries = await contract.getUserEntries(user, parsedRaffleId);
    return userEntries;
  } catch (error: any) {
    console.error(error);
    throw new Error(
      `Error getting the user entries for user ${user} for contract ${contract.constructor.name}. Reason: ${error.message}`
    );
  }
};
