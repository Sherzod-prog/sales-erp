import { z } from 'zod'

export const createOrderSchema = z.object({
  customerId: z.string().min(1, 'customerId kerak'),
  items: z.array(
    z.object({
      productId: z.string().min(1, 'productId kerak'),
      quantity: z.coerce.number().int().positive('quantity 1 dan katta bo‘lsin'),
    })
  ).min(1, 'Kamida bitta product bo‘lishi kerak'),
})

// export const updateOrderSchema = z.object({
//   status: z.enum(['PENDING', 'PAID', 'CANCELLED']).optional(),
// })

export const cancelOrderSchema = z.object({
  reason: z.string().min(3, 'Sabab kamida 3 ta belgi bo‘lsin').optional(),
})