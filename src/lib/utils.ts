import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}

export function isUrgentOrder(deliveryDate: Date, urgentThresholdDays: number = 2): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const delivery = new Date(deliveryDate)
  delivery.setHours(0, 0, 0, 0)
  const diffTime = delivery.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays <= urgentThresholdDays
}

export function getMinDeliveryDate(minDays: number = 1): Date {
  const date = new Date()
  date.setDate(date.getDate() + minDays)
  return date
}
