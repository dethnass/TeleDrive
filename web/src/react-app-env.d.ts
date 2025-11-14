/// <reference types="react-scripts" />

// TypeScript 5.7 + React 18 compatibility patch for react-router-dom v5
// Fixes: 'Switch' cannot be used as a JSX component error
import * as React from 'react'

declare module 'react' {
  // Extend React.Component to include refs property for backwards compatibility
  interface Component<P = {}, S = {}, SS = any> {
    refs?: any
  }
}
