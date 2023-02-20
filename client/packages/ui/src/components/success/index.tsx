import React from 'react'

export const Success = ({ show, onClose, message }) =>
  show && (
    <div>
      <span>{message}</span>
      <button onClick={onClose}>X</button>
    </div>
  )
