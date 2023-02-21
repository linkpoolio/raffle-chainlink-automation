import React from 'react'
import {
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  GridItem,
  Checkbox,
  Flex
} from '@chakra-ui/react'

export const initialDynamicState = {
  timeLength: 24,
  automation: false,
  token: '',
  tokenAmount: 0,
  feeToken: '',
  fee: 0,
  merkleRoot: ''
}

export const FormDynamic = ({ state, onTextChange, onCheckboxChange }) => {
  return (
    <>
      <GridItem>
        <FormControl>
          <FormLabel>Duration (hours)</FormLabel>
          <Input
            type="number"
            value={state.timeLength}
            onChange={onTextChange('timeLength')}
          />
          <FormHelperText>Description</FormHelperText>
        </FormControl>
      </GridItem>

      <GridItem>
        <FormControl>
          <FormLabel>Automation</FormLabel>
          <Flex align="center" h="40px">
            <Checkbox
              checked={state.automation}
              onChange={onCheckboxChange('automation')}>
              Enabled
            </Checkbox>
          </Flex>
          <FormHelperText>What is Automation?</FormHelperText>
        </FormControl>
      </GridItem>

      <GridItem colSpan={2}>
        <FormControl>
          <FormLabel>Token</FormLabel>
          <Input
            type="text"
            value={state.token}
            onChange={onTextChange('token')}
          />
          <FormHelperText>Ethereum Address</FormHelperText>
        </FormControl>
      </GridItem>

      <GridItem>
        <FormControl>
          <FormLabel>Token Amount</FormLabel>
          <Input
            type="text"
            value={state.tokenAmount}
            onChange={onTextChange('tokenAmount')}
          />
          <FormHelperText>Use Wei units</FormHelperText>
        </FormControl>
      </GridItem>

      <GridItem colSpan={2}>
        <FormControl>
          <FormLabel>Fee Token</FormLabel>
          <Input
            type="text"
            value={state.feeToken}
            onChange={onTextChange('feeToken')}
          />
          <FormHelperText>Ethereum Address</FormHelperText>
        </FormControl>
      </GridItem>

      <GridItem>
        <FormControl>
          <FormLabel>Fee Token Amount</FormLabel>
          <Input type="text" value={state.fee} onChange={onTextChange('fee')} />
          <FormHelperText>Use Wei units</FormHelperText>
        </FormControl>
      </GridItem>

      <GridItem>
        <FormControl>
          <FormLabel>Whitelist Merkle Root</FormLabel>
          <Input
            type="text"
            value={state.merkleRoot}
            onChange={onTextChange('merkleRoot')}
          />
        </FormControl>
      </GridItem>
    </>
  )
}
