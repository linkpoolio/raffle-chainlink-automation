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
    const parsedRaffleId = parseRaffleId(raffleId);
    const parsedEntries = parseEntries(entries);
    const parsedFee = parseFee(fee);
    await contract.enterRaffle(parsedRaffleId, parsedEntries, {
      value: parsedFee,
    });
  } catch (error: any) {
    console.error(error);
    throw new Error(
      `Error entering raffle with parameters raffleId: ${raffleId}, entries: ${entries}, fee: ${fee} for contract ${
        contract.constructor.name
      }. Reason: ${error.message + JSON.stringify(error.data?.data?.stack)}`
    );
  }
};
