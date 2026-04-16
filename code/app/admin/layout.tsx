import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin · Festa do Milhão',
  description: 'Painel de administração do cardápio',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
