import Button from './Button'
import Icon from './Icon'
import { Reveal } from './Animation'

export default function CatalogGateBanner({ onAccount }) {
  return (
    <Reveal
      as="div"
      className="mt-8 flex flex-col items-center gap-5 rounded-[32px] bg-white p-5 sm:flex-row lg:rounded-full lg:p-6"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-peach text-baked">
        <Icon name="lock" />
      </span>
      <p className="flex-1 text-center text-sm leading-6 text-muted sm:text-left lg:text-base">
        Ingin melihat daftar harga lengkap dan memesan? Masuk atau daftar akun
        terlebih dahulu untuk mengakses katalog live HappyBite.
      </p>
      <Button onClick={onAccount} className="shrink-0 text-xs lg:text-sm">
        Masuk untuk Lihat Menu & Pesan <Icon name="arrow" className="h-4 w-4" />
      </Button>
    </Reveal>
  )
}
