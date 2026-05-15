import { Resend } from 'resend'
import type { Order, OrderItem } from '@/types'

const resend = new Resend(process.env.RESEND_API_KEY)

function formatPrice(price: string | number) {
  return Number(price).toLocaleString('nb-NO') + ' SEK'
}

export async function sendOrderConfirmation(order: Order, items: OrderItem[]) {
  const itemRows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #2a2a38;color:#e0e0e0">
          ${item.product?.name ?? `Produkt #${item.productId}`}
        </td>
        <td style="padding:8px 0;border-bottom:1px solid #2a2a38;color:#e0e0e0;text-align:center">${item.quantity}</td>
        <td style="padding:8px 0;border-bottom:1px solid #2a2a38;color:#F5C518;text-align:right">${formatPrice(item.priceAtOrder)}</td>
      </tr>`,
    )
    .join('')

  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? 'NST <noreply@nst.se>',
    to: order.customerEmail,
    subject: `Orderbekräftelse #${order.id} — NST`,
    html: `
      <div style="background:#0f0f13;color:#e0e0e0;font-family:sans-serif;padding:40px;max-width:600px;margin:0 auto">
        <h1 style="color:#F5C518;font-size:28px;margin-bottom:8px">Tack för din beställning!</h1>
        <p style="color:#6b6b80;margin-bottom:32px">Order #${order.id}</p>

        <table style="width:100%;border-collapse:collapse">
          <thead>
            <tr>
              <th style="text-align:left;padding-bottom:8px;border-bottom:1px solid #2a2a38;color:#6b6b80;font-weight:500">Produkt</th>
              <th style="text-align:center;padding-bottom:8px;border-bottom:1px solid #2a2a38;color:#6b6b80;font-weight:500">Antal</th>
              <th style="text-align:right;padding-bottom:8px;border-bottom:1px solid #2a2a38;color:#6b6b80;font-weight:500">Pris</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>

        <div style="margin-top:24px;text-align:right">
          <span style="color:#6b6b80">Totalt: </span>
          <span style="color:#F5C518;font-size:20px;font-weight:700">${formatPrice(order.total)}</span>
        </div>

        <hr style="border:none;border-top:1px solid #2a2a38;margin:32px 0" />
        <p style="color:#6b6b80;font-size:14px">
          Vi kontaktar dig när din order är redo för leverans.
          <br />— NST Nordic Surface Technology
        </p>
      </div>
    `,
  })
}
