import { NextRequest, NextResponse } from 'next/server'
import { getAddresses, createAddress, updateAddress, deleteAddress } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const addresses = await getAddresses(user.userId)
    return NextResponse.json({ success: true, data: addresses })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { fullName, mobile, houseFlat, streetArea, city, state, pinCode, landmark, deliveryInstructions, isDefault } = body

    if (!fullName || !mobile || !houseFlat || !streetArea || !city || !state || !pinCode) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const address = await createAddress(user.userId, { fullName, mobile, houseFlat, streetArea, city, state, pinCode, landmark, deliveryInstructions, isDefault: isDefault || false })
    return NextResponse.json({ success: true, data: address })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { id, ...data } = body
    if (!id) return NextResponse.json({ success: false, error: 'Address ID is required' }, { status: 400 })

    const address = await updateAddress(user.userId, id, data)
    return NextResponse.json({ success: true, data: address })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ success: false, error: 'Address ID is required' }, { status: 400 })

    await deleteAddress(user.userId, id)
    return NextResponse.json({ success: true, message: 'Address deleted' })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
