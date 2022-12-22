const parseEntries = (entries: string): number => {
  const entriesNumber = Number(entries);
  if (isNaN(entriesNumber)) {
    throw new Error(`The parameter entries: ${entries} is not a number`);
  }
  return entriesNumber;
};

const parseFee = (fee: string): number => {
  const feeNumber = Number(fee);
  if (isNaN(feeNumber)) {
    throw new Error(`The parameter fee: ${fee} is not a number`);
  }
  return feeNumber;
};

const parseRaffleId = (raffleId: string): number => {
  const raffleIdNumber = Number(raffleId);
  if (isNaN(raffleIdNumber)) {
    throw new Error(`The parameter raffleId: ${raffleId} is not a number`);
  }
  return raffleIdNumber;
};

export const enterRaffle = async (
  contract: any,
  raffleId: string,
  entries: string,
  fee: string
) => {
  try {
    await contract.enterRaffle(parseRaffleId(raffleId), parseEntries(entries), {
      value: parseFee(fee),
    });
  } catch (error: any) {
    throw new Error(
      `Error entering raffle with parameters raffleId: ${raffleId}, entries: ${entries}, fee: ${fee}. Reason: ${
        error.message + JSON.stringify(error.data?.data?.stack)
      }`
    );
  }
};
