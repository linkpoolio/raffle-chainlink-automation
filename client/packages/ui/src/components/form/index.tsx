import React from 'react'
import {
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage
} from '@chakra-ui/react'

export const Control = ({
  label,
  errorMessage,
  helper,
  children
}: {
  label: string
  errorMessage?: string
  helper?: string | JSX.Element
  children: JSX.Element
}) => {
  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      {children}
      {!errorMessage ? (
        helper ? (
          <FormHelperText>{helper}</FormHelperText>
        ) : null
      ) : (
        <FormErrorMessage>{errorMessage}</FormErrorMessage>
      )}
    </FormControl>
  )
}
