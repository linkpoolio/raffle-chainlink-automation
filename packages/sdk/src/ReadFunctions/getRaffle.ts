export interface RaffleState {
  STAGED: string;
  LIVE: string;
  FINISHED: string;
}

export interface Prize {
  prizeName: string;
}

export interface Raffle {
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

export const parseRaffleId = (raffleId: string): number => {
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
    const parsedRaffleId = parseRaffleId(raffleId);
    const raffle = await contract.getRaffle(parsedRaffleId);
    return raffle;
  } catch (error: any) {
    console.error(error);
    throw new Error(
      `Error getting the lotto with raffleId: ${raffleId} for contract ${contract.constructor.name}. Reason: ${error.message}`
    );
  }
};
