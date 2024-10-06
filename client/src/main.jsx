import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {ToastContainer} from "react-toastify"
import { AuthProvider } from '../store/auth.jsx'
import "./index.css"

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <StrictMode>
        <div>
          <div class="wave"></div>
        </div>
        <App />
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition: Bounce
          />
    </StrictMode>,
  </AuthProvider>
)
