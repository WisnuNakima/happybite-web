import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import Icon from '@/components/Icon'
import { productCategories } from '@/data/catalogProducts'
import { useProducts } from '@/context/productsContext'
import ProductField, { inputClass } from './ProductField'

export default function ProductEditor({ product, onClose }) {
  const { saveProduct } = useProducts()
  const reduceMotion = useReducedMotion()
  const panel = useRef(null)
  const photo = useRef(null)
  const photoRead = useRef(0)
  const [values, setValues] = useState(() => ({
    name: product?.name || '',
    image: product?.image || '',
    category: product?.category || 'stuffed',
    price: product?.price ?? '',
    stokDisplayEtalase: product?.stokDisplayEtalase ?? 0,
    adonanDinginChiller: product?.adonanDinginChiller ?? 0,
    adonanDinginLokasi: product?.adonanDinginLokasi || '',
    suhuOvenIdeal: product?.suhuOvenIdeal || '',
    durasiPemanggangan: product?.durasiPemanggangan || '',
    deskripsiProduk: product?.deskripsiProduk || '',
    isLiveOnWebsite: product?.isLiveOnWebsite ?? true,
  }))
  const [errors, setErrors] = useState({})
  const [reading, setReading] = useState(false)
  useEffect(() => {
    const previous = document.activeElement
    panel.current?.focus({ preventScroll: true })
    function key(event) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', key)
    return () => {
      window.removeEventListener('keydown', key)
      previous?.focus({ preventScroll: true })
    }
  }, [onClose])
  function change(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '', save: '' }))
  }
  function choosePhoto(event) {
    const file = event.target.files?.[0]
    const version = ++photoRead.current
    if (!file) return
    if (
      !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) ||
      file.size > 2 * 1024 * 1024
    ) {
      setErrors((current) => ({
        ...current,
        image: 'Gunakan JPG, PNG, atau WEBP maksimal 2 MB.',
      }))
      event.target.value = ''
      return
    }
    const reader = new FileReader()
    setReading(true)
    reader.onload = () => {
      if (version !== photoRead.current) return
      setValues((current) => ({ ...current, image: reader.result }))
      setErrors((current) => ({ ...current, image: '' }))
      setReading(false)
    }
    reader.onerror = () => {
      setReading(false)
      setErrors((current) => ({
        ...current,
        image: 'Foto tidak dapat dibaca.',
      }))
    }
    reader.readAsDataURL(file)
  }
  function submit(event) {
    event.preventDefault()
    const next = {}
    if (!values.name.trim()) next.name = 'Nama varian cookie wajib diisi.'
    if (
      !values.price ||
      !Number.isSafeInteger(Number(values.price)) ||
      Number(values.price) <= 0
    )
      next.price = 'Masukkan harga satuan lebih dari Rp 0 (rupiah bulat).'
    for (const field of ['stokDisplayEtalase', 'adonanDinginChiller']) {
      if (
        !Number.isSafeInteger(Number(values[field])) ||
        Number(values[field]) < 0 ||
        values[field] === ''
      )
        next[field] = 'Masukkan jumlah bulat minimal 0.'
    }
    setErrors(next)
    if (Object.keys(next).length) return
    try {
      saveProduct(values, product?.id)
      onClose()
    } catch (error) {
      setErrors({ save: error.message })
    }
  }
  const field = (name) => ({
    name,
    value: values[name],
    onChange: change,
    error: errors[name],
  })
  return (
    <motion.aside
      data-product-editor
      ref={panel}
      tabIndex={-1}
      role="dialog"
      aria-modal="false"
      aria-labelledby="product-editor-title"
      initial={reduceMotion ? false : { x: '100%' }}
      animate={{ x: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.25, ease: 'easeOut' }}
      className="fixed bottom-0 right-0 top-0 z-40 flex w-[min(90vw,480px)] flex-col bg-white shadow-warm outline-none 2xl:w-[560px]"
    >
      <header className="shrink-0 bg-canvas px-6 py-6">
        <button
          onClick={onClose}
          type="button"
          aria-label="Tutup panel produk"
          className="float-right ml-3 rounded-full bg-blush/60 p-2 hover:bg-blush"
        >
          <Icon name="close" className="h-4 w-4" />
        </button>
        {product && (
          <div className="mb-2 flex flex-wrap items-center gap-2 text-[10px]">
            <span className="rounded-full bg-blush px-2 py-1 font-bold">
              SKU: {product.sku}
            </span>
            <span
              className={`h-1.5 w-1.5 rounded-full ${product.isLiveOnWebsite ? 'bg-emerald-600' : 'bg-muted'}`}
            />
            <span>
              {product.isLiveOnWebsite
                ? 'Live di Website'
                : 'Tidak ditampilkan'}
            </span>
          </div>
        )}
        <h2 id="product-editor-title" className="text-lg font-bold leading-7">
          {product ? `Edit Varian: ${product.name}` : 'Tambah Produk Baru'}
        </h2>
      </header>
      <form
        noValidate
        onSubmit={submit}
        className="flex min-h-0 flex-1 flex-col"
      >
        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          <div>
            <p className="mb-2 text-xs font-bold uppercase">
              Foto Tampilan Produk
            </p>
            <div className="flex items-center gap-4 rounded-2xl bg-peach p-3">
              {values.image ? (
                <img
                  src={values.image}
                  alt="Preview foto produk"
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-blush/60 text-primary">
                  <Icon name="cookie" className="h-8 w-8" />
                </span>
              )}
              <div className="text-[11px] text-muted">
                <p>Rekomendasi rasio 1:1, format WEBP/JPG max 2MB.</p>
                <div className="mt-2 flex gap-4">
                  <button
                    type="button"
                    onClick={() => photo.current.click()}
                    className="rounded-full bg-blush/60 px-3 py-1.5 font-semibold text-chocolate"
                  >
                    Ganti Foto
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      ++photoRead.current
                      setReading(false)
                      setValues((v) => ({ ...v, image: '' }))
                      photo.current.value = ''
                    }}
                    className="text-red-700"
                  >
                    Hapus
                  </button>
                </div>
              </div>
              <input
                ref={photo}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                aria-label="Upload foto produk"
                onChange={choosePhoto}
                className="sr-only"
              />
            </div>
            {errors.image && (
              <p role="alert" className="mt-1 text-xs text-red-700">
                {errors.image}
              </p>
            )}
          </div>
          <ProductField
            label="Nama Varian Cookie"
            {...field('name')}
            placeholder="Nama varian cookie"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <ProductField label="Kategori Menu" name="category">
              <select
                id="product-category"
                {...field('category')}
                className={inputClass}
              >
                {productCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </ProductField>
            <ProductField
              label="Harga Satuan (IDR)"
              {...field('price')}
              type="number"
              min="1"
              step="1"
              placeholder="Rp 34.000"
              required
            />
          </div>
          <section className="space-y-4 rounded-2xl bg-canvas p-4">
            <h3 className="text-xs font-bold text-baked">
              STATUS STOK & KAPASITAS DAPUR
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <ProductField
                label="Stok Display Etalase"
                {...field('stokDisplayEtalase')}
                type="number"
                min="0"
                step="1"
              />
              <ProductField
                label="Adonan Dingin (Chiller)"
                {...field('adonanDinginChiller')}
                type="number"
                min="0"
                step="1"
              />
            </div>
            <ProductField
              label="Lokasi Adonan Dingin"
              {...field('adonanDinginLokasi')}
              placeholder="3 Loyang di Chiller B"
            />
            <p className="flex gap-2 text-[11px] leading-5 text-muted">
              <Icon name="note" className="mt-0.5 h-4 w-4 text-baked" />
              Adonan {values.adonanDinginChiller || 0} pcs
              {values.adonanDinginLokasi
                ? ` · ${values.adonanDinginLokasi}`
                : ''}{' '}
              (siap oven). Stok etalase ditampilkan di katalog pelanggan.
            </p>
          </section>
          <div className="grid grid-cols-2 gap-4">
            <ProductField
              label="Suhu Oven Ideal"
              {...field('suhuOvenIdeal')}
              placeholder="175°C"
            />
            <ProductField
              label="Durasi Pemanggangan"
              {...field('durasiPemanggangan')}
              placeholder="12 Menit"
            />
          </div>
          <ProductField
            label="Deskripsi Produk (Website & Menu QR)"
            name="deskripsiProduk"
          >
            <textarea
              id="product-deskripsiProduk"
              {...field('deskripsiProduk')}
              rows="4"
              className={`${inputClass} resize-y rounded-2xl`}
            />
          </ProductField>
          <div className="flex items-center justify-between gap-4 rounded-2xl bg-peach p-4">
            <div>
              <p id="product-live-label" className="text-xs font-bold">
                Tampilkan di Menu Pemesanan
              </p>
              <p className="mt-1 text-[11px] text-muted">
                Pelanggan dapat memesan varian ini secara online.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={values.isLiveOnWebsite}
              aria-labelledby="product-live-label"
              onClick={() =>
                setValues((v) => ({
                  ...v,
                  isLiveOnWebsite: !v.isLiveOnWebsite,
                }))
              }
              className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 ${values.isLiveOnWebsite ? 'bg-baked' : 'bg-muted/40'}`}
            >
              <span
                className={`h-5 w-5 rounded-full bg-white transition-transform motion-reduce:transition-none ${values.isLiveOnWebsite ? 'translate-x-5' : ''}`}
              />
            </button>
          </div>
          {errors.save && (
            <p role="alert" className="text-sm text-red-700">
              {errors.save}
            </p>
          )}
        </div>
        <footer className="flex shrink-0 justify-end gap-6 border-t border-primary/10 bg-peach/70 px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-semibold"
          >
            Batal
          </button>
          <button
            disabled={reading}
            type="submit"
            className="rounded-full bg-baked px-6 py-3 text-sm font-semibold text-white shadow-soft hover:bg-terracotta disabled:opacity-50"
          >
            {reading
              ? 'Membaca foto...'
              : product
                ? 'Simpan Perubahan'
                : 'Tambah Produk'}
          </button>
        </footer>
      </form>
    </motion.aside>
  )
}
