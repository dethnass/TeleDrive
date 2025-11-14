import React from 'react'
import { render } from '@testing-library/react'
import App from './App'

test('renders app without crashing', () => {
  // Basic smoke test - just ensure the app component renders without errors
  const { container } = render(<App />)
  expect(container).toBeInTheDocument()
})
