import React from 'react'

export const Loading = ({ asyncManager }) =>
  asyncManager.loading && <div>Loading...</div>
