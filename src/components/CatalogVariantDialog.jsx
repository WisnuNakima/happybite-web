import { useEffect, useRef, useState } from 'react'
import Icon from './Icon'

export default function CatalogVariantDialog({ product, onClose, onAdd }) {
  const dialog = useRef(null)
  const [variant, setVariant] = useState(product.variants[0])

  useEffect(() => {
    const element = dialog.current
    const previousFocus = document.activeElement
    element.showModal()
    document.body.classList.add('overflow-hidden')
    return () => {
      element.close()
      document.body.classList.remove('overflow-hidden')
      previousFocus?.focus()
    }
  }, [])

  return (
    <dialog
      ref={dialog}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      aria-labelledby="variant-title"
      className="m-auto max-h-[85dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-[30px] bg-canvas p-6 text-chocolate shadow-warm backdrop:bg-chocolate/45 backdrop:backdrop-blur-sm sm:p-8"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <h2 id="variant-title" className="text-xl font-bold">
          {product.name}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup pilihan varian"
          className="rounded-full bg-peach p-2"
        >
          <Icon name="close" />
        </button>
      </div>
      <img
        src={product.image}
        alt=""
        className="mb-5 aspect-[2] w-full rounded-2xl object-cover"
      />
      <fieldset>
        <legend className="mb-3 text-sm font-bold">
          Pilih kombinasi cookie favoritmu
        </legend>
        <div className="space-y-2">
          {product.variants.map((option) => (
            <label
              key={option}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm ${variant === option ? 'border-terracotta bg-peach' : 'border-primary/30 bg-white'}`}
            >
              <input
                type="radio"
                name="cookie-variant"
                value={option}
                checked={variant === option}
                onChange={(event) => setVariant(event.target.value)}
                className="accent-terracotta"
              />
              {option}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="mt-6 flex items-center justify-between gap-3">
        <p className="text-lg font-bold text-baked">
          Rp {product.price.toLocaleString('id-ID')}
        </p>
        <button
          type="button"
          onClick={() => onAdd(product, variant)}
          className="inline-flex items-center gap-2 rounded-full bg-terracotta px-5 py-3 text-sm font-bold text-white hover:bg-baked"
        >
          <Icon name="cart" className="h-4 w-4" />
          Tambah ke Keranjang
        </button>
      </div>
    </dialog>
  )
}
