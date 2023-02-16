// TODO: remove mock
import { participantStatus, raffleStatus, raffleType } from './constants'

export const mockRaffle = {
  id: 1,
  name: 'My Raffle',
  prize: '20 LINK',
  token: '0x326C977E6efc84E512bB9C30f76E30c160eD06FB',
  amount: 1000000000000000000,
  participants: [1, 2, 3],
  status: raffleStatus.IN_PROGRESS,
  type: raffleType.DYNAMIC
}

export const mockState = {
  participantStatus: participantStatus.WON_UNCLAIMED,
  walletAddress: '0x12345678901234567890'
}
