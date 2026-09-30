import { useEffect, useRef, useState } from 'react'
import { useAuth } from './authContext'
import { ProductsContext } from './productsContext'
import {
  PRODUCTS_KEY,
  parseProducts,
  prepareProduct,
  readProducts,
} from '@/data/productStore'

export default function ProductsProvider({ children }) {
  const [products, setProducts] = useState(readProducts)
  const current = useRef(products)
  const { user } = useAuth()
  useEffect(() => {
    function sync(event) {
      if (event.key !== PRODUCTS_KEY && event.key !== null) return
      try {
        const next = event.newValue
          ? parseProducts(event.newValue)
          : readProducts()
        if (next) {
          current.current = next
          setProducts(next)
        }
      } catch {
        /* Ignore malformed external storage writes. */
      }
    }
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  function commit(next) {
    if (user?.role !== 'admin')
      throw new Error('Hanya admin yang dapat mengubah produk.')
    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(next))
    } catch {
      throw new Error(
        'Produk belum tersimpan. Penyimpanan browser penuh atau tidak tersedia; coba foto yang lebih kecil.',
      )
    }
    current.current = next
    setProducts(next)
  }
  function saveProduct(values, id) {
    const existing = id ? current.current.find((p) => p.id === id) : null
    if (id && !existing)
      throw new Error(
        'Produk ini sudah dihapus. Tutup panel dan muat ulang daftar.',
      )
    const product = prepareProduct(values, existing)
    commit(
      id
        ? current.current.map((p) => (p.id === id ? product : p))
        : [...current.current, product],
    )
  }
  function duplicateProduct(id) {
    const source = current.current.find((p) => p.id === id)
    if (!source) return
    const duplicate = prepareProduct({
      ...source,
      name: `${source.name} (Salinan)`,
      isLiveOnWebsite: false,
    })
    commit([...current.current, duplicate])
  }
  function deleteProduct(id) {
    commit(current.current.filter((p) => p.id !== id))
  }
  return (
    <ProductsContext.Provider
      value={{ products, saveProduct, duplicateProduct, deleteProduct }}
    >
      {children}
    </ProductsContext.Provider>
  )
}
