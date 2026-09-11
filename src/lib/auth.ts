import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'sweet-cake-super-secret-jwt-key-2026'
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'sweet-cake-admin-secret-jwt-key-2026'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(payload: { userId: string; email: string; role: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

export function generateAdminToken(payload: { adminId: string; email: string; role: string }): string {
  return jwt.sign(payload, ADMIN_JWT_SECRET, { expiresIn: '24h' })
}

export function verifyAdminToken(token: string): any {
  try {
    return jwt.verify(token, ADMIN_JWT_SECRET)
  } catch {
    return null
  }
}

export function getUserFromRequest(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  if (!token) return null
  return verifyToken(token)
}

export function getAdminFromRequest(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value
  if (!token) return null
  return verifyAdminToken(token)
}

export function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `SC${timestamp}${random}`
}

export function generatePaymentId(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `PAY${timestamp}${random}`
}
