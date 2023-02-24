import React from 'react'
import { Input, GridItem, Checkbox, Flex } from '@chakra-ui/react'

import { Control } from '@ui/components'

export const initialDynamicState = {
  hours: 24,
  automation: false,
  fee: 0
}

export const FormDynamic = ({
  state,
  onTextChange,
  onCheckboxChange,
  validation
}) => {
  return (
    <>
      <GridItem>
        <Control
          label="Duration (hours)"
          helper="Description"
          isInvalid={!!validation['hours']}
          errorMessage={validation['hours']}>
          <Input
            isInvalid={!!validation['hours']}
            type="number"
            value={state.hours}
            onChange={onTextChange('hours')}
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

      {/* <GridItem colSpan={2}>
        <Control label="Fee Token" helper="Ethereum Address">
          <Input
            type="text"
            value={state.feeToken}
            onChange={onTextChange('feeToken')}
          />
        </Control>
      </GridItem> */}

      <GridItem>
        <Control
          label="Fee Amount (ETH)"
          isInvalid={!!validation['fee']}
          errorMessage={validation['fee']}>
          <Input
            type="text"
            value={state.fee}
            onChange={onTextChange('fee')}
            isInvalid={!!validation['fee']}
          />
        </Control>
      </GridItem>
    </>
  )
}
