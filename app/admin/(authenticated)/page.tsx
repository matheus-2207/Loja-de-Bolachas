import { redirect } from 'next/navigation'

export default function AdminRootPage() {
  // Redireciona a raiz do admin para os produtos
  redirect('/admin/produtos')
}
