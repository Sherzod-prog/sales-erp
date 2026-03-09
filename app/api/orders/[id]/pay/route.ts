import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authorize } from '@/lib/authorize'

type Params = {
  params: Promise<{
    id: string
  }>
}

export async function PATCH(_: Request, { params }: Params) {
  try {
    const { id } = await params
    const auth = await authorize(["ADMIN", "MANAGER"]);
if (!auth.ok) return auth.response;

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

    if (order.status === 'PAID') {
      return NextResponse.json(
        { message: 'Order allaqachon PAID' },
        { status: 409 }
      )
    }

    if (order.status === 'CANCELLED') {
      return NextResponse.json(
        { message: 'CANCELLED orderni PAID qilib bo‘lmaydi' },
        { status: 409 }
      )
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        status: 'PAID',
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    return NextResponse.json(
      {
        message: 'Order PAID qilindi',
        order: updated,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('PATCH /api/orders/[id]/pay error:', error)
    return NextResponse.json(
      { message: 'Orderni PAID qilishda xatolik' },
      { status: 500 }
    )
  }
}