import { defineStyleConfig } from '@chakra-ui/react'

export const Button = defineStyleConfig({
  baseStyle: {
    fontWeight: 'bold',
    borderRadius: 'base'
  },
  sizes: {
    md: {
      fontSize: 'sm'
    }
  },
  variants: {
    nav: {
      px: 6,
      border: '2px solid',
      borderColor: 'brand.primary',
      color: 'brand.primary',
      _hover: {
        bg: 'brand.zircon',
        color: 'brand.biscay',
        borderColor: 'brand.biscay'
      }
    }
  }
})
