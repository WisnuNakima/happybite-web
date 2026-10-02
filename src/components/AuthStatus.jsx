import { useAuth } from '@/context/authContext'

export default function AuthStatus() {
  const { loading, authError, retryAuth } = useAuth()
  return (
    <div
      role={loading ? 'status' : 'alert'}
      className="p-6 text-center text-sm text-muted"
    >
      {loading ? 'Memuat sesi...' : authError}
      {!loading && authError && (
        <button
          type="button"
          onClick={retryAuth}
          className="ml-3 font-semibold text-baked"
        >
          Coba lagi
        </button>
      )}
    </div>
  )
}
