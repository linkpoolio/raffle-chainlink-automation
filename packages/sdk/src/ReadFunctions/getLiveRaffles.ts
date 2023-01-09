export const getLiveRaffles = async (
  contract: any
): Promise<number[]> => {
  try {
    const liveRaffles = await contract.getLiveRaffles();
    return liveRaffles;
  } catch (error: any) {
    console.error(error);
    throw new Error(
      `Error getting the live lotto raffles for contract ${contract.constructor.name}. Reason: ${error.message}`
    );
  }
};
