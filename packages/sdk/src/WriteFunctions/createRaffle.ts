export const parseTimeLength = (timeLength: string): number => {
  const timeLengthNumber = Number(timeLength);
  if (isNaN(timeLengthNumber)) {
    throw new Error(`The parameter timeLength: ${timeLength} is not a number`);
  }
  return timeLengthNumber;
};

export const parseFee = (fee: string): number => {
  const feeNumber = Number(fee);
  if (isNaN(feeNumber)) {
    throw new Error(`The parameter fee: ${fee} is not a number`);
  }
  return feeNumber;
};

export const createRaffle = async (
  contract: any,
  timeLength: string,
  fee: string,
  name: string
) => {
  try {
    const parsedTimeLength = parseTimeLength(timeLength);
    const parsedFee = parseFee(fee);
    await contract.createRaffle(parsedTimeLength, parsedFee, name);
  } catch (error: any) {
    console.error(error);
    throw new Error(
      `Error creating lotto with parameters timeLength: ${timeLength}, fee: ${fee}, name: ${name} for contract ${
        contract.constructor.name
      }. Reason: ${error.message + JSON.stringify(error.data?.data?.stack)}`
    );
  }
};
