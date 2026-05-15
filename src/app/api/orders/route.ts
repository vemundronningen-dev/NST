import { NextRequest, NextResponse } from 'next/server'
import { getOrdersWithItems } from '@/lib/actions'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const expected = `Bearer ${process.env.AUTH_SECRET}`

  if (!authHeader || authHeader !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const orders = await getOrdersWithItems()
    return NextResponse.json({ orders })
  } catch (err) {
    console.error('[api/orders]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
