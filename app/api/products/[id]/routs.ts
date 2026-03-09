import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateProductSchema } from "@/lib/validations/product";
import { authorize } from "@/lib/authorize";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_: Request, { params }: Params) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product topilmadi" },
        { status: 404 }
      );
    }

    return NextResponse.json(product, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Productni olishda xatolik" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, { params }: Params) {
  const auth = await authorize(["ADMIN"]);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    const body = await req.json();

    const parsed = updateProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }

    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { message: "Product topilmadi" },
        { status: 404 }
      );
    }

    const product = await prisma.product.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json(
      {
        message: "Product yangilandi",
        product,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Productni yangilashda xatolik" },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, { params }: Params) {
  const auth = await authorize(["ADMIN"]);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;

    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { message: "Product topilmadi" },
        { status: 404 }
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Product o‘chirildi" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Productni o‘chirishda xatolik" },
      { status: 500 }
    );
  }
}