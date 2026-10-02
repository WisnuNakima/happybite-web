import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import ProductsProvider from '@/context/ProductsProvider'
import AuthProvider from '@/context/AuthProvider'
import OrdersProvider from '@/context/OrdersProvider'
import NotificationsProvider from '@/context/NotificationsProvider'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <NotificationsProvider>
          <ProductsProvider>
            <OrdersProvider>
              <App />
            </OrdersProvider>
          </ProductsProvider>
        </NotificationsProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
