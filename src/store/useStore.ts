import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, CartItem, Notification } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null }),
    }),
    { name: 'sweet-cake-auth' }
  )
)

interface CartState {
  items: CartItem[]
  setItems: (items: CartItem[]) => void
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      setItems: (items) => set({ items }),
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            }
          }
          return { items: [...state.items, item] }
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    { name: 'sweet-cake-cart' }
  )
)

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  setNotifications: (notifications: Notification[]) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
}

export const useNotificationStore = create<NotificationState>()((set) => ({
  notifications: [],
  unreadCount: 0,
  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.isRead).length,
    }),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
      unreadCount: state.unreadCount - 1,
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),
}))
