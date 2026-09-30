import AppRoutes from '@/routes/AppRoutes'
import { useEffect, useReducer, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useOrders } from '@/context/ordersContext'
import { createCheckoutOrder } from '@/data/orders'
import {
  SESSION_KEY,
  readShopSession,
  orderFingerprint,
} from '@/data/shopSession'
import { cartReducer } from '@/data/cart'
import { useProducts } from '@/context/productsContext'

export default function App() {
  const { products: detailProducts } = useProducts()
  const { addOrder } = useOrders()
  const { pathname, hash, key } = useLocation()
  const [saved] = useState(() => readShopSession(detailProducts))
  const [cartItems, dispatchCart] = useReducer(cartReducer, saved.cartItems)
  const [gift, setGift] = useState(saved.gift)
  const [checkout, setCheckout] = useState(saved.checkout)
  const [order, setOrder] = useState(saved.order)
  const fingerprint = orderFingerprint(
    cartItems,
    checkout,
    gift,
    detailProducts,
  )
  const currentOrder = order?.fingerprint === fingerprint ? order : null
  useEffect(() => {
    try {
      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ cartItems, gift, checkout, order }),
      )
    } catch {
      /* Browsers can disable session storage; the in-memory flow still works. */
    }
  }, [cartItems, gift, checkout, order])
  function startPayment() {
    if (
      currentOrder?.status === 'pending' &&
      currentOrder.deadline > Date.now()
    )
      return
    setOrder({
      id: `HB-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      fingerprint,
      deadline: Date.now() + 15 * 60 * 1000,
      status: 'pending',
    })
  }
  function confirmPayment(sender) {
    if (
      !currentOrder ||
      currentOrder.deadline <= Date.now() ||
      currentOrder.status !== 'pending'
    )
      return false
    const placedOrder = createCheckoutOrder({
      id: currentOrder.id,
      cartItems,
      checkout,
      gift,
      sender,
      products: detailProducts,
    })
    if (!placedOrder.items.length) return false
    addOrder(placedOrder)
    dispatchCart({
      type: 'removeOrdered',
      ids: placedOrder.items.map((item) => item.id),
    })
    setGift({ enabled: false, message: '' })
    // Keep a completion marker while the router transitions away from Payment.
    setOrder({ ...currentOrder, status: 'placed' })
    return true
  }
  const cartCount = cartItems
    .filter((item) =>
      detailProducts.some((product) => product.id === item.productId),
    )
    .reduce((total, item) => total + item.quantity, 0)
  const addToCart = (product, quantity = 1, variant = '') =>
    dispatchCart({ type: 'add', productId: product.id, quantity, variant })
  const buyNow = (product, quantity, variant) =>
    dispatchCart({ type: 'buyNow', productId: product.id, quantity, variant })

  useEffect(() => {
    document.title =
      pathname === '/login'
        ? 'Masuk Akun — HappyBite'
        : pathname === '/katalog'
          ? 'Katalog Menu — HappyBite'
          : 'HappyBite — Kebahagiaan di Setiap Gigitan'
    if (pathname.startsWith('/katalog/')) {
      const product = detailProducts.find(
        (item) => item.id === pathname.split('/')[2],
      )
      document.title = `${product?.name || 'Produk tidak ditemukan'} — HappyBite`
    } else if (pathname === '/checkout') document.title = 'Checkout — HappyBite'
    else if (pathname === '/keranjang')
      document.title = 'Keranjang Belanja — HappyBite'
    else if (pathname === '/pembayaran')
      document.title = 'Pembayaran — HappyBite'
    else if (pathname === '/pesanan-berhasil')
      document.title = 'Konfirmasi Pesanan — HappyBite'
    else if (pathname === '/profil') document.title = 'Profil Akun — HappyBite'
    else if (pathname === '/riwayat-pesanan')
      document.title = 'Riwayat Pesanan — HappyBite'
  }, [pathname, detailProducts])

  useEffect(() => {
    const target = hash && document.getElementById(hash.slice(1))
    if (target) target.scrollIntoView({ behavior: 'instant' })
    else window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash, key])

  return (
    <AppRoutes
      cartCount={cartCount}
      cartItems={cartItems}
      dispatchCart={dispatchCart}
      gift={gift}
      setGift={setGift}
      checkout={checkout}
      setCheckout={setCheckout}
      order={order}
      currentOrder={currentOrder}
      addToCart={addToCart}
      buyNow={buyNow}
      startPayment={startPayment}
      confirmPayment={confirmPayment}
    />
  )
}
