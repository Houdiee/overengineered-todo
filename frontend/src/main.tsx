import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App as AntdApp } from 'antd'
import App from './App.tsx'
import './index.css'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AntdApp>
      <App />
    </AntdApp>
  </StrictMode>,
)
