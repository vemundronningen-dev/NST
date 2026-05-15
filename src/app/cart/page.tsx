'use client'

import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { useCart } from '@/hooks/useCart'

function formatPrice(price: number) {
  return price.toLocaleString('nb-NO') + ' SEK'
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCart()

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
          Varukorg
        </h1>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
              Din varukorg är tom.
            </p>
            <Link href="/catalog" className="btn-primary">
              Gå till katalog
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '40px' }}>
            {/* Items */}
            <div>
              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    padding: '20px',
                    background: 'var(--dark-2)',
                    border: '1px solid var(--border)',
                    marginBottom: '12px',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '11px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        marginBottom: '4px',
                      }}
                    >
                      {product.sku}
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        fontSize: '18px',
                      }}
                    >
                      {product.name}
                    </p>
                    <p className="price" style={{ marginTop: '4px' }}>
                      {formatPrice(Number(product.price))}
                    </p>
                  </div>

                  {/* Qty controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      style={{
                        width: '32px',
                        height: '32px',
                        background: 'var(--dark-3)',
                        border: '1px solid var(--border)',
                        color: 'var(--text)',
                        fontSize: '18px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      −
                    </button>
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        fontSize: '16px',
                        minWidth: '24px',
                        textAlign: 'center',
                      }}
                    >
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      style={{
                        width: '32px',
                        height: '32px',
                        background: 'var(--dark-3)',
                        border: '1px solid var(--border)',
                        color: 'var(--text)',
                        fontSize: '18px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      +
                    </button>
                  </div>

                  {/* Line total */}
                  <p
                    className="price"
                    style={{ minWidth: '120px', textAlign: 'right', fontSize: '18px' }}
                  >
                    {formatPrice(Number(product.price) * quantity)}
                  </p>

                  <button
                    onClick={() => removeItem(product.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      fontSize: '20px',
                      lineHeight: 1,
                      padding: '4px',
                    }}
                    aria-label="Ta bort"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
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
                  fontSize: '20px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  marginBottom: '20px',
                }}
              >
                Sammanfattning
              </h2>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 0',
                  borderTop: '1px solid var(--border)',
                }}
              >
                <span style={{ color: 'var(--text-muted)' }}>Totalt</span>
                <span className="price" style={{ fontSize: '24px' }}>
                  {formatPrice(total())}
                </span>
              </div>

              <Link href="/checkout" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}>
                Till kassan
              </Link>
              <Link href="/catalog" className="btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}>
                Fortsätt handla
              </Link>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
