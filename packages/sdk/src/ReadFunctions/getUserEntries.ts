export const getUserEntries = async (
  contract: any,
  user: string
): Promise<number> => {
  try {
    const userEntries = await contract.getUserEntries(user);
    return userEntries;
  } catch (error: any) {
    throw new Error(`Error getting the user entries. Reason: ${error.message}`);
  }
};
