import AdminLoginForm from './components/AdminLoginForm'

export default function AdminLogin() {
  return (
    <main className="min-h-dvh bg-cream p-6 text-chocolate">
      <div className="mx-auto max-w-sm">
        <h1 className="mb-6 text-2xl font-bold">Login Admin</h1>
        <p className="mb-5 text-sm leading-6 text-muted">
          Akses khusus pengelola dapur HappyBite. Masuk di sini untuk membuka
          dashboard dan Manajemen Produk.
        </p>
        <AdminLoginForm />
      </div>
    </main>
  )
}
