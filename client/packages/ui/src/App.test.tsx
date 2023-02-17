import React from 'react'
import { Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'
// import { createRoot } from 'react-dom/client'
// import { act } from '@testing-library/react'
import renderer from 'react-test-renderer'

import { App } from '@ui/App'

const getComponent = () => {
  const history = createBrowserHistory()

  const component = (
    <Router history={history}>
      <App />
    </Router>
  )

  return component
}

describe('App', () => {
  // TODO: debug why this isnt working
  // it('renders the App.', () => {
  //   const container = document.createElement('div')
  //   document.body.appendChild(container)

  //   const root = createRoot(container)

  //   act(() => root.render(getComponent()))

  //   expect(document.body.textContent).toBeTruthy()
  // })

  it('matches snapshot', () => {
    const tree = renderer.create(getComponent()).toJSON()

    expect(tree).toMatchSnapshot()
  })
})
