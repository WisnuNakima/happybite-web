import { seedProducts } from './catalogProducts'

export const PRODUCTS_KEY = 'happybite-products-v1'
export const productPlaceholder = '/images/classic-chocochip.jpg'

export function parseProducts(raw) {
  const saved = JSON.parse(raw)
  if (
    !Array.isArray(saved) ||
    !saved.every(
      (p) =>
        p &&
        typeof p.id === 'string' &&
        typeof p.sku === 'string' &&
        typeof p.name === 'string' &&
        typeof p.image === 'string' &&
        typeof p.category === 'string' &&
        typeof p.description === 'string' &&
        typeof p.deskripsiProduk === 'string' &&
        Number.isFinite(p.rating) &&
        Number.isFinite(p.reviewCount) &&
        Array.isArray(p.galleryImages) &&
        Array.isArray(p.relatedProductIds) &&
        Number.isSafeInteger(p.adonanDinginChiller) &&
        p.adonanDinginChiller >= 0 &&
        Number.isFinite(p.price) &&
        p.price > 0 &&
        Number.isSafeInteger(p.stokDisplayEtalase) &&
        p.stokDisplayEtalase >= 0 &&
        typeof p.isLiveOnWebsite === 'boolean',
    )
  )
    return null
  return saved
}

export function readProducts() {
  try {
    return parseProducts(localStorage.getItem(PRODUCTS_KEY)) || seedProducts
  } catch {
    return seedProducts
  }
}

export function stockStatus(product) {
  if (product.stokDisplayEtalase === 0) return 'empty'
  return product.stokDisplayEtalase <= 5 ? 'low' : 'available'
}

export function prepareProduct(values, existing) {
  const token = crypto.randomUUID()
  const image = values.image || productPlaceholder
  const stock = Number(values.stokDisplayEtalase)
  return {
    rating: 0,
    reviewCount: 0,
    badge: 'Baru',
    badgeStyle: 'bg-blush text-chocolate',
    batchNote: 'Freshly Baked Today',
    packagingNote: 'Sudah Termasuk Pajak & Individual Food-Grade Pouch',
    relatedProductIds: ['matcha-melt', 'dark-walnut', 'classic-nyc'],
    ...existing,
    ...values,
    id: existing?.id || `cookie-${token}`,
    sku: existing?.sku || `HB-${token.slice(0, 8).toUpperCase()}`,
    name: values.name.trim(),
    price: Number(values.price),
    image,
    stokDisplayEtalase: stock,
    adonanDinginChiller: Number(values.adonanDinginChiller),
    stockNote: stock ? `Sisa ${stock} pcs` : 'Habis etalase',
    lowStock: stock <= 5,
    description: values.deskripsiProduk.trim(),
    fullDescription: values.deskripsiProduk.trim(),
    detailBadge: existing?.detailBadge || 'Freshly Baked',
    galleryImages: [
      image,
      ...(existing?.galleryImages?.slice(1) || [image, image, image]),
    ],
    isCatalogVisible: existing?.isCatalogVisible ?? true,
    variantSelect: values.category === 'bundles',
    variants:
      values.category === 'bundles'
        ? existing?.variants || [
            'Mix Favorit',
            'Chocolate Lovers',
            'Matcha & Choco',
          ]
        : [],
    unitNote:
      existing?.category === values.category
        ? existing.unitNote
        : values.category === 'bundles'
          ? '/ box'
          : '/ pcs',
    priceLabel: values.category === 'bundles' ? 'Paket Box' : 'Harga Satuan',
  }
}
