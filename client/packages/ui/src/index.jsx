import React from 'react'
import { render } from 'react-dom'
import { createBrowserHistory } from 'history'

import { Providers } from '@ui/config/Providers'
import { App } from '@ui/App'

const history = createBrowserHistory()

render(
  <Providers history={history}>
    <App />
  </Providers>,
  document.getElementById('root')
)
