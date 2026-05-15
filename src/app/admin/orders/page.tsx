import { getOrders, updateOrderStatus } from '@/lib/actions'
import type { Order, OrderStatus } from '@/types'

function formatPrice(price: string) {
  return Number(price).toLocaleString('nb-NO') + ' SEK'
}

function formatDate(date: Date | null) {
  if (!date) return '—'
  return new Intl.DateTimeFormat('sv-SE', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(date))
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Väntar',
  processing: 'Behandlas',
  shipped: 'Skickad',
  completed: 'Klar',
  cancelled: 'Avbruten',
}

const STATUS_BADGE: Record<OrderStatus, string> = {
  pending: 'badge',
  processing: 'badge badge-yellow',
  shipped: 'badge badge-green',
  completed: 'badge badge-green',
  cancelled: 'badge badge-red',
}

export default async function AdminOrdersPage() {
  const orders = await getOrders()

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
          Ordrar
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
          {orders.length} ordrar totalt
        </p>
      </div>

      <div style={{ background: 'var(--dark-2)', border: '1px solid var(--border)' }}>
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Kund</th>
              <th>E-post</th>
              <th>Totalt</th>
              <th>Datum</th>
              <th>Status</th>
              <th>Åtgärd</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
                  Inga ordrar ännu.
                </td>
              </tr>
            )}
            {orders.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function OrderRow({ order }: { order: Order }) {
  async function changeStatus(formData: FormData) {
    'use server'
    const status = formData.get('status') as OrderStatus
    await updateOrderStatus(order.id, status)
  }

  const statuses: OrderStatus[] = ['pending', 'processing', 'shipped', 'completed', 'cancelled']

  return (
    <tr>
      <td style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--yellow)' }}>
        #{order.id}
      </td>
      <td>{order.customerName}</td>
      <td style={{ color: 'var(--text-muted)' }}>{order.customerEmail}</td>
      <td className="price">{formatPrice(order.total)}</td>
      <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
        {formatDate(order.createdAt)}
      </td>
      <td>
        <span className={STATUS_BADGE[order.status]}>{STATUS_LABELS[order.status]}</span>
      </td>
      <td>
        <form action={changeStatus} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select
            name="status"
            defaultValue={order.status}
            className="input"
            style={{ width: 'auto', padding: '6px 10px', fontSize: '13px' }}
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="btn-secondary"
            style={{ padding: '6px 14px', fontSize: '12px' }}
          >
            Spara
          </button>
        </form>
      </td>
    </tr>
  )
}
