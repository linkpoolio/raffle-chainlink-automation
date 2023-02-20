import React from 'react'
import renderer from 'react-test-renderer'

import { Providers } from '@ui/providers'
import { RaffleDetail } from '../'

const getComponent = () => {
  const component = (
    <Providers>
      <RaffleDetail id={1} />
    </Providers>
  )

  return component
}

describe('RaffleDetail', () => {
  it('matches snapshot', () => {
    const tree = renderer.create(getComponent()).toJSON()

    expect(tree).toMatchSnapshot()
  })
})
