// TODO: remove mock
import { participantStatus } from './constants'
import { mockList } from '../raffleList/mock'

export const getMockRaffle = (id) => mockList.find((raffle) => raffle.id == id)

export const mockState = {
  participantStatus: participantStatus.WON_UNCLAIMED
}
