import React, { useState, useEffect } from 'react'
import { Button, Text, Stack, Flex, Heading } from '@chakra-ui/react'
export const CheckWinners = ({ store, reset }) => {
  const [winners, setWinners] = useState([])

  const componentDidMount = () => {
    readWinners(store)
  }
  useEffect(componentDidMount, [])

  const readWinners = (store) => {
    const participants = store.state.hashParticipants
    const stringParticipants = store.state.stringParticipants
    const raffleWinners = store.state.raffle.winners
    const winnersArr = []
    for (let i = 0; i < participants.length; i++) {
      if (raffleWinners.includes(participants[i])) {
        winnersArr.push(stringParticipants[i])
      }
    }
    setWinners(winnersArr)
  }

  return (
    <>
      <Heading size="md" mb="6">
        Raffle Winners
      </Heading>
      <Stack direction="column" spacing="4">
        {winners.map((winner) => (
          <Text fontSize="lg" key={winner}>
            {winner}
          </Text>
        ))}
      </Stack>
      <Flex mt="2" justify="end">
        <Button variant="default" onClick={() => reset(store)}>
          Close
        </Button>
      </Flex>
    </>
  )
}
