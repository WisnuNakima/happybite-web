import { useState } from 'react'
import { useNotifications } from '../context/notificationsContext'
import Icon from './Icon'
import NotificationPanel from './NotificationPanel'

export default function NotificationButton() {
  const [open, setOpen] = useState(false)
  const { unreadCount } = useNotifications()

  return (
    <>
      <button
        type="button"
        aria-label={`Notifikasi, ${unreadCount} belum dibaca`}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={open ? 'notifications-panel' : undefined}
        onClick={() => setOpen(true)}
        className="relative rounded-full p-2.5 hover:bg-peach"
      >
        <Icon name="bell" className="h-[18px] w-[18px]" />
        {unreadCount > 0 && (
          <span
            aria-hidden="true"
            className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-baked px-1 text-[9px] font-bold text-white"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
      {open && <NotificationPanel onClose={() => setOpen(false)} />}
    </>
  )
}
