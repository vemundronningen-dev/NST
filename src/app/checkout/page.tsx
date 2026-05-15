'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { useCart } from '@/hooks/useCart'
import { createOrder } from '@/lib/actions'

function formatPrice(price: number) {
  return price.toLocaleString('nb-NO') + ' SEK'
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (items.length === 0) return
    setLoading(true)
    setError('')

    try {
      const order = await createOrder({
        customerName: name,
        customerEmail: email,
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
          priceAtOrder: i.product.price,
        })),
      })
      clearCart()
      router.push(`/order-confirmed?id=${order.id}`)
    } catch {
      setError('Något gick fel. Försök igen.')
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="container" style={{ paddingTop: '80px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
            Din varukorg är tom.
          </p>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '40px',
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            marginBottom: '40px',
          }}
        >
          Kassa
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '40px' }}>
          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div
              style={{
                background: 'var(--dark-2)',
                border: '1px solid var(--border)',
                padding: '32px',
                marginBottom: '24px',
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '18px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  marginBottom: '24px',
                  color: 'var(--text-muted)',
                }}
              >
                Kontaktuppgifter
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Namn</label>
                  <input
                    className="input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="För- och efternamn"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">E-post</label>
                  <input
                    className="input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="din@email.com"
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <p style={{ color: '#ef4444', marginBottom: '16px', fontSize: '14px' }}>{error}</p>
            )}

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Skickar...' : 'Bekräfta beställning'}
            </button>
          </form>

          {/* Order summary */}
          <div
            style={{
              background: 'var(--dark-2)',
              border: '1px solid var(--border)',
              padding: '28px',
              alignSelf: 'start',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '18px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              Din order
            </h2>

            {items.map(({ product, quantity }) => (
              <div
                key={product.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: '1px solid var(--border)',
                  fontSize: '14px',
                }}
              >
                <span style={{ color: 'var(--text-muted)' }}>
                  {product.name} × {quantity}
                </span>
                <span className="price">
                  {formatPrice(Number(product.price) * quantity)}
                </span>
              </div>
            ))}

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '16px',
              }}
            >
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>Totalt</span>
              <span className="price" style={{ fontSize: '22px' }}>
                {formatPrice(total())}
              </span>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
