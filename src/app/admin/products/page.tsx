import { getProducts, getCategories, updateProductPrice, updateProductStock } from '@/lib/actions'
import type { Product } from '@/types'

function formatPrice(price: string) {
  return Number(price).toLocaleString('nb-NO') + ' SEK'
}

export default async function AdminProductsPage({
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
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '32px',
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
          }}
        >
          Produkter
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
          {products.length} produkter
        </p>
      </div>

      {/* Filters */}
      <form
        method="GET"
        style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}
      >
        <input
          name="search"
          defaultValue={params.search}
          className="input"
          placeholder="Sök produkt..."
          style={{ width: '240px' }}
        />
        <select
          name="category"
          defaultValue={params.category ?? ''}
          className="input"
          style={{ width: '200px' }}
        >
          <option value="">Alla kategorier</option>
          {allCategories.map((cat) => (
            <option key={cat.id} value={String(cat.id)}>
              {cat.name}
            </option>
          ))}
        </select>
        <button type="submit" className="btn-secondary" style={{ padding: '10px 20px' }}>
          Filtrera
        </button>
        {(params.category || params.search) && (
          <a
            href="/admin/products"
            className="btn-secondary"
            style={{ padding: '10px 20px' }}
          >
            Rensa
          </a>
        )}
      </form>

      {/* Table */}
      <div style={{ background: 'var(--dark-2)', border: '1px solid var(--border)' }}>
        <table className="table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Namn</th>
              <th>Kategori</th>
              <th>Pris</th>
              <th>I lager</th>
              <th>Ändra pris</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}
                >
                  Inga produkter hittades.
                </td>
              </tr>
            )}
            {products.map((product) => (
              <ProductRow key={product.id} product={product} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ProductRow({ product }: { product: Product }) {
  async function handleUpdatePrice(formData: FormData) {
    'use server'
    const price = formData.get('price') as string
    if (price && !isNaN(Number(price))) {
      await updateProductPrice(product.id, Number(price).toFixed(2))
    }
  }

  async function handleToggleStock() {
    'use server'
    await updateProductStock(product.id, !product.inStock)
  }

  return (
    <tr>
      {/* SKU */}
      <td>
        <code
          style={{
            fontFamily: 'monospace',
            fontSize: '12px',
            background: 'var(--dark-3)',
            padding: '3px 8px',
            color: 'var(--text-muted)',
            border: '1px solid var(--border)',
          }}
        >
          {product.sku}
        </code>
      </td>

      {/* Name */}
      <td>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: '15px',
          }}
        >
          {product.name}
        </span>
      </td>

      {/* Category */}
      <td>
        {product.category ? (
          <span className="badge">{product.category.name}</span>
        ) : (
          <span style={{ color: 'var(--text-muted)' }}>—</span>
        )}
      </td>

      {/* Price */}
      <td>
        <span className="price">{formatPrice(product.price)}</span>
      </td>

      {/* In stock toggle */}
      <td>
        <form action={handleToggleStock}>
          <button
            type="submit"
            className={`badge ${product.inStock ? 'badge-green' : 'badge-red'}`}
            style={{
              cursor: 'pointer',
              background: 'none',
              border: product.inStock
                ? '1px solid rgba(34,197,94,0.3)'
                : '1px solid rgba(239,68,68,0.3)',
              fontFamily: 'var(--font-display)',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              padding: '4px 10px',
              color: product.inStock ? '#22c55e' : '#ef4444',
            }}
            title="Klicka för att byta lagerstatus"
          >
            {product.inStock ? 'I lager' : 'Slutsåld'}
          </button>
        </form>
      </td>

      {/* Edit price */}
      <td>
        <form
          action={handleUpdatePrice}
          style={{ display: 'flex', gap: '6px', alignItems: 'center' }}
        >
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={Number(product.price).toFixed(2)}
            className="input"
            style={{ width: '110px', padding: '6px 10px', fontSize: '13px' }}
            aria-label={`Nytt pris för ${product.name}`}
          />
          <button
            type="submit"
            className="btn-secondary"
            style={{ padding: '6px 14px', fontSize: '12px', whiteSpace: 'nowrap' }}
          >
            Spara pris
          </button>
        </form>
      </td>
    </tr>
  )
}
