import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { RecoilRoot } from 'recoil'
import { Toaster } from "@/components/ui/sonner"


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RecoilRoot>
    <Toaster position="bottom-center" />
    <App />
    </RecoilRoot>
  </StrictMode>,
)
