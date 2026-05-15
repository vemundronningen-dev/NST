import {
  pgTable,
  serial,
  text,
  decimal,
  integer,
  boolean,
  timestamp,
  jsonb,
  primaryKey,
} from 'drizzle-orm/pg-core'

// ── Business tables ────────────────────────────────────────────────────────────

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').default(''),
})

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  sku: text('sku').notNull().unique(),
  name: text('name').notNull(),
  shortDescription: text('short_description').notNull().default(''),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  categoryId: integer('category_id').references(() => categories.id),
  specs: jsonb('specs')
    .$type<{
      openingMm?: number
      widthMm?: number
      capacityKg?: number
      weightKg?: number
      maxPressureBar?: number
      hydraulicConnection?: string
    }>()
    .default({}),
  compatibleMachines: text('compatible_machines').array().default([]),
  inStock: boolean('in_stock').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
})

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  status: text('status', {
    enum: ['pending', 'processing', 'shipped', 'completed', 'cancelled'],
  })
    .notNull()
    .default('pending'),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => orders.id),
  productId: integer('product_id').references(() => products.id),
  quantity: integer('quantity').notNull(),
  priceAtOrder: decimal('price_at_order', { precision: 10, scale: 2 }).notNull(),
})

export const admins = pgTable('admins', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
})

// ── NextAuth tables ────────────────────────────────────────────────────────────

export const users = pgTable('user', {
  id: text('id').notNull().primaryKey(),
  name: text('name'),
  email: text('email').notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
})

export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
)

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').notNull().primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
})

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
)
