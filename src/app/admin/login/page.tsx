import { signIn } from '@/auth'

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ verify?: string; error?: string }>
}) {
  const params = await searchParams
  const isVerify = params.verify === '1'
  const hasError = !!params.error

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--dark)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      {/* Grid overlay */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage:
            'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          opacity: 0.15,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: '40px' }}>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '28px',
              letterSpacing: '0.08em',
              color: 'var(--yellow)',
              marginBottom: '4px',
            }}
          >
            NST
          </p>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
            }}
          >
            Admin Portal
          </p>
        </div>

        <div
          style={{
            background: 'var(--dark-2)',
            border: '1px solid var(--border)',
            padding: '36px',
          }}
        >
          {isVerify ? (
            /* Verify state */
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '56px',
                  height: '56px',
                  background: 'rgba(245, 197, 24, 0.1)',
                  border: '2px solid var(--yellow)',
                  marginBottom: '24px',
                }}
              >
                <MailIcon />
              </div>
              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '24px',
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                }}
              >
                Kolla din e-post
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.6 }}>
                Vi har skickat en inloggningslänk till din e-postadress. Klicka på länken
                för att logga in i adminpanelen.
              </p>
            </div>
          ) : (
            /* Login form */
            <>
              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '24px',
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                }}
              >
                Logga in
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '32px' }}>
                Ange din e-postadress för att få en inloggningslänk.
              </p>

              {hasError && (
                <div
                  style={{
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    color: '#ef4444',
                    padding: '12px 16px',
                    fontSize: '14px',
                    marginBottom: '20px',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    letterSpacing: '0.02em',
                  }}
                >
                  E-postadressen är inte godkänd för admin-åtkomst.
                </div>
              )}

              <form
                action={async (formData: FormData) => {
                  'use server'
                  await signIn('resend', formData)
                }}
                style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
              >
                <div className="form-group">
                  <label className="form-label" htmlFor="email">
                    E-postadress
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="input"
                    placeholder="din@email.com"
                    required
                    autoComplete="email"
                    autoFocus
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ justifyContent: 'center', marginTop: '8px' }}>
                  Skicka inloggningslänk
                </button>
              </form>
            </>
          )}
        </div>

        <p
          style={{
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '13px',
            marginTop: '24px',
          }}
        >
          Åtkomst kräver ett godkänt administratörskonto.
        </p>
      </div>
    </div>
  )
}

function MailIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#F5C518"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
}
