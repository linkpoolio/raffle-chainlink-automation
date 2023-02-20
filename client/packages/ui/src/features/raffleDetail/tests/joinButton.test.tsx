import React from 'react'
import { render, screen } from '@testing-library/react'

import { JoinButton } from '../'

const getProps = ({ type, status, address }) => ({
  raffle: {
    type,
    status,
    contestantsAddresses: ['0x122']
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
      status: 1,
      type: null,
      address: null
    })
    render(getComponent(props))

    const button = screen.queryByText(joinText)
    expect(button).toBeNull()
  })

  it('does not render join button on status == in progress && type == dynamic && wallet != connected', () => {
    const props = getProps({
      status: 1,
      type: 0,
      address: null
    })
    render(getComponent(props))

    const button = screen.queryByText(joinText)
    expect(button).toBeNull()
  })

  it('does not render join button on status == in progress && type == dynamic && wallet == connected && already participant', () => {
    const props = getProps({
      status: 1,
      type: 0,
      address: '0x122'
    })
    render(getComponent(props))

    const button = screen.queryByText(joinText)
    expect(button).toBeNull()
  })

  it('renders join button on status == in progress && type == dynamic && wallet == connected && not already participant', () => {
    const props = getProps({
      status: 1,
      type: 0,
      address: '0x123'
    })
    render(getComponent(props))

    const button = screen.queryByText(joinText)
    expect(button).toBeTruthy()
  })
})
