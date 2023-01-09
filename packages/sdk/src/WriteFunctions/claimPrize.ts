const parseRaffleId = (raffleId: string): number => {
  const raffleIdNumber = Number(raffleId);
  if (isNaN(raffleIdNumber)) {
    throw new Error(`The parameter raffleId: ${raffleId} is not a number`);
  }
  return raffleIdNumber;
};

export const claimPrize = async (contract: any, raffleId: string) => {
  try {
    const parsedRaffleId = parseRaffleId(raffleId);
    await contract.claimPrize(parsedRaffleId);
  } catch (error: any) {
    console.error(error);
    throw new Error(
      `Error claiming prize with parameters raffleId: ${raffleId} for contract ${
        contract.constructor.name
      }. Reason: ${error.message + JSON.stringify(error.data?.data?.stack)}`
    );
  }
};
