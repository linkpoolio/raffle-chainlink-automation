import React from 'react'
import { Button, Text, Flex, Heading } from '@chakra-ui/react'
import { RaffleStatus, isRaffleOwner, RaffleType } from '@ui/models'

export const ViewWinnersDynamic = ({ raffle, address }) => {
  const exportWinnersToCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' + raffle?.winners?.join('\n')
    const encodedURI = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedURI)
    link.setAttribute('download', 'winners.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <>
      {raffle?.status === RaffleStatus.FINISHED &&
        raffle?.type === RaffleType.DYNAMIC &&
        isRaffleOwner(raffle, address) && (
          <>
            <Heading size="md" mb="6">
              View Winners
            </Heading>
            <Text as="ul" style={{ listStyleType: 'none' }}>
              {raffle?.winners?.map((winner, index) => (
                <Text as="li" key={index} style={{ marginBottom: '0.5em' }}>
                  {winner}
                </Text>
              ))}
            </Text>
            <Flex mt="2" justify="end">
              <Button variant="default" onClick={() => exportWinnersToCSV()}>
                Export to CSV
              </Button>
            </Flex>
          </>
        )}
    </>
  )
}
