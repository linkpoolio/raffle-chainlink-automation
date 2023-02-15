import React from 'react'
import { render } from 'react-dom'
import { createBrowserHistory } from 'history'
import { Providers } from '@ui/providers'
import { ChakraProvider } from '@chakra-ui/react'

import { App } from '@ui/App'
import theme from './styles/theme'

const history = createBrowserHistory()

render(
  <ChakraProvider theme={theme}>
    <Providers history={history}>
      <App />
    </Providers>
  </ChakraProvider>,
  document.getElementById('root')
)
