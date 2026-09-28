export default function CartGiftMessage({
  enabled,
  message,
  onToggle,
  onMessage,
}) {
  return (
    <section className="mt-6 rounded-[30px] bg-white p-5 shadow-soft sm:p-6">
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(event) => onToggle(event.target.checked)}
          className="mt-1 h-5 w-5 shrink-0 accent-baked"
        />
        <span>
          <span className="block text-lg font-semibold">
            Tulis Kartu Ucapan / Pesan Khusus
          </span>
          <span className="mt-1 block text-sm leading-6 text-muted">
            Beri kejutan manis untuk teman atau keluarga tersayang. Disertai
            pita satin HappyBite secara gratis!
          </span>
        </span>
      </label>
      {enabled && (
        <div className="mt-4 rounded-xl bg-canvas p-4">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs">
            <label htmlFor="gift-message" className="font-semibold">
              Pesan Kartu Ucapan:
            </label>
            <span id="gift-limit" className="text-muted">
              {message.length}/150 · Maks. 150 karakter
            </span>
          </div>
          <textarea
            id="gift-message"
            value={message}
            onChange={(event) => onMessage(event.target.value.slice(0, 150))}
            maxLength={150}
            aria-describedby="gift-limit"
            rows={4}
            placeholder="Tulis pesan manismu di sini..."
            className="w-full resize-y rounded-xl border border-primary/20 bg-white p-3 text-sm leading-6 outline-none placeholder:text-muted focus:ring-2 focus:ring-terracotta/30"
          />
        </div>
      )}
    </section>
  )
}
