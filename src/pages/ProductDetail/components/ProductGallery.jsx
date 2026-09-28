import ImageZoom from './ImageZoom'
import { useState } from 'react'
import Icon from '@/components/Icon'

export default function ProductGallery({ product }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [wished, setWished] = useState(false)
  const [zoomOpen, setZoomOpen] = useState(false)
  return (
    <div className="min-w-0">
      <div className="relative overflow-hidden rounded-[30px] bg-white shadow-soft">
        <img
          src={product.galleryImages[selectedImage]}
          alt={`${product.name} — foto ${selectedImage + 1}`}
          width="800"
          height="800"
          className="aspect-square w-full object-cover"
        />
        <div className="pointer-events-none absolute left-4 top-4 flex max-w-[65%] flex-col items-start gap-2 sm:left-6 sm:top-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-baked px-3 py-1.5 text-[10px] font-bold text-white sm:text-xs">
            <Icon name="cookie" className="h-3.5 w-3.5" />
            {product.detailBadge}
          </span>
          <span className="rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold text-baked sm:text-xs">
            {product.batchNote}
          </span>
        </div>
        <div className="absolute right-3 top-4 flex flex-col gap-2 sm:right-5">
          <button
            type="button"
            onClick={() => setWished(!wished)}
            aria-pressed={wished}
            aria-label={wished ? 'Hapus dari wishlist' : 'Simpan ke wishlist'}
            className="rounded-full bg-white/95 p-3 text-baked shadow-soft"
          >
            <Icon
              name="heart"
              className={`h-5 w-5 ${wished ? 'fill-current' : ''}`}
            />
          </button>
          <button
            type="button"
            onClick={() => setZoomOpen(true)}
            aria-label="Perbesar foto produk"
            className="rounded-full bg-white/95 p-3 shadow-soft"
          >
            <Icon name="zoom" />
          </button>
        </div>
      </div>
      <div
        role="group"
        aria-label="Galeri foto produk"
        className="mt-4 grid grid-cols-4 gap-2 sm:gap-3"
      >
        {product.galleryImages.map((src, index) => (
          <button
            key={`${src}-${index}`}
            type="button"
            onClick={() => setSelectedImage(index)}
            aria-label={`Lihat foto ${index + 1}`}
            aria-pressed={selectedImage === index}
            className={`overflow-hidden rounded-xl border-2 bg-white p-1 ${selectedImage === index ? 'border-baked' : 'border-transparent hover:border-primary'}`}
          >
            <img
              src={src}
              alt=""
              width="160"
              height="160"
              loading="lazy"
              className="aspect-square w-full rounded-lg object-cover"
            />
          </button>
        ))}
      </div>
      {zoomOpen && (
        <ImageZoom
          src={product.galleryImages[selectedImage]}
          name={product.name}
          onClose={() => setZoomOpen(false)}
        />
      )}
    </div>
  )
}
