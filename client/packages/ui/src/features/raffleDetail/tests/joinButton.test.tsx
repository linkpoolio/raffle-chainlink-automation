import React from 'react'
import { render, screen } from '@testing-library/react'

import { JoinButton } from '../'

const getProps = ({ type, status, address }) => ({
  raffle: {
    type,
    status
  },
  address,
  identifier: address
})

const getComponent = (props) => {
  const component = <JoinButton {...props} />

  return component
}

const joinText = 'Join Raffle'

describe('JoinButton', () => {
  it('does not render join button on status != in progress', () => {
    const props = getProps({
      status: null,
      type: null,
      address: null
    })
    render(getComponent(props))

    const button = screen.queryByText(joinText)
    expect(button).toBeNull()
  })

  it('does not render join button on status == in progress && type != dynamic', () => {
    const props = getProps({
      status: 'IN_PROGRESS',
      type: null,
      address: null
    })
    render(getComponent(props))

    const button = screen.queryByText(joinText)
    expect(button).toBeNull()
  })

  it('does not render join button on status == in progress && type == dynamic && wallet != connected', () => {
    const props = getProps({
      status: 'IN_PROGRESS',
      type: 'DYNAMIC',
      address: null
    })
    render(getComponent(props))

    const button = screen.queryByText(joinText)
    expect(button).toBeNull()
  })

  it('renders join button on status == in progress && type == dynamic && wallet == connected', () => {
    const props = getProps({
      status: 'IN_PROGRESS',
      type: 'DYNAMIC',
      address: '0x123'
    })
    render(getComponent(props))

    const button = screen.queryByText(joinText)
    expect(button).toBeTruthy()
  })
})
