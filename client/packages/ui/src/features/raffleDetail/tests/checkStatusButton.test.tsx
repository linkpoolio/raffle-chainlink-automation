import React from 'react'
import { render, screen } from '@testing-library/react'

import { CheckStatusButton } from '../'

const getProps = ({ status }) => ({
  update: () => {},
  raffle: {
    status
  },
  asyncManager: null,
  identifier: null
})

const getComponent = (props) => {
  const component = <CheckStatusButton {...props} />

  return component
}

const checkStatusText = 'Did I win?'

describe('CheckStatusButton', () => {
  it('does not render check status button on status != finished', () => {
    const props = getProps({
      status: null
    })
    render(getComponent(props))

    const button = screen.queryByText(checkStatusText)
    expect(button).toBeNull()
  })

  it('renders check status button on status == finished', () => {
    const props = getProps({
      status: 2
    })
    render(getComponent(props))

    const button = screen.queryByText(checkStatusText)
    expect(button).toBeTruthy()
  })
})
