const parseRaffleId = (raffleId: string): number => {
  const raffleIdNumber = Number(raffleId);
  if (isNaN(raffleIdNumber)) {
    throw new Error(`The parameter raffleId: ${raffleId} is not a number`);
  }
  return raffleIdNumber;
};

export const claimPrize = async (contract: any, raffleId: string) => {
  try {
    await contract.claimPrize(parseRaffleId(raffleId));
  } catch (error: any) {
    throw new Error(
      `Error claiming prize with parameters raffleId: ${raffleId}. Reason: ${
        error.message + JSON.stringify(error.data?.data?.stack)
      }}`
    );
  }
};
