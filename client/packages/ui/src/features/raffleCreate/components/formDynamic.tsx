import React from 'react'
import { Input, GridItem, Checkbox, Flex } from '@chakra-ui/react'

import { Control } from '@ui/components'

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
        <Control label="Duration (hours)" helper="Description">
          <Input
            type="number"
            value={state.timeLength}
            onChange={onTextChange('timeLength')}
          />
        </Control>
      </GridItem>

      <GridItem>
        <Control label="Automation" helper="What is Automation?">
          <Flex align="center" h="40px">
            <Checkbox
              checked={state.automation}
              onChange={onCheckboxChange('automation')}>
              Enabled
            </Checkbox>
          </Flex>
        </Control>
      </GridItem>

      <GridItem colSpan={2}>
        <Control label="Token" helper="Ethereum Address">
          <Input
            type="text"
            value={state.token}
            onChange={onTextChange('token')}
          />
        </Control>
      </GridItem>

      <GridItem>
        <Control label="Token Amount" helper="Use Wei units">
          <Input
            type="text"
            value={state.tokenAmount}
            onChange={onTextChange('tokenAmount')}
          />
        </Control>
      </GridItem>

      <GridItem colSpan={2}>
        <Control label="Fee Token" helper="Ethereum Address">
          <Input
            type="text"
            value={state.feeToken}
            onChange={onTextChange('feeToken')}
          />
        </Control>
      </GridItem>

      <GridItem>
        <Control label="Fee Token Amount" helper="Use Wei units">
          <Input type="text" value={state.fee} onChange={onTextChange('fee')} />
        </Control>
      </GridItem>

      <GridItem>
        <Control label="Whitelist Merkle Root" helper="Use Wei units">
          <Input
            type="text"
            value={state.merkleRoot}
            onChange={onTextChange('merkleRoot')}
          />
        </Control>
      </GridItem>
    </>
  )
}
