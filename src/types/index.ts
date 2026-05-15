export type Category = {
  id: number
  name: string
  slug: string
  description: string | null
}

export type ProductSpecs = {
  openingMm?: number
  widthMm?: number
  capacityKg?: number
  weightKg?: number
  maxPressureBar?: number
  hydraulicConnection?: string
}

export type Product = {
  id: number
  sku: string
  name: string
  shortDescription: string
  price: string
  categoryId: number | null
  category?: Category
  specs: ProductSpecs
  compatibleMachines: string[]
  inStock: boolean
  createdAt: Date | null
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled'

export type Order = {
  id: number
  customerName: string
  customerEmail: string
  status: OrderStatus
  total: string
  createdAt: Date | null
  items?: OrderItem[]
}

export type OrderItem = {
  id: number
  orderId: number | null
  productId: number | null
  product?: Product
  quantity: number
  priceAtOrder: string
}

export type CartItem = {
  product: Product
  quantity: number
}

export type CreateOrderInput = {
  customerName: string
  customerEmail: string
  items: { productId: number; quantity: number; priceAtOrder: string }[]
}
