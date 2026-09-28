const paths = {
  bell: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4M12 2V1" />
    </>
  ),
  warm: (
    <path d="M5 15h14a7 7 0 0 1-14 0ZM7 11c-3-3 3-4 0-7M12 11c-3-3 3-4 0-7M17 11c-3-3 3-4 0-7" />
  ),
  gift: (
    <>
      <path d="M3 8h18v5H3zM5 13v8h14v-8M12 8v13" />
      <path d="M12 8C2 8 5 0 9 3l3 5Zm0 0c10 0 7-8 3-5l-3 5Z" />
    </>
  ),
  headset: (
    <>
      <path d="M4 14v-3a8 8 0 0 1 16 0v3M4 12H2v7h4v-7ZM20 12h2v7h-4v-7ZM20 19v3h-8" />
    </>
  ),
  upload: (
    <path d="M7 18H5a4 4 0 0 1-1-8 8 8 0 0 1 15-1 4.5 4.5 0 0 1 0 9h-2M12 21V9m-4 4 4-4 4 4" />
  ),
  download: <path d="M12 3v12m-4-4 4 4 4-4M4 16v5h16v-5" />,
  copy: (
    <>
      <rect x="8" y="8" width="12" height="13" rx="2" />
      <path d="M16 8V3H3v14h5" />
    </>
  ),
  qr: (
    <>
      <path d="M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h3v3h3v3h-6zM12 3v3M12 9v3H3M12 15v6M18 12h3" />
    </>
  ),
  note: <path d="M4 5h16M4 9h10M4 13h6m3 6 1-4 6-6 3 3-6 6-4 1Z" />,
  home: <path d="m3 10 9-7 9 7v11h-6v-7H9v7H3Z" />,
  trash: <path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7" />,
  receipt: <path d="M5 3h14v19l-3-2-4 2-4-2-3 2ZM8 7h8M8 11h8M8 15h5" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  zoom: (
    <>
      <circle cx="10" cy="10" r="7" />
      <path d="m15 15 6 6M10 6v8M6 10h8" />
    </>
  ),
  chevronRight: <path d="m9 5 7 7-7 7" />,
  chevronDown: <path d="m5 9 7 7 7-7" />,
  heart: (
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
  ),
  cookie: (
    <>
      <path d="M15 3a4 4 0 0 0 6 5 9 9 0 1 1-6-5Z" />
      <path d="M8 8h.01M7 14h.01M12 11h.01M14 17h.01M17 12h.01" />
    </>
  ),
  back: <path d="M20 12H4m6-6-6 6 6 6" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 6 9 7 9-7" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  eyeOff: (
    <>
      <path d="m3 3 18 18M10.5 5.1 12 5c6.5 0 10 7 10 7a19 19 0 0 1-3 3.8M6.1 6.1A21 21 0 0 0 2 12s3.5 7 10 7c2 0 3.8-.6 5.2-1.5M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </>
  ),
  shield: (
    <>
      <path d="m12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6l8-4Z" />
      <path d="m8 12 3 3 5-6" />
    </>
  ),
  arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 5 5" />
    </>
  ),
  bag: (
    <>
      <path d="M5 7h14l1 14H4L5 7Z" />
      <path d="M9 9V5a3 3 0 0 1 6 0v4" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 21v-2a7 7 0 0 1 14 0v2Z" />
    </>
  ),
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  seal: (
    <>
      <path d="m12 2 3 2 4 .5.5 4 2 3-2 3-.5 4-4 .5-3 2-3-2-4-.5-.5-4-2-3 2-3 .5-4 4-.5Z" />
      <path d="m8 12 3 3 5-6" />
    </>
  ),
  truck: (
    <>
      <path d="M2 5h12v12H2zM14 9h4l4 5v3h-8" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="18" r="2" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10" width="14" height="12" rx="2" />
      <path d="M8 10V6a4 4 0 0 1 8 0v4M12 15v3" />
    </>
  ),
  cart: (
    <>
      <path d="M2 3h3l3 13h11l3-9H6M12 2v8m-3-3 3 3 3-3" />
      <circle cx="9" cy="21" r="1" />
      <circle cx="18" cy="21" r="1" />
    </>
  ),
  money: (
    <>
      <path d="M2 5h20v13H2zM5 21h14" />
      <circle cx="12" cy="11.5" r="3" />
      <path d="M5 8v7m14-7v7" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6v6l4 2M4 2 1 5m19-3 3 3" />
    </>
  ),
  pin: (
    <>
      <path d="M19 9c0 6-7 13-7 13S5 15 5 9a7 7 0 0 1 14 0Z" />
      <circle cx="12" cy="9" r="2" />
    </>
  ),
  chat: (
    <>
      <path d="M21 11a9 9 0 0 1-13 8L3 21l1-5a9 9 0 1 1 17-5Z" />
      <path d="M8 8c0 4 2 6 6 7l2-2-3-2-1 1-2-2 1-1-2-3-1 2Z" />
    </>
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" />
    </>
  ),
  music: <path d="M14 3v13a4 4 0 1 1-4-4M14 3c1 4 3 5 7 5" />,
  sparkles: (
    <path d="m12 2 2.7 7.3L22 12l-7.3 2.7L12 22l-2.7-7.3L2 12l7.3-2.7L12 2ZM20 2v4m-2-2h4" />
  ),
}

export default function Icon({ name, className = 'h-5 w-5' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      {paths[name] || paths.bag}
    </svg>
  )
}
