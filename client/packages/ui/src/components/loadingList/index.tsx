import React from 'react'
import { SkeletonText, Box } from '@chakra-ui/react'

export const LoadingList = ({ asyncManager }) => {
  return asyncManager.loading ? (
    <>
      {Array.from(Array(6).keys()).map((_, i) => {
        return (
          <Box
            key={i}
            padding="6"
            boxShadow="brand.base"
            bg="white"
            borderRadius="md">
            <SkeletonText noOfLines={4} spacing="4" skeletonHeight="6" />
          </Box>
        )
      })}
    </>
  ) : null
}
