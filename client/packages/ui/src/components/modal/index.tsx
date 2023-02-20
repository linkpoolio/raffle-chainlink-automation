import React from 'react'

export const Modal = ({ children, onClose }) => (
  <div>
    <button onClick={onClose}>X</button>
    <h2>This is a modal</h2>
    {children}
  </div>
)
