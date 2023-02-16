import React from 'react'

// TODO: style this component
export const Loading = ({ asyncManager }) =>
  asyncManager.loading && <div>Loading...</div>
