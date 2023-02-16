import React from 'react'

// TODO: style this component
export const Error = ({ asyncManager }) =>
  asyncManager.error && <div>{asyncManager.error}</div>
