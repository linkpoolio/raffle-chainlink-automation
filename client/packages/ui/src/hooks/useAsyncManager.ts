import { useState, useEffect } from 'react'

export const initialAsyncState = {
  loading: false,
  error: null
}

export const useAsyncManager = () => {
  const [loading, setLoading] = useState(initialAsyncState.loading)
  const [error, setError] = useState(initialAsyncState.error)

  const start = () => {
    setError(initialAsyncState.error)
    setLoading(true)
  }

  const success = () => {
    setLoading(initialAsyncState.loading)
  }

  const fail = (message) => {
    setLoading(initialAsyncState.loading)
    setError(message)
  }

  const reset = () => {
    setLoading(initialAsyncState.loading)
    setError(initialAsyncState.error)
  }

  const componentDidUnmount = () => reset()
  useEffect(componentDidUnmount, [])

  return {
    loading,
    error,
    start,
    success,
    fail
  }
}
