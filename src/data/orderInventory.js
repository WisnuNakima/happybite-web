// Aggregate variants of the same product before checking stock. Sample and
// historical orders are never backfilled: only a new checkout reserves stock.
export function reserveOrderInventory(products, order) {
  const reservation = JSON.stringify([order.ownerEmail, order.id])
  const quantities = new Map()
  for (const item of order.items) {
    if (!Number.isSafeInteger(item.quantity) || item.quantity < 1)
      throw new Error('Jumlah produk tidak valid. Periksa kembali keranjang.')
    quantities.set(
      item.productId,
      (quantities.get(item.productId) || 0) + item.quantity,
    )
  }
  for (const [id, quantity] of quantities) {
    const product = products.find((item) => item.id === id)
    if (product?.stockReservations?.includes(reservation)) continue
    if (!product || !product.isLiveOnWebsite)
      throw new Error('Produk tidak lagi tersedia. Periksa kembali keranjang.')
    if (
      !Number.isSafeInteger(quantity) ||
      product.stokDisplayEtalase < quantity
    )
      throw new Error(
        `Stok ${product.name} tidak mencukupi. Tersisa ${product.stokDisplayEtalase} pcs; Anda memesan ${quantity} pcs. Silakan ubah jumlah di keranjang.`,
      )
  }
  return products.map((product) => {
    const quantity = quantities.get(product.id)
    if (!quantity || product.stockReservations?.includes(reservation))
      return product
    const stock = product.stokDisplayEtalase - quantity
    return {
      ...product,
      stokDisplayEtalase: stock,
      stockNote: stock ? `Sisa ${stock} pcs` : 'Habis etalase',
      lowStock: stock <= 5,
      // Persist with stock so retrying an interrupted confirmation is safe.
      stockReservations: [...(product.stockReservations || []), reservation],
    }
  })
}
