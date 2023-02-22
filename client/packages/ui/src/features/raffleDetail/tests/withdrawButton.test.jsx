import React from 'react'
import { render, screen } from '@testing-library/react'

import { WithdrawButton } from '../'

const getProps = ({ status, address, owner, withdrawn }) => ({
  update: () => {},
  raffle: {
    id: 1,
    status,
    owner,
    withdrawn
  },
  address
})

const getComponent = (props) => {
  const component = <WithdrawButton {...props} />

  return component
}

const checkStatusText = 'Withdraw LINK'

describe('WithdrawButton', () => {
  it('does not render withdraw button on status != finished', () => {
    const props = getProps({
      status: '',
      address: '0x0E1ce369e53275f3e0Ff92EA30BE84c55Bc8a32e',
      owner: '0x0E1ce369e53275f3e0Ff92EA30BE84c55Bc8a32e',
      withdrawn: false
    })
    render(getComponent(props))

    // TODO: canWithdraw true

    const button = screen.queryByText(checkStatusText)
    expect(button).toBeNull()
  })

  it('does not render withdraw button on !address', () => {
    const props = getProps({
      status: 'FINISHED',
      address: '',
      owner: '0x0E1ce369e53275f3e0Ff92EA30BE84c55Bc8a32e',
      withdrawn: false
    })
    render(getComponent(props))

    // TODO: canWithdraw true

    const button = screen.queryByText(checkStatusText)
    expect(button).toBeNull()
  })

  it('does not render withdraw button on address != owner', () => {
    const props = getProps({
      status: 'FINISHED',
      address: '0x0E1ce369e53275f3e0Ff92EA30BE84c55Bc8a32e',
      owner: '0x0E1ce369e53275f3e0Ff92EA30BE84c55Bc8a32f',
      withdrawn: false
    })
    render(getComponent(props))

    // TODO: canWithdraw true

    const button = screen.queryByText(checkStatusText)
    expect(button).toBeNull()
  })

  it('does not render withdraw button on !canWithdraw', () => {
    const props = getProps({
      status: 'FINISHED',
      address: '0x0E1ce369e53275f3e0Ff92EA30BE84c55Bc8a32e',
      owner: '0x0E1ce369e53275f3e0Ff92EA30BE84c55Bc8a32e',
      withdrawn: false
    })
    render(getComponent(props))

    // TODO: canWithdraw false

    const button = screen.queryByText(checkStatusText)
    expect(button).toBeNull()
  })

  // TODO: enable this test after figuring out how to mock intercept canWithdraw to true
  // it('renders withdraw button on status = finished && address == owner && withdrawn = false && canWithdraw', () => {
  //   const props = getProps({
  //     status: 'FINISHED',
  //     address: '0x0E1ce369e53275f3e0Ff92EA30BE84c55Bc8a32e',
  //     owner: '0x0E1ce369e53275f3e0Ff92EA30BE84c55Bc8a32e',
  //     withdrawn: false,
  //   })
  //   render(getComponent(props))

  //   // TODO: canWithdraw true

  //   const button = screen.queryByText(checkStatusText)
  //   expect(button).toBeTruthy()
  // })
})
