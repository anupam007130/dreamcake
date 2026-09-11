export interface User {
  id: string
  fullName: string
  mobile: string
  email: string
  profileImage?: string
  role: string
  isActive: boolean
  isBlocked: boolean
  createdAt: Date
}

export interface Admin {
  id: string
  fullName: string
  email: string
  role: string
  isActive: boolean
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  isActive: boolean
  sortOrder: number
}

export interface ProductImage {
  id: string
  imageUrl: string
  sortOrder: number
  isPrimary: boolean
}

export interface Product {
  id: string
  title: string
  slug: string
  description: string
  price: number
  categoryId: string
  primaryImage: string
  status: string
  availability: boolean
  category?: Category
  images?: ProductImage[]
  reviews?: Review[]
  _count?: { reviews: number }
  _avg?: { rating: number }
}

export interface CartItemProduct {
  id: string
  title: string
  slug: string
  price: number
  primaryImage: string
  availability: boolean
}

export interface CartItem {
  id: string
  productId: string
  quantity: number
  product: CartItemProduct
}

export interface Address {
  id: string
  fullName: string
  mobile: string
  houseFlat: string
  streetArea: string
  city: string
  state: string
  pinCode: string
  landmark?: string
  deliveryInstructions?: string
  isDefault: boolean
}

export interface OrderItem {
  id: string
  productId: string
  title: string
  price: number
  quantity: number
  total: number
  image: string
}

export interface Order {
  id: string
  orderId: string
  userId: string
  addressId: string
  subtotal: number
  deliveryCharge: number
  urgentCharge: number
  totalAmount: number
  paymentMethod: string
  advanceAmount: number
  amountPaid: number
  remainingCod: number
  deliveryDate: Date
  orderType: string
  paymentStatus: string
  orderStatus: string
  razorpayOrderId?: string
  notes?: string
  createdAt: Date
  items?: OrderItem[]
  user?: User
  address?: Address
  payments?: Payment[]
}

export interface Payment {
  id: string
  paymentId: string
  orderId: string
  userId: string
  gateway: string
  gatewayOrderId?: string
  gatewayPaymentId?: string
  amount: number
  currency: string
  paymentMethod: string
  paymentType: string
  status: string
  signatureVerified: boolean
  createdAt: Date
}

export interface Review {
  id: string
  userId: string
  productId: string
  orderId: string
  rating: number
  comment?: string
  image?: string
  isApproved: boolean
  isHidden: boolean
  createdAt: Date
  user?: User
  product?: Product
}

export interface Notification {
  id: string
  userId: string
  type: string
  title: string
  message: string
  orderId?: string
  isRead: boolean
  createdAt: Date
}

export interface Banner {
  id: string
  imageUrl: string
  heading: string
  subtitle?: string
  buttonText?: string
  buttonLink?: string
  sortOrder: number
  isActive: boolean
}

export interface Setting {
  id: string
  key: string
  value: string
}

export interface AuditLog {
  id: string
  adminId: string
  action: string
  target: string
  oldValue?: string
  newValue?: string
  metadata?: string
  createdAt: Date
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface DashboardStats {
  totalUsers: number
  totalProducts: number
  totalOrders: number
  todayOrders: number
  pendingOrders: number
  confirmedOrders: number
  urgentOrders: number
  normalOrders: number
  deliveredOrders: number
  cancelledOrders: number
  totalSales: number
  onlinePayments: number
  codAdvanceCollected: number
  outstandingCod: number
}
