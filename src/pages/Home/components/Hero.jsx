import Button from './Button'
import Icon from '@/components/Icon'
import MotionItem from './MotionItem'
import Stagger from './Stagger'

export default function Hero({ onAccount }) {
  return (
    <Stagger as="section" id="beranda" className="scroll-mt-32">
      <div className="mx-auto grid max-w-[1320px] items-center gap-10 px-5 py-10 lg:grid-cols-[1.35fr_1fr] lg:gap-16 lg:px-8 lg:py-10">
        <div>
          <MotionItem
            as="h1"
            className="max-w-[700px] text-[36px] font-bold leading-[1.28] tracking-[-1.5px] sm:text-[42px] xl:text-[43px]"
          >
            Kebahagiaan Hangat di Setiap Gigitan{' '}
            <span className="text-baked underline decoration-2 underline-offset-[6px]">
              Cookie Lembut
            </span>
          </MotionItem>
          <MotionItem
            as="p"
            className="mt-4 max-w-xl text-[15px] leading-7 text-muted sm:text-lg sm:leading-8"
          >
            Cookie artisan bergaya New York tebal, renyah di luar dengan lelehan
            cokelat melimpah di dalam. Dibuat tangan dari dapur rumahan dengan
            cinta dan mentega butter murni Prancis.
          </MotionItem>
          <MotionItem as="div" className="mt-6">
            <Button onClick={onAccount}>
              <Icon name="sparkles" className="h-4 w-4 text-golden" />
              Masuk & Pesan Sekarang <Icon name="arrow" className="h-4 w-4" />
            </Button>
          </MotionItem>
        </div>
        <MotionItem as="div" fromRight className="mx-auto w-full max-w-xl">
          <img
            src="/images/hero-cookies.jpg"
            alt="Cookie cokelat artisan yang baru dipanggang"
            fetchPriority="high"
            width="1200"
            height="1000"
            className="aspect-[1.3] w-full rounded-[40px] object-cover shadow-warm"
          />
        </MotionItem>
      </div>
    </Stagger>
  )
}
