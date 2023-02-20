import React from 'react'
import renderer from 'react-test-renderer'

import { Providers } from '@ui/providers'
import { RaffleList } from '../'

const getComponent = () => {
  const component = (
    <Providers>
      <RaffleList />
    </Providers>
  )

  return component
}

describe('RaffleList', () => {
  it('matches snapshot', () => {
    const tree = renderer.create(getComponent()).toJSON()

    expect(tree).toMatchSnapshot()
  })
})
