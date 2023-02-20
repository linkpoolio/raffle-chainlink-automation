import React from 'react'
import renderer from 'react-test-renderer'

import { Providers } from '@ui/providers'
import { RaffleCreate } from '../'

const getComponent = () => {
  const component = (
    <Providers>
      <RaffleCreate />
    </Providers>
  )

  return component
}

describe('RaffleCreate', () => {
  it('matches snapshot', () => {
    const tree = renderer.create(getComponent()).toJSON()

    expect(tree).toMatchSnapshot()
  })
})
