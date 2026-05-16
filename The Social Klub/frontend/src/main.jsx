import React from 'react'
// import removed
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './api/axiosConfig'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
