export const initialState = {
  step: null,
  identifier: null,
  participantStatus: null
}

export const useStateManager = (setState) => (state, key, value) => {
  if (Array.isArray(key) && Array.isArray(value)) {
    const next = {}
    key.map((keyName, index) => (next[keyName] = value[index]))
    return setState({
      ...state,
      ...next
    })
  }

  if (!Array.isArray(key) && !Array.isArray(value)) {
    return setState({
      ...state,
      [key]: value
    })
  }

  throw new Error('Mixed array types for useStateManager for `key` and `value`')
}
