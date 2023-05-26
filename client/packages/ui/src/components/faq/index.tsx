import React from 'react'
import {
  Container,
  Heading,
  Text,
  Divider,
  Box,
  VStack
} from '@chakra-ui/react'

const faqList = [
  {
    question: 'What is a Chainlink Raffle?',
    answer:
      "A Chainlink Raffle is a lottery system built on the blockchain. It uses Chainlink's Verifiable Random Function (VRF) to ensure that the selection of winners is provably fair and transparent."
  },
  {
    question: 'How do I participate in a Chainlink Raffle?',
    answer:
      "To participate in a Chainlink Raffle, you first need to register or 'sign up' during the sign up period. Once the raffle event is committed on-chain, you become a participant and stand a chance to win prizes when the raffle is settled."
  },
  {
    question: 'How are the winners selected?',
    answer:
      "Winners are selected using Chainlink's Verifiable Random Function (VRF). This is a trusted and secure source of randomness on the blockchain. It ensures that the winner selection process is fair, transparent, and tamper-proof."
  },
  {
    question: 'What is the role of the raffle owner?',
    answer:
      'The raffle owner is responsible for creating and managing the raffle. They commit the rules of the raffle on-chain, such as the number of winners, the prizes, and the sign up period.'
  },
  {
    question: 'What is the difference between Dynamic and Static Raffles?',
    answer:
      'Dynamic Raffles have a level of flexibility as they allow participants to enter at any point before the raffle ends, provided they meet the necessary conditions. This feature provides the potential for a larger participant pool over time. Static Raffles, however, have a predetermined set of participants at the outset of the raffle event. Once the raffle starts, no new entrants can participate. This creates a fixed and unchanging number of entries over time.'
  }
]

export const FAQ = () => {
  return (
    <Container maxW="container.xl" mt="20" mb="20">
      <Heading size="2xl" fontWeight="700" mb="6">
        What are Chainlink Raffles?
      </Heading>
      <Text fontSize="lg" color="brand.gray_70" fontWeight="600">
        Frequently Asked Questions
      </Text>
      <Divider orientation="horizontal" mt="16" mb="16" />
      <VStack spacing={8} align="stretch">
        {faqList.map((faq, index) => (
          <Box key={index}>
            <Heading size="lg" fontWeight="600">
              {faq.question}
            </Heading>
            <Text mt={2}>{faq.answer}</Text>
          </Box>
        ))}
      </VStack>
    </Container>
  )
}
