import React from 'react'
import { createRoot } from 'react-dom/client'
import { act } from '@testing-library/react'
import renderer from 'react-test-renderer'

import { App } from '@ui/App'
import { Providers } from '@ui/providers'
import { NavigationBar } from '@ui/components'

const getComponent = () => {
  const component = (
    <Providers>
      <NavigationBar />
      <App />
    </Providers>
  )

  return component
}

describe('App', () => {
  it('renders the App.', () => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const root = createRoot(container)

    act(() => root.render(getComponent()))

    expect(document.body.textContent).toBeTruthy()
  })

  it('matches snapshot', () => {
    const tree = renderer.create(getComponent()).toJSON()

    expect(tree).toMatchSnapshot()
  })
})
