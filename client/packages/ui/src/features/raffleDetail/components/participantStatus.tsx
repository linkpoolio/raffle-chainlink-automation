import React from 'react'
import { Button, Text, Flex, Heading } from '@chakra-ui/react'

import { participantStatus, claimPrize } from '@ui/features/raffleDetail'
import { RaffleType } from '@ui/models'
import { Fireworks } from '@fireworks-js/react'

const Close = ({ reset }) => (
  <Flex mt="2" justify="end">
    <Button variant="default" onClick={reset}>
      Close
    </Button>
  </Flex>
)

const Lost = ({ reset }) => {
  return (
    <>
      <Heading size="md" mb="6">
        Did I win?
      </Heading>
      <Text>Sorry, no luck this time! Try again soon.</Text>
      <Close reset={reset} />
    </>
  )
}

const WonUnclaimed = ({ id, store, asyncManager }) => {
  const onClaim = async () => {
    const response = await claimPrize({
      id,
      asyncManager,
      update: store.update
    })

    if (response)
      store.update({
        participantStatus: participantStatus.WON_CLAIMED
      })
  }

  return (
    <>
      <Heading size="md" mb="6">
        Did I win?
      </Heading>
      {!asyncManager.loading && !asyncManager.pending && (
        <Fireworks
          options={{ opacity: 1 }}
          style={{
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            position: 'fixed',
            background: 'transparent',
            zIndex: -1
          }}
        />
      )}
      <Text>You won!</Text>
      {store.state.raffle.type == RaffleType.DYNAMIC && (
        <Flex mt="2" justify="end">
          <Button
            variant="default"
            isDisabled={asyncManager.loading || asyncManager.pending}
            onClick={onClaim}
            loadingText={
              asyncManager.loading
                ? 'Claiming prize'
                : 'Waiting for confirmation'
            }>
            Claim Prize
          </Button>
        </Flex>
      )}
    </>
  )
}

const WonClaimed = ({ store, reset }) => {
  return (
    <>
      <Heading size="md" mb="6">
        Did I win?
      </Heading>
      <Text>
        {' '}
        You Won!
        {store.state.raffle.type == RaffleType.DYNAMIC &&
          ` (and you successfully claimed your prize)`}
      </Text>
      <Close reset={reset} />
    </>
  )
}

export const ParticipantStatus = (props) => {
  switch (props.store.state.participantStatus) {
    case participantStatus.LOST:
      return <Lost {...props} />
    case participantStatus.WON_UNCLAIMED:
      return <WonUnclaimed {...props} />
    case participantStatus.WON_CLAIMED:
      return <WonClaimed {...props} />
    default:
      return null
  }
}
