// TODO: remove mock

export const mockList = [
  {
    id: 1,
    name: 'Static:Live',
    type: 1,
    status: 1,
    owner: '0x12345678901234567890',
    winners: [],
    claimedPrizes: [],
    contestantsAddresses: [
      '0x7465737400000000000000000000000000000000000000000000000000000000', // "test"
      '0x7465737500000000000000000000000000000000000000000000000000000000'
    ]
  },
  {
    id: 2,
    name: 'Static:Finished',
    type: 1,
    status: 2,
    owner: '0x12345678901234567890',
    winners: [
      '0x7465737400000000000000000000000000000000000000000000000000000000', // "test"
      '0x7465737500000000000000000000000000000000000000000000000000000000'
    ],
    claimedPrizes: [
      '0x7465737400000000000000000000000000000000000000000000000000000000', // "test"
      '0x7465737500000000000000000000000000000000000000000000000000000000'
    ],
    contestantsAddresses: [
      '0x7465737400000000000000000000000000000000000000000000000000000000', // "test"
      '0x7465737500000000000000000000000000000000000000000000000000000000'
    ]
  },
  {
    id: 3,
    name: 'Dynamic:Live:Not Joined',
    type: 0,
    status: 1,
    owner: '0x98765432109876543210',
    winners: [],
    claimedPrizes: [],
    contestantsAddresses: []
  },
  {
    id: 4,
    name: 'Dynamic:Live:Joined',
    type: 0,
    status: 1,
    owner: '0x98765432109876543210',
    winners: [],
    claimedPrizes: [],
    contestantsAddresses: [
      '0x0E1ce369e53275f3e0Ff92EA30BE84c55Bc8a32e',
      '0x0E1ce369e53275f3e0Ff92EA30BE84c55Bc8a321'
    ]
  },
  {
    id: 5,
    name: 'Dynamic:Finished',
    type: 0,
    status: 2,
    owner: '0x98765432109876543210',
    winners: [
      '0x0E1ce369e53275f3e0Ff92EA30BE84c55Bc8a32e',
      '0x0E1ce369e53275f3e0Ff92EA30BE84c55Bc8a321'
    ],
    claimedPrizes: [],
    contestantsAddresses: [
      '0x0E1ce369e53275f3e0Ff92EA30BE84c55Bc8a32e',
      '0x0E1ce369e53275f3e0Ff92EA30BE84c55Bc8a321'
    ]
  }
]
