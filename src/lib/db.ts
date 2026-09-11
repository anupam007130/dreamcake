import { dbGet, dbSet, dbUpdate, dbRemove, dbPush } from '@/lib/firebase'
import bcrypt from 'bcryptjs'

// ============ USERS ============
export async function createUser(data: { fullName: string; mobile: string; email: string; password: string }) {
  const users = (await dbGet('users')) || {}
  const existing = Object.values(users) as any[]
  if (existing.find((u: any) => u.email === data.email)) throw new Error('Email already registered')
  if (existing.find((u: any) => u.mobile === data.mobile)) throw new Error('Mobile number already registered')

  const id = await dbPush('users', {})
  const hashedPassword = await bcrypt.hash(data.password, 8)
  const user = { id, ...data, password: hashedPassword, role: 'CUSTOMER', isActive: true, isBlocked: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  await dbSet(`users/${id}`, user)
  return { id, fullName: data.fullName, mobile: data.mobile, email: data.email, role: 'CUSTOMER', isActive: true, isBlocked: false }
}

export async function getUserByEmailOrMobile(login: string) {
  const users = (await dbGet('users')) || {}
  return Object.values(users).find((u: any) => u.email === login || u.mobile === login) as any || null
}

export async function getUserById(id: string) {
  return await dbGet(`users/${id}`)
}

export async function getAllUsers() {
  const users = (await dbGet('users')) || {}
  return Object.values(users).map((u: any) => ({ ...u, password: undefined }))
}

export async function updateUser(id: string, data: Record<string, any>) {
  await dbUpdate(`users/${id}`, { ...data, updatedAt: new Date().toISOString() })
  const updated = await getUserById(id)
  return { ...updated, password: undefined }
}

// ============ ADMINS ============
export async function getAdminByEmail(email: string) {
  const admins = (await dbGet('admins')) || {}
  return Object.values(admins).find((a: any) => a.email === email) as any || null
}

// ============ CATEGORIES ============
export async function getAllCategories() {
  const cats = (await dbGet('categories')) || {}
  return Object.values(cats) as any[]
}

export async function createCategory(data: { name: string; slug: string; description?: string; sortOrder?: number }) {
  const id = await dbPush('categories', {})
  const category = { id, ...data, isActive: true, createdAt: new Date().toISOString() }
  await dbSet(`categories/${id}`, category)
  return category
}

export async function updateCategory(id: string, data: Record<string, any>) {
  await dbUpdate(`categories/${id}`, data)
  return await dbGet(`categories/${id}`)
}

export async function deleteCategory(id: string) {
  await dbRemove(`categories/${id}`)
}

// ============ PRODUCTS ============
export async function getAllProducts(filters?: { category?: string; search?: string; status?: string; limit?: number; page?: number }) {
  const prods = (await dbGet('products')) || {}
  let products = Object.values(prods) as any[]

  if (filters?.category) {
    const cats = await getAllCategories()
    const cat = cats.find((c: any) => c.slug === filters.category)
    if (cat) products = products.filter((p: any) => p.categoryId === cat.id)
  }
  if (filters?.search) {
    const s = filters.search.toLowerCase()
    products = products.filter((p: any) => p.title.toLowerCase().includes(s) || p.description.toLowerCase().includes(s))
  }
  if (filters?.status) products = products.filter((p: any) => p.status === filters.status)

  products.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  return products
}

export async function getProductBySlug(slug: string) {
  const prods = (await dbGet('products')) || {}
  return Object.values(prods).find((p: any) => p.slug === slug) as any || null
}

export async function getProductById(id: string) {
  return await dbGet(`products/${id}`)
}

export async function createProduct(data: any) {
  const id = await dbPush('products', {})
  const product = { id, ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  await dbSet(`products/${id}`, product)
  return product
}

export async function updateProduct(id: string, data: Record<string, any>) {
  await dbUpdate(`products/${id}`, { ...data, updatedAt: new Date().toISOString() })
  return await getProductById(id)
}

export async function deleteProduct(id: string) {
  await dbRemove(`products/${id}`)
}

// ============ CART ============
export async function getCartItems(userId: string) {
  const items = (await dbGet(`carts/${userId}`)) || {}
  return Object.values(items) as any[]
}

export async function addCartItem(userId: string, productId: string, quantity: number) {
  const existing = await dbGet(`carts/${userId}/${productId}`)
  if (existing) {
    const newQty = existing.quantity + quantity
    await dbUpdate(`carts/${userId}/${productId}`, { quantity: newQty })
    return { ...existing, quantity: newQty }
  } else {
    const product = await getProductById(productId)
    if (!product) throw new Error('Product not found')
    const item = { productId, quantity, product: { id: product.id, title: product.title, slug: product.slug, price: product.price, primaryImage: product.primaryImage, availability: product.availability } }
    await dbSet(`carts/${userId}/${productId}`, item)
    return item
  }
}

export async function updateCartItem(userId: string, productId: string, quantity: number) {
  await dbUpdate(`carts/${userId}/${productId}`, { quantity })
  return await dbGet(`carts/${userId}/${productId}`)
}

export async function deleteCartItem(userId: string, productId: string) {
  await dbRemove(`carts/${userId}/${productId}`)
}

export async function clearCart(userId: string) {
  await dbRemove(`carts/${userId}`)
}

// ============ ORDERS ============

const PAYMENT_TIMEOUT_MS = 30 * 60 * 1000

export async function autoRejectExpiredOrders() {
  try {
    const orders = (await dbGet('orders')) || {}
    const now = Date.now()
    const updates: Record<string, any> = {}

    for (const [id, order] of Object.entries(orders) as [string, any][]) {
      if ((order.paymentMethod === 'FULL_ONLINE' || order.paymentMethod === 'ONLINE') && order.paymentStatus === 'PENDING' && order.orderStatus !== 'CANCELLED' && order.orderStatus !== 'DELIVERED') {
        const createdAt = new Date(order.createdAt).getTime()
        if (now - createdAt > PAYMENT_TIMEOUT_MS) {
          updates[id] = { ...order, orderStatus: 'CANCELLED', paymentStatus: 'FAILED', cancellationReason: 'Payment not completed within 30 minutes', updatedAt: new Date().toISOString() }
          if (order.userId) {
            try {
              await dbPush(`notifications/${order.userId}`, { type: 'ORDER_CANCELLED', title: 'Order Cancelled', message: `Order #${order.orderId} was cancelled because payment was not completed within 30 minutes.`, orderId: order.id, isRead: false, createdAt: new Date().toISOString() })
            } catch {}
          }
        }
      }
    }

    for (const [id, data] of Object.entries(updates)) {
      try { await dbUpdate(`orders/${id}`, data) } catch {}
    }
  } catch {}
}

export async function createOrder(data: any) {
  const id = await dbPush('orders', {})
  const order = { id, ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  await dbSet(`orders/${id}`, order)
  return order
}

export async function getOrderById(id: string) {
  return await dbGet(`orders/${id}`)
}

export async function getOrderByOrderId(orderId: string) {
  const orders = (await dbGet('orders')) || {}
  return Object.values(orders).find((o: any) => o.orderId === orderId) as any || null
}

export async function getOrdersByUser(userId: string) {
  const orders = (await dbGet('orders')) || {}
  return Object.values(orders)
    .filter((o: any) => o.userId === userId)
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) as any[]
}

export async function getAllOrders(filters?: { search?: string; status?: string; paymentMethod?: string; orderType?: string }) {
  const orders = (await dbGet('orders')) || {}
  let result = Object.values(orders) as any[]

  if (filters?.search) {
    const s = filters.search.toLowerCase()
    result = result.filter((o: any) => o.orderId.toLowerCase().includes(s))
  }
  if (filters?.status) result = result.filter((o: any) => o.orderStatus === filters.status)
  if (filters?.paymentMethod) result = result.filter((o: any) => o.paymentMethod === filters.paymentMethod)
  if (filters?.orderType) result = result.filter((o: any) => o.orderType === filters.orderType)

  result.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  return result
}

export async function updateOrder(id: string, data: Record<string, any>) {
  await dbUpdate(`orders/${id}`, { ...data, updatedAt: new Date().toISOString() })
  return await getOrderById(id)
}

// ============ ADDRESSES ============
export async function getAddresses(userId: string) {
  const addrs = (await dbGet(`addresses/${userId}`)) || {}
  return Object.values(addrs) as any[]
}

export async function createAddress(userId: string, data: any) {
  const id = await dbPush(`addresses/${userId}`, {})
  const address = { id, userId, ...data }
  await dbSet(`addresses/${userId}/${id}`, address)
  return address
}

export async function updateAddress(userId: string, id: string, data: Record<string, any>) {
  await dbUpdate(`addresses/${userId}/${id}`, data)
  return await dbGet(`addresses/${userId}/${id}`)
}

export async function deleteAddress(userId: string, id: string) {
  await dbRemove(`addresses/${userId}/${id}`)
}

// ============ PAYMENTS ============
export async function createPayment(data: any) {
  const id = await dbPush('payments', {})
  const payment = { id, ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  await dbSet(`payments/${id}`, payment)
  return payment
}

export async function getPaymentByGatewayOrderId(gatewayOrderId: string) {
  const payments = (await dbGet('payments')) || {}
  return Object.values(payments).find((p: any) => p.gatewayOrderId === gatewayOrderId) as any || null
}

export async function updatePayment(id: string, data: Record<string, any>) {
  await dbUpdate(`payments/${id}`, { ...data, updatedAt: new Date().toISOString() })
}

export async function getAllPayments() {
  const payments = (await dbGet('payments')) || {}
  return Object.values(payments).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) as any[]
}

// ============ NOTIFICATIONS ============
export async function getNotifications(userId: string) {
  const notifs = (await dbGet(`notifications/${userId}`)) || {}
  return Object.values(notifs).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) as any[]
}

export async function createNotification(userId: string, data: { type: string; title: string; message: string; orderId?: string }) {
  const id = await dbPush(`notifications/${userId}`, {})
  const notification = { id, userId, ...data, isRead: false, createdAt: new Date().toISOString() }
  await dbSet(`notifications/${userId}/${id}`, notification)
  return notification
}

export async function markNotificationRead(userId: string, id: string) {
  await dbUpdate(`notifications/${userId}/${id}`, { isRead: true })
}

export async function markAllNotificationsRead(userId: string) {
  const notifs = (await dbGet(`notifications/${userId}`)) || {}
  const updates: Record<string, any> = {}
  Object.keys(notifs).forEach((key) => { updates[key] = { isRead: true } })
  await dbUpdate(`notifications/${userId}`, updates)
}

// ============ BANNERS ============
export async function getAllBanners() {
  const banners = (await dbGet('banners')) || {}
  return Object.values(banners).sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0)) as any[]
}

export async function createBanner(data: any) {
  const id = await dbPush('banners', {})
  const banner = { id, ...data, createdAt: new Date().toISOString() }
  await dbSet(`banners/${id}`, banner)
  return banner
}

export async function updateBanner(id: string, data: Record<string, any>) {
  await dbUpdate(`banners/${id}`, data)
  return await dbGet(`banners/${id}`)
}

export async function deleteBanner(id: string) {
  await dbRemove(`banners/${id}`)
}

// ============ SETTINGS ============
export async function getSettings() {
  return (await dbGet('settings')) || {}
}

export async function updateSettings(data: Record<string, string>) {
  await dbUpdate('settings', data)
}

// ============ AUDIT LOGS ============
export async function createAuditLog(data: { adminId: string; action: string; target: string; oldValue?: string; newValue?: string }) {
  const id = await dbPush('auditLogs', {})
  const log = { id, ...data, createdAt: new Date().toISOString() }
  await dbSet(`auditLogs/${id}`, log)
  return log
}

export async function getAuditLogs() {
  const logs = (await dbGet('auditLogs')) || {}
  return Object.values(logs).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) as any[]
}
