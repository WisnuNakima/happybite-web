import { Reveal } from './Animation'

export default function AboutSection() {
  return (
    <Reveal id="tentang" className="scroll-mt-36">
      <div className="mx-auto grid max-w-[1320px] items-center gap-10 px-5 py-12 lg:grid-cols-[.85fr_1.22fr] lg:px-8">
        <div className="relative mx-auto w-full max-w-xl">
          <img
            src="/images/about-bakery.jpg"
            alt="Cookie handmade dari dapur HappyBite"
            width="800"
            height="800"
            loading="lazy"
            className="aspect-square w-full rounded-[40px] object-cover shadow-warm"
          />
          <span className="absolute -bottom-4 left-1/2 w-[75%] -translate-x-1/2 rounded-full bg-white px-4 py-2.5 text-[10px] font-semibold shadow-soft sm:text-xs">
            ✨ Dimulai dari resep keluarga sejak 2021 di dapur mungil kami.
          </span>
        </div>
        <div>
          <p className="mb-2 text-[11px] font-extrabold uppercase tracking-wider text-baked">
            Tentang HappyBite
          </p>
          <h2 className="text-2xl font-semibold leading-snug tracking-[-.7px] sm:text-[31px]">
            Dari Hobi Akhir Pekan Menjadi Gigitan Favorit Ribuan Pencinta Cookie
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted sm:text-base">
            Kami percaya bahwa sebuah cookie bukan sekadar camilan manis,
            melainkan momen istirahat kecil di tengah hiruk-pikuk hari. Itulah
            mengapa kami tak pernah berkompromi dengan resep: setiap adonan
            diistirahatkan 48 jam untuk cita rasa karamel yang mendalam.
          </p>
        </div>
      </div>
    </Reveal>
  )
}
