import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createCustomerSchema } from "@/lib/validations/customer";
import { authorize } from "@/lib/authorize";

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(customers, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Mijozlarni olishda xatolik" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const auth = await authorize(["ADMIN"]);
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const parsed = createCustomerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }

    const { name, phone} = parsed.data;

    const customer = await prisma.customer.create({
      data: {
        name,
        phone,        
      },
    });

    return NextResponse.json(
      {
        message: "Mijoz yaratildi",
        customer,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { message: "Mijoz yaratishda xatolik" },
      { status: 500 }
    );
  }
}