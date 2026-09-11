import { NextRequest, NextResponse } from 'next/server'
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const notifications = await getNotifications(user.userId)
    const unreadCount = notifications.filter((n: any) => !n.isRead).length

    return NextResponse.json({ success: true, data: { notifications, unreadCount } })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { id, markAll } = body

    if (markAll) {
      await markAllNotificationsRead(user.userId)
    } else if (id) {
      await markNotificationRead(user.userId, id)
    }

    return NextResponse.json({ success: true, message: 'Notifications updated' })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
