import React from 'react'

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
      <div>
        <span>Duration (hours)</span>
        <input
          type="number"
          value={state.timeLength}
          onChange={onTextChange('timeLength')}
        />
      </div>

      <div>
        <span>Automation</span>
        <input
          type="checkbox"
          checked={state.automation}
          onChange={onCheckboxChange('automation')}
        />
      </div>

      <div>
        <span>Token</span>
        <input
          type="text"
          value={state.token}
          onChange={onTextChange('token')}
        />
      </div>

      <div>
        <span>Token Amount (wei)</span>
        <input
          type="text"
          value={state.tokenAmount}
          onChange={onTextChange('tokenAmount')}
        />
      </div>

      <div>
        <span>Fee Token</span>
        <input
          type="text"
          value={state.feeToken}
          onChange={onTextChange('feeToken')}
        />
      </div>

      <div>
        <span>Fee Token Amount (wei)</span>
        <input type="text" value={state.fee} onChange={onTextChange('fee')} />
      </div>

      <div>
        <span>Whitelist Merkle Root</span>
        <input
          type="text"
          value={state.merkleRoot}
          onChange={onTextChange('merkleRoot')}
        />
      </div>
    </>
  )
}
