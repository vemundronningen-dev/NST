'use server'

import { db } from '@/db'
import { products, categories, orders, orderItems } from '@/db/schema'
import { eq, ilike, and } from 'drizzle-orm'
import type { Product, Category, Order, OrderItem, CreateOrderInput, OrderStatus } from '@/types'
import { sendOrderConfirmation } from './email'

// ── Categories ─────────────────────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  const rows = await db.select().from(categories).orderBy(categories.name)
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    description: r.description ?? null,
  }))
}

// ── Products ───────────────────────────────────────────────────────────────────

export async function getProducts(opts?: {
  categoryId?: number
  search?: string
}): Promise<Product[]> {
  const conditions = []

  if (opts?.categoryId) {
    conditions.push(eq(products.categoryId, opts.categoryId))
  }
  if (opts?.search) {
    conditions.push(ilike(products.name, `%${opts.search}%`))
  }

  const rows = await db
    .select({
      product: products,
      category: categories,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(products.name)

  return rows.map(({ product: p, category: c }) => ({
    id: p.id,
    sku: p.sku,
    name: p.name,
    shortDescription: p.shortDescription,
    price: p.price,
    categoryId: p.categoryId,
    category: c
      ? { id: c.id, name: c.name, slug: c.slug, description: c.description ?? null }
      : undefined,
    specs: (p.specs as Product['specs']) ?? {},
    compatibleMachines: p.compatibleMachines ?? [],
    inStock: p.inStock,
    createdAt: p.createdAt,
  }))
}

export async function getProduct(id: number): Promise<Product | null> {
  const rows = await db
    .select({ product: products, category: categories })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.id, id))
    .limit(1)

  if (rows.length === 0) return null

  const { product: p, category: c } = rows[0]
  return {
    id: p.id,
    sku: p.sku,
    name: p.name,
    shortDescription: p.shortDescription,
    price: p.price,
    categoryId: p.categoryId,
    category: c
      ? { id: c.id, name: c.name, slug: c.slug, description: c.description ?? null }
      : undefined,
    specs: (p.specs as Product['specs']) ?? {},
    compatibleMachines: p.compatibleMachines ?? [],
    inStock: p.inStock,
    createdAt: p.createdAt,
  }
}

export async function updateProductPrice(id: number, price: string): Promise<void> {
  await db.update(products).set({ price }).where(eq(products.id, id))
}

export async function updateProductStock(id: number, inStock: boolean): Promise<void> {
  await db.update(products).set({ inStock }).where(eq(products.id, id))
}

// ── Orders ─────────────────────────────────────────────────────────────────────

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const total = input.items
    .reduce((sum, item) => sum + Number(item.priceAtOrder) * item.quantity, 0)
    .toFixed(2)

  const [order] = await db
    .insert(orders)
    .values({
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      total,
      status: 'pending',
    })
    .returning()

  await db.insert(orderItems).values(
    input.items.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      priceAtOrder: item.priceAtOrder,
    })),
  )

  const fullOrder: Order = {
    id: order.id,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    status: order.status as OrderStatus,
    total: order.total,
    createdAt: order.createdAt,
  }

  try {
    const itemsWithProducts = await getOrderItems(order.id)
    await sendOrderConfirmation(fullOrder, itemsWithProducts)
  } catch {
    // Email failure should not block order creation
  }

  return fullOrder
}

export async function getOrders(): Promise<Order[]> {
  const rows = await db
    .select()
    .from(orders)
    .orderBy(orders.createdAt)

  return rows.map((r) => ({
    id: r.id,
    customerName: r.customerName,
    customerEmail: r.customerEmail,
    status: r.status as OrderStatus,
    total: r.total,
    createdAt: r.createdAt,
  }))
}

export async function getOrdersWithItems(): Promise<Order[]> {
  const allOrders = await getOrders()
  return Promise.all(
    allOrders.map(async (order) => ({
      ...order,
      items: await getOrderItems(order.id),
    })),
  )
}

async function getOrderItems(orderId: number): Promise<OrderItem[]> {
  const rows = await db
    .select({ item: orderItems, product: products })
    .from(orderItems)
    .leftJoin(products, eq(orderItems.productId, products.id))
    .where(eq(orderItems.orderId, orderId))

  return rows.map(({ item, product: p }) => ({
    id: item.id,
    orderId: item.orderId,
    productId: item.productId,
    quantity: item.quantity,
    priceAtOrder: item.priceAtOrder,
    product: p
      ? {
          id: p.id,
          sku: p.sku,
          name: p.name,
          shortDescription: p.shortDescription,
          price: p.price,
          categoryId: p.categoryId,
          specs: (p.specs as Product['specs']) ?? {},
          compatibleMachines: p.compatibleMachines ?? [],
          inStock: p.inStock,
          createdAt: p.createdAt,
        }
      : undefined,
  }))
}

export async function updateOrderStatus(id: number, status: OrderStatus): Promise<void> {
  await db.update(orders).set({ status }).where(eq(orders.id, id))
}
