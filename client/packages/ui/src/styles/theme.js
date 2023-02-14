import { extendTheme } from '@chakra-ui/react'

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false
}

const theme = extendTheme({
  config,
  brand: {
    50: 'black.50',
    100: 'black.100',
    500: 'gray.500'
  },
  components: {
    Link: {
      baseStyle: {
        textDecoration: 'none'
      }
    },
    Button: {
      baseStyle: {
        backgroundColor: 'rgb(55,91,210)',
        color: 'white'
      },
      variants: {
        action: {
          backgroundColor: 'rgb(55,91,210)',
          color: 'white'
        },
        ghost: {
          backgroundColor: 'rgb(167,136,222)',
          color: 'black'
        },
        wallet: {
          backgroundColor: 'white',
          color: 'black'
        }
      }
    }
  },
  styles: {
    global: () => ({
      'html, body': {
        fontSize: '16px',
        color: 'black',
        lineHeight: 'tall',
        fontFamily: `"system-ui","-apple-system","BlinkMacSystemFont","Segoe UI","Helvetica","Arial","sans-serif"`,
        height: '100%'
      },
      'div#__next': {
        height: '100%'
      },
      a: {
        color: 'black'
      },
      body: {
        bg: ''
      }
    })
  }
})

export default theme
