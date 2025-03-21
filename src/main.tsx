
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Toaster } from '@/components/ui/toaster'
import { GeminiProvider } from './contexts/GeminiContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GeminiProvider>
      <App />
      <Toaster />
    </GeminiProvider>
  </React.StrictMode>,
)
