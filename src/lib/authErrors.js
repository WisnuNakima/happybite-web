export function loginErrorMessage(error) {
  if (error?.code === 'email_not_confirmed') return 'Email belum dikonfirmasi.'
  if (error?.code === 'invalid_credentials')
    return 'Email atau kata sandi salah.'
  return 'Terjadi kesalahan, coba lagi.'
}

export function registerErrorMessage(error) {
  if (['user_already_exists', 'email_exists'].includes(error?.code))
    return 'Email sudah terdaftar.'
  return 'Terjadi kesalahan, coba lagi.'
}
