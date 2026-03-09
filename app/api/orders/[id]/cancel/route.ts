import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cancelOrderSchema } from '@/lib/validations/order'
import { authorize } from '@/lib/authorize'

type Params = {
  params: Promise<{
    id: string
  }>
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    const { id } = await params
    const body = await req.json().catch(() => ({}))
    const auth = await authorize(["ADMIN"]);
if (!auth.ok) return auth.response;

    const parsed = cancelOrderSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message || 'Validation error' },
        { status: 400 }
      )
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        customer: true,
      },
    })

    if (!order) {
      return NextResponse.json(
        { message: 'Order topilmadi' },
        { status: 404 }
      )
    }

    if (order.status === 'CANCELLED') {
      return NextResponse.json(
        { message: 'Order allaqachon CANCELLED' },
        { status: 409 }
      )
    }

    if (order.status === 'PAID') {
      return NextResponse.json(
        { message: 'PAID orderni cancel qilib bo‘lmaydi' },
        { status: 409 }
      )
    }

    const cancelledOrder = await prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        })
      }

      return tx.order.update({
        where: { id },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date(),
          cancelReason: parsed.data.reason ?? null,
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
    })

    return NextResponse.json(
      {
        message: 'Order CANCELLED qilindi va stock qaytarildi',
        order: cancelledOrder,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('PATCH /api/orders/[id]/cancel error:', error)
    return NextResponse.json(
      { message: 'Orderni cancel qilishda xatolik' },
      { status: 500 }
    )
  }
}