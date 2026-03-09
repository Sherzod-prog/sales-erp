import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createOrderSchema } from '@/lib/validations/order'
import { authorize } from '@/lib/authorize'

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(orders, { status: 200 })
  } catch (error) {
    console.error('GET /api/orders error:', error)
    return NextResponse.json(
      { message: 'Orderlarni olishda xatolik' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const auth = await authorize(["ADMIN", "MANAGER"]);
if (!auth.ok) return auth.response;
    const body = await req.json()
    const parsed = createOrderSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message || 'Validation error' },
        { status: 400 }
      )
    }

    const { customerId, items } = parsed.data

    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    })

    if (!customer) {
      return NextResponse.json(
        { message: 'Mijoz topilmadi' },
        { status: 404 }
      )
    }

    const productIds = [...new Set(items.map((item) => item.productId))]

    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
    })

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { message: 'Ba’zi mahsulotlar topilmadi' },
        { status: 404 }
      )
    }

    const productMap = new Map(products.map((product) => [product.id, product]))

    for (const item of items) {
      const product = productMap.get(item.productId)

      if (!product) {
        return NextResponse.json(
          { message: `Mahsulot topilmadi: ${item.productId}` },
          { status: 404 }
        )
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { message: `${product.name} uchun stock yetarli emas` },
          { status: 400 }
        )
      }
    }

    const total = items.reduce((sum, item) => {
      const product = productMap.get(item.productId)!
      return sum + product.price * item.quantity
    }, 0)

    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          customerId,
          total,
          status: 'PENDING',
        },
      })

      for (const item of items) {
        const product = productMap.get(item.productId)!

        await tx.orderItem.create({
          data: {
            orderId: createdOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: product.price,
          },
        })

        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        })
      }

      return tx.order.findUnique({
        where: { id: createdOrder.id },
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
        message: 'Order yaratildi',
        order,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST /api/orders error:', error)
    return NextResponse.json(
      { message: 'Order yaratishda xatolik' },
      { status: 500 }
    )
  }
}