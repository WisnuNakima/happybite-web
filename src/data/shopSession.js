import { seedProducts } from './catalogProducts'

export const SESSION_KEY = 'happybite-shop-v1'
export const emptyCheckout = {
  name: '',
  whatsapp: '',
  email: '',
  address: '',
  city: '',
  postalCode: '',
  notes: '',
}
const emptySession = () => ({
  cartItems: [],
  gift: { enabled: false, message: '' },
  checkout: { ...emptyCheckout },
  order: null,
})

export function readShopSession(detailProducts = seedProducts) {
  try {
    const saved = JSON.parse(sessionStorage.getItem(SESSION_KEY))
    if (!saved || !Array.isArray(saved.cartItems)) return emptySession()
    const cartItems = saved.cartItems.filter(
      (item) =>
        detailProducts.some((product) => product.id === item.productId) &&
        Number.isSafeInteger(item.quantity) &&
        item.quantity > 0 &&
        typeof item.variant === 'string' &&
        item.id === JSON.stringify([item.productId, item.variant]) &&
        typeof item.selected === 'boolean',
    )
    const checkout = Object.fromEntries(
      Object.keys(emptyCheckout).map((key) => [
        key,
        typeof saved.checkout?.[key] === 'string' ? saved.checkout[key] : '',
      ]),
    )
    const gift = {
      enabled: saved.gift?.enabled === true,
      message:
        typeof saved.gift?.message === 'string'
          ? saved.gift.message.slice(0, 150)
          : '',
    }
    const order =
      saved.order &&
      typeof saved.order.id === 'string' &&
      Number.isFinite(saved.order.deadline) &&
      typeof saved.order.fingerprint === 'string'
        ? saved.order
        : null
    return { cartItems, checkout, gift, order }
  } catch {
    return emptySession()
  }
}

export function selectedOrderItems(cartItems, detailProducts = seedProducts) {
  return cartItems
    .filter((item) => item.selected)
    .map((item) => ({
      ...item,
      product: detailProducts.find((product) => product.id === item.productId),
    }))
    .filter((item) => item.product)
}

export function orderFingerprint(
  cartItems,
  checkout,
  gift,
  detailProducts = seedProducts,
) {
  return JSON.stringify({
    items: selectedOrderItems(cartItems, detailProducts).map(
      ({ product, ...item }) => ({
        ...item,
        price: product.price,
      }),
    ),
    checkout,
    gift,
  })
}

// No shipping or gateway charge is configured in this local checkout.
export function orderTotals(cartItems, detailProducts = seedProducts) {
  const subtotal = selectedOrderItems(cartItems, detailProducts).reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0,
  )
  return { subtotal, shipping: 0, service: 0, total: subtotal }
}
