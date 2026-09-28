import { useEffect, useRef } from 'react'
import Icon from '@/components/Icon'

export default function ImageZoom({ src, name, onClose }) {
  const dialog = useRef(null)
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
      aria-label={`Perbesar foto ${name}`}
      className="m-auto w-[calc(100%-2rem)] max-w-4xl rounded-2xl bg-canvas p-4 text-chocolate shadow-warm backdrop:bg-chocolate/60"
    >
      <div className="mb-3 flex items-center justify-between gap-4">
        <p className="font-bold">{name}</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup foto"
          className="rounded-full bg-peach p-3"
        >
          <Icon name="close" />
        </button>
      </div>
      <img
        src={src}
        alt={name}
        className="max-h-[75dvh] w-full rounded-xl object-contain"
      />
    </dialog>
  )
}
