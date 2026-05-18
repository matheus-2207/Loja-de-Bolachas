import { requireAdmin } from '@/lib/admin-auth'
import { AdminLayoutShell } from '@/components/admin-layout-shell'

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  // Protege todas as rotas filhas
  requireAdmin()

  return <AdminLayoutShell>{children}</AdminLayoutShell>
}
