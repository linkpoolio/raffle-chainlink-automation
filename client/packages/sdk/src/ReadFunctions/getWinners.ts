export const getWinners = async (contract: any): Promise<string[]> => {
  try {
    const winners = await contract.getWinners();
    return winners;
  } catch (error: any) {
    console.error(error);
    throw new Error(
      `Error getting the lotto winners for contract ${contract.constructor.name}. Reason: ${error.message}`
    );
  }
};
