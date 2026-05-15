'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/useCart'
import type { Product } from '@/types'

export function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const router = useRouter()

  function handleAdd() {
    if (!product.inStock) return
    addItem(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Qty selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <label
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}
        >
          Antal
        </label>
        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)' }}>
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            style={{
              width: '36px',
              height: '36px',
              background: 'var(--dark-3)',
              border: 'none',
              color: 'var(--text)',
              fontSize: '18px',
              cursor: 'pointer',
            }}
          >
            −
          </button>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '16px',
              minWidth: '40px',
              textAlign: 'center',
              padding: '0 4px',
            }}
          >
            {qty}
          </span>
          <button
            onClick={() => setQty((q) => q + 1)}
            style={{
              width: '36px',
              height: '36px',
              background: 'var(--dark-3)',
              border: 'none',
              color: 'var(--text)',
              fontSize: '18px',
              cursor: 'pointer',
            }}
          >
            +
          </button>
        </div>
      </div>

      {/* Add button */}
      <button
        onClick={handleAdd}
        disabled={!product.inStock}
        className="btn-primary"
        style={{ justifyContent: 'center', width: '100%', padding: '14px' }}
      >
        {added ? '✓ Tillagd i varukorg' : product.inStock ? 'Lägg i varukorg' : 'Slutsåld'}
      </button>

      {/* Go to cart */}
      {added && (
        <button
          onClick={() => router.push('/cart')}
          className="btn-secondary"
          style={{ justifyContent: 'center', width: '100%', padding: '12px' }}
        >
          Gå till varukorg →
        </button>
      )}
    </div>
  )
}
