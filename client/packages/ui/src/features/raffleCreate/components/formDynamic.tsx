import React from 'react'

export const initialDynamicState = {
  duration: 24,
  automation: false,
  token: '',
  tokenAmount: 0,
  feeToken: '',
  feeTokenAmount: 0,
  whitelistMerkleRoot: ''
}

export const FormDynamic = ({ state, onTextChange, onCheckboxChange }) => {
  return (
    <>
      <div>
        <span>Duration (hours)</span>
        <input
          type="number"
          value={state.duration}
          onChange={onTextChange('duration')}
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
        <input
          type="text"
          value={state.feeTokenAmount}
          onChange={onTextChange('feeTokenAmount')}
        />
      </div>

      <div>
        <span>Whitelist Merkle Root</span>
        <input
          type="text"
          value={state.whitelistMerkleRoot}
          onChange={onTextChange('whitelistMerkleRoot')}
        />
      </div>
    </>
  )
}
