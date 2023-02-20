import React from 'react'

export const Error = ({ asyncManager }) =>
  asyncManager.error && <div>{asyncManager.error}</div>
