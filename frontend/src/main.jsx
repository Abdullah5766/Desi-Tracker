import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#f9fafb',
            border: '1px solid #374151'
          },
          success: {
            iconTheme: {
              primary: '#a855f7',
              secondary: '#f9fafb'
            }
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#f9fafb'
            }
          }
        }}
      />
    </BrowserRouter>
  </StrictMode>,
)