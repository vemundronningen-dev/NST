'use client'

import { useCart } from '@/hooks/useCart'

export function CartBadge() {
  const itemCount = useCart((s) => s.itemCount)
  const count = itemCount()
  if (count === 0) return null
  return (
    <span
      style={{
        position: 'absolute',
        top: '-6px',
        right: '-8px',
        background: 'var(--yellow)',
        color: '#0f0f13',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: '11px',
        lineHeight: 1,
        padding: '3px 6px',
        minWidth: '18px',
        textAlign: 'center',
      }}
    >
      {count}
    </span>
  )
}
