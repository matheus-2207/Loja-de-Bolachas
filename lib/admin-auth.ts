import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export function requireAdmin() {
  const cookieStore = cookies()
  const token = cookieStore.get('admin_logged_in')
  
  if (!token || token.value !== 'true') {
    redirect('/admin/login')
  }
}
