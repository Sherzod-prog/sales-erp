import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = {
  params: Promise<{
    id: string
  }>
}

export async function GET(_: Request, { params }: Params) {
  try {
    const { id } = await params

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json(
        { message: 'Order topilmadi' },
        { status: 404 }
      )
    }

    return NextResponse.json(order, { status: 200 })
  } catch (error) {
    console.error('GET /api/orders/[id] error:', error)
    return NextResponse.json(
      { message: 'Orderni olishda xatolik' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  return NextResponse.json(
    { message: 'Order delete qilinmaydi. Cancel endpointdan foydalaning.' },
    { status: 405 }
  )
}