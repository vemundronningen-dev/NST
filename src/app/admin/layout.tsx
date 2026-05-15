import { redirect } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/auth'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user) {
    redirect('/admin/login')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--dark)' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '240px',
          flexShrink: 0,
          background: 'var(--dark-2)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Brand */}
        <div
          style={{
            padding: '24px 20px',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <Link href="/" style={{ display: 'block' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '20px',
                letterSpacing: '0.08em',
                color: 'var(--yellow)',
              }}
            >
              NST
            </span>
          </Link>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginTop: '4px',
            }}
          >
            Admin
          </p>
        </div>

        {/* Nav */}
        <nav style={{ padding: '16px 12px', flex: 1 }}>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              padding: '8px',
              marginBottom: '4px',
            }}
          >
            Hantera
          </p>

          <NavLink href="/admin/orders" label="Ordrar" icon={<OrdersIcon />} />
          <NavLink href="/admin/products" label="Produkter" icon={<ProductsIcon />} />
        </nav>

        {/* User */}
        <div
          style={{
            padding: '16px 20px',
            borderTop: '1px solid var(--border)',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.04em',
              color: 'var(--text-muted)',
              marginBottom: '2px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {session.user.email}
          </p>
          <form
            action={async () => {
              'use server'
              const { signOut } = await import('@/auth')
              await signOut({ redirectTo: '/admin/login' })
            }}
          >
            <button
              type="submit"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-display)',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                padding: 0,
                marginTop: '4px',
                transition: 'color 0.15s',
              }}
            >
              Logga ut
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>{children}</main>
      </div>
    </div>
  )
}

function NavLink({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 12px',
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        fontSize: '14px',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        transition: 'color 0.15s, background 0.15s',
        borderRadius: '2px',
        marginBottom: '2px',
      }}
    >
      {icon}
      {label}
    </Link>
  )
}

function OrdersIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
}

function ProductsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  )
}
