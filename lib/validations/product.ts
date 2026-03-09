import { z } from 'zod'

export const createProductSchema = z.object({
  name: z.string().min(2, 'Product nomi kamida 2 ta belgi bo‘lsin'),
  description: z.string().optional(),
  price: z.number().positive('Price 0 dan katta bo‘lishi kerak'),
  stock: z.number().int().min(0, 'Stock manfiy bo‘lmasin'),
})

export const updateProductSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  price: z.coerce.number().positive(),
  stock: z.coerce.number().int().min(0)
})