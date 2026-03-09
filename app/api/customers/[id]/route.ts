import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { updateCustomerSchema } from '@/lib/validations/customer'

type Params = {
  params: Promise<{
    id: string
  }>
}

export async function GET(_: Request, { params }: Params) {
  try {
    const { id } = await params

    const customer = await prisma.customer.findUnique({
      where: { id },
    })

    if (!customer) {
      return NextResponse.json(
        { message: 'Mijoz topilmadi' },
        { status: 404 }
      )
    }

    return NextResponse.json(customer, { status: 200 })
  } catch {
    return NextResponse.json(
      { message: 'Mijozni olishda xatolik' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    const { id } = await params
    const body = await req.json()

    const parsed = updateCustomerSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message || 'Validation error' },
        { status: 400 }
      )
    }

    const existing = await prisma.customer.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { message: 'Mijoz topilmadi' },
        { status: 404 }
      )
    }

    const customer = await prisma.customer.update({
      where: { id },
      data: parsed.data,
    })

    return NextResponse.json(
      {
        message: 'Mijoz yangilandi',
        customer,
      },
      { status: 200 }
    )
  } catch {
    return NextResponse.json(
      { message: 'Mijozni yangilashda xatolik' },
      { status: 500 }
    )
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    const { id } = await params

    const existing = await prisma.customer.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { message: 'Mijoz topilmadi' },
        { status: 404 }
      )
    }

    await prisma.customer.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: 'Mijoz o‘chirildi' },
      { status: 200 }
    )
  } catch {
    return NextResponse.json(
      { message: 'Mijozni o‘chirishda xatolik' },
      { status: 500 }
    )
  }
}