import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createProductSchema } from "@/lib/validations/product";
import { authorize } from "@/lib/authorize";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Productlarni olishda xatolik" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const auth = await authorize(["ADMIN"]);
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const parsed = createProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }

    const { name, description, price, stock } = parsed.data;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
      },
    });

    return NextResponse.json(
      {
        message: "Product yaratildi",
        product,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { message: "Product yaratishda xatolik" },
      { status: 500 }
    );
  }
}