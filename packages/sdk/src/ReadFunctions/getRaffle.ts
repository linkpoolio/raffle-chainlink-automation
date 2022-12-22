interface RaffleState {
  STAGED: string;
  LIVE: string;
  FINISHED: string;
}

interface Prize {
  prizeName: string;
}

interface Raffle {
  raffleName: string;
  contestantsAddresses: string[];
  winner: string;
  startDate: number;
  prizeWorth: number;
  randomSeed: number;
  contestOwner: string;
  timeLength: number;
  fee: number;
  raffleState: RaffleState;
  prizeClaimed: boolean;
  prize: Prize;
}

const parseRaffleId = (raffleId: string): number => {
  const raffleIdNumber = Number(raffleId);
  if (isNaN(raffleIdNumber)) {
    throw new Error(`The parameter raffleId: ${raffleId} is not a number`);
  }
  return raffleIdNumber;
};

export const getRaffle = async (
  contract: any,
  raffleId: string
): Promise<Raffle> => {
  try {
    const raffle = await contract.getRaffle(parseRaffleId(raffleId));
    return raffle;
  } catch (error: any) {
    throw new Error(
      `Error getting the lotto with raffleId: ${raffleId}. Reason: ${error.message}`
    );
  }
};
