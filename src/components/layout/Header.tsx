import Link from 'next/link'
import { CartBadge } from './CartBadge'

export function Header() {
  return (
    <header
      style={{
        background: 'var(--dark-2)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '22px',
              letterSpacing: '0.08em',
              color: 'var(--yellow)',
            }}
          >
            NST
          </span>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 500,
              fontSize: '13px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              borderLeft: '1px solid var(--border)',
              paddingLeft: '10px',
            }}
          >
            Nordic Surface Technology
          </span>
        </Link>

        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link href="/" className="nav-link">
            Hem
          </Link>
          <Link href="/catalog" className="nav-link">
            Katalog
          </Link>
          <Link
            href="/cart"
            style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '6px' }}
            className="nav-link"
          >
            <CartIcon />
            Varukorg
            <CartBadge />
          </Link>
        </nav>
      </div>

      <style>{`
        .nav-link {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 14px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--text-muted);
          transition: color 0.15s;
        }
        .nav-link:hover {
          color: var(--text);
        }
      `}</style>
    </header>
  )
}

function CartIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  )
}
