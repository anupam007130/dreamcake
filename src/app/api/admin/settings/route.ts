import { NextRequest, NextResponse } from 'next/server'
import { getSettings, updateSettings, createAuditLog } from '@/lib/db'
import { getAdminFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const admin = getAdminFromRequest(request)
    if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const settings = await getSettings()
    return NextResponse.json({ success: true, data: settings })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = getAdminFromRequest(request)
    if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const currentSettings = await getSettings()

    if (body.payment_environment && body.payment_environment !== currentSettings.payment_environment) {
      await createAuditLog({ adminId: admin.adminId, action: 'PAYMENT_ENVIRONMENT_CHANGED', target: 'Razorpay Environment', oldValue: currentSettings.payment_environment, newValue: body.payment_environment })
    }
    if (body.cod_advance_amount && body.cod_advance_amount !== currentSettings.cod_advance_amount) {
      await createAuditLog({ adminId: admin.adminId, action: 'COD_ADVANCE_CHANGED', target: 'COD Advance Amount', oldValue: currentSettings.cod_advance_amount, newValue: body.cod_advance_amount })
    }
    if (body.urgent_charge && body.urgent_charge !== currentSettings.urgent_charge) {
      await createAuditLog({ adminId: admin.adminId, action: 'URGENT_CHARGE_CHANGED', target: 'Urgent Charge', oldValue: currentSettings.urgent_charge, newValue: body.urgent_charge })
    }

    await updateSettings(body)

    return NextResponse.json({ success: true, message: 'Settings updated' })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
