import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { getProduct } from '@/lib/actions'
import { AddToCartButton } from './AddToCartButton'
import type { Product, ProductSpecs } from '@/types'

function formatPrice(price: string) {
  return Number(price).toLocaleString('nb-NO') + ' SEK'
}

const SPEC_LABELS: Record<keyof ProductSpecs, string> = {
  openingMm: 'Öppning',
  widthMm: 'Bredd',
  capacityKg: 'Kapacitet',
  weightKg: 'Vikt',
  maxPressureBar: 'Maxtryck',
  hydraulicConnection: 'Hydraulkoppling',
}

const SPEC_UNITS: Record<keyof ProductSpecs, string> = {
  openingMm: 'mm',
  widthMm: 'mm',
  capacityKg: 'kg',
  weightKg: 'kg',
  maxPressureBar: 'bar',
  hydraulicConnection: '',
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProduct(Number(id))

  if (!product) notFound()

  const specEntries = (Object.keys(SPEC_LABELS) as (keyof ProductSpecs)[]).filter(
    (key) => product.specs[key] !== undefined && product.specs[key] !== null,
  )

  return (
    <>
      <Header />
      <main className="container" style={{ paddingTop: '32px', paddingBottom: '80px' }}>
        {/* Breadcrumb */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '40px',
            fontFamily: 'var(--font-display)',
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}
        >
          <Link href="/" style={{ color: 'var(--text-muted)', transition: 'color 0.15s' }}>
            Hem
          </Link>
          <span aria-hidden>›</span>
          <Link href="/catalog" style={{ color: 'var(--text-muted)', transition: 'color 0.15s' }}>
            Katalog
          </Link>
          <span aria-hidden>›</span>
          <span style={{ color: 'var(--text)' }}>{product.name}</span>
        </nav>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '48px' }}>
          {/* Left — info */}
          <div>
            {/* Category + stock */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
              {product.category && (
                <Link href={`/catalog?category=${product.category.id}`}>
                  <span className="badge badge-yellow">{product.category.name}</span>
                </Link>
              )}
              <span className={`badge ${product.inStock ? 'badge-green' : 'badge-red'}`}>
                {product.inStock ? 'I lager' : 'Slutsåld'}
              </span>
            </div>

            {/* SKU */}
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                marginBottom: '10px',
              }}
            >
              SKU: {product.sku}
            </p>

            {/* Name */}
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 'clamp(32px, 4vw, 52px)',
                lineHeight: 1.05,
                letterSpacing: '0.01em',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              {product.name}
            </h1>

            {/* Short description */}
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '16px',
                lineHeight: 1.7,
                marginBottom: '32px',
                maxWidth: '560px',
              }}
            >
              {product.shortDescription}
            </p>

            {/* Specs */}
            {specEntries.length > 0 && (
              <div style={{ marginBottom: '40px' }}>
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '16px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    marginBottom: '16px',
                  }}
                >
                  Specifikationer
                </h2>
                <div
                  style={{
                    background: 'var(--dark-2)',
                    border: '1px solid var(--border)',
                  }}
                >
                  {specEntries.map((key, idx) => (
                    <div
                      key={key}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '12px 20px',
                        borderBottom:
                          idx < specEntries.length - 1 ? '1px solid var(--border)' : 'none',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontWeight: 500,
                          fontSize: '14px',
                          letterSpacing: '0.04em',
                          color: 'var(--text-muted)',
                        }}
                      >
                        {SPEC_LABELS[key]}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontWeight: 700,
                          fontSize: '14px',
                        }}
                      >
                        {product.specs[key]}
                        {SPEC_UNITS[key] ? ` ${SPEC_UNITS[key]}` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Compatible machines */}
            {product.compatibleMachines.length > 0 && (
              <div>
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '16px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    marginBottom: '12px',
                  }}
                >
                  Kompatibla maskiner
                </h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {product.compatibleMachines.map((machine) => (
                    <span key={machine} className="machine-tag">
                      {machine}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — purchase panel */}
          <div>
            <div
              style={{
                background: 'var(--dark-2)',
                border: '1px solid var(--border)',
                padding: '32px',
                position: 'sticky',
                top: '84px',
              }}
            >
              {/* Price */}
              <div style={{ marginBottom: '28px' }}>
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    marginBottom: '8px',
                  }}
                >
                  Pris per enhet
                </p>
                <p
                  className="price"
                  style={{ fontSize: '40px', lineHeight: 1 }}
                >
                  {formatPrice(product.price)}
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '6px' }}>
                  Exkl. moms och frakt
                </p>
              </div>

              <hr className="divider" style={{ margin: '0 0 24px' }} />

              {/* Add to cart */}
              <AddToCartButton product={product} />

              <hr className="divider" style={{ margin: '24px 0' }} />

              {/* Quick specs in sidebar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <InfoRow icon="✓" text="OEM-certifierad kvalitet" />
                <InfoRow icon="✓" text="24h leverans från lager" />
                <InfoRow icon="✓" text="Teknisk support ingår" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

function InfoRow({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <span style={{ color: 'var(--yellow)', fontWeight: 700, fontSize: '14px' }}>{icon}</span>
      <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{text}</span>
    </div>
  )
}
