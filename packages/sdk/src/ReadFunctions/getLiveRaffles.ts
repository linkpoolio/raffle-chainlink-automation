export const getLiveRaffles = async (contract: any): Promise<number[]> => {
  try {
    const liveRaffles = await contract.getLiveRaffles();
    if (liveRaffles.length === 0) {
      return [0];
    }
    return liveRaffles;
  } catch (error: any) {
    throw new Error(
      `Error getting the live lotto raffles. Reason: ${error.message}`
    );
  }
};
