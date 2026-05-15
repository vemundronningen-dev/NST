import Link from 'next/link'
import { Header } from '@/components/layout/Header'

export default async function OrderConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const { id } = await searchParams

  return (
    <>
      <Header />
      <main
        className="container"
        style={{ paddingTop: '80px', paddingBottom: '80px', textAlign: 'center' }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '72px',
            height: '72px',
            background: 'rgba(245, 197, 24, 0.1)',
            border: '2px solid var(--yellow)',
            marginBottom: '32px',
          }}
        >
          <CheckIcon />
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '48px',
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            color: 'var(--yellow)',
            marginBottom: '16px',
          }}
        >
          Order bekräftad
        </h1>

        {id && (
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '16px',
              color: 'var(--text-muted)',
              marginBottom: '8px',
              letterSpacing: '0.06em',
            }}
          >
            ORDER #{id}
          </p>
        )}

        <p style={{ color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 40px' }}>
          Tack för din beställning! En orderbekräftelse har skickats till din e-post.
          Vi kontaktar dig när din order är redo för leverans.
        </p>

        <Link href="/catalog" className="btn-primary">
          Fortsätt handla
        </Link>
      </main>
    </>
  )
}

function CheckIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#F5C518"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
