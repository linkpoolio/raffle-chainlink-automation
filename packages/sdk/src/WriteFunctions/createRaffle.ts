const parseTimeLength = (timeLength: string): number => {
  const timeLengthNumber = Number(timeLength);
  if (isNaN(timeLengthNumber)) {
    throw new Error(`The parameter timeLength: ${timeLength} is not a number`);
  }
  return timeLengthNumber;
};

const parseFee = (fee: string): number => {
  const feeNumber = Number(fee);
  if (isNaN(feeNumber)) {
    throw new Error(`The parameter fee: ${fee} is not a number`);
  }
  return feeNumber;
};

export const createLotto = async (
  contract: any,
  timeLength: string,
  fee: string,
  name: string
) => {
  try {
    await contract.createRaffle(
      parseTimeLength(timeLength),
      parseFee(fee),
      name
    );
  } catch (error: any) {
    throw new Error(
      `Error creating lotto with parameters timeLength: ${timeLength}, fee: ${fee}, name: ${name}. Reason: ${
        error.message + JSON.stringify(error.data?.data?.stack)
      }`
    );
  }
};
