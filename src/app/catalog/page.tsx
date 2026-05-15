import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { getProducts, getCategories } from '@/lib/actions'
import type { Product } from '@/types'

function formatPrice(price: string) {
  return Number(price).toLocaleString('nb-NO') + ' SEK'
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>
}) {
  const params = await searchParams
  const [allCategories, products] = await Promise.all([
    getCategories(),
    getProducts({
      categoryId: params.category ? Number(params.category) : undefined,
      search: params.search,
    }),
  ])

  return (
    <>
      <Header />
      <main className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '40px',
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}
          >
            Produktkatalog
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            OEM-tillverkade tillbehör för alla grävmaskiner
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '40px', flexWrap: 'wrap' }}>
          <Link
            href="/catalog"
            className={`badge ${!params.category ? 'badge-yellow' : ''}`}
            style={{ padding: '6px 16px', cursor: 'pointer' }}
          >
            Alla
          </Link>
          {allCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/catalog?category=${cat.id}`}
              className={`badge ${params.category === String(cat.id) ? 'badge-yellow' : ''}`}
              style={{ padding: '6px 16px', cursor: 'pointer' }}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Grid */}
        {products.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '80px 0' }}>
            Inga produkter hittades.
          </p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px',
            }}
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </>
  )
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/catalog/${product.id}`} style={{ display: 'block' }}>
      <article className="product-card" style={{ padding: '24px', height: '100%' }}>
        <div style={{ marginBottom: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {product.category && (
            <span className="badge">{product.category.name}</span>
          )}
          <span className={`badge ${product.inStock ? 'badge-green' : 'badge-red'}`}>
            {product.inStock ? 'I lager' : 'Slutsåld'}
          </span>
        </div>

        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            marginBottom: '6px',
          }}
        >
          {product.sku}
        </p>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '20px',
            letterSpacing: '0.02em',
            marginBottom: '8px',
            lineHeight: 1.3,
          }}
        >
          {product.name}
        </h2>

        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '14px',
            marginBottom: '20px',
            flex: 1,
          }}
        >
          {product.shortDescription}
        </p>

        <div
          style={{
            borderTop: '1px solid var(--border)',
            paddingTop: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span className="price" style={{ fontSize: '20px' }}>
            {formatPrice(product.price)}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.04em',
              color: 'var(--yellow)',
              textTransform: 'uppercase',
            }}
          >
            Visa →
          </span>
        </div>
      </article>
    </Link>
  )
}
