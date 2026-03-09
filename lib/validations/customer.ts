import { z } from 'zod'

export const createCustomerSchema = z.object({
  name: z.string().min(2, 'Mijoz nomi kamida 2 ta belgi bo‘lsin'),
  phone: z.string().min(7, 'Telefon raqam noto‘g‘ri'),
})

export const updateCustomerSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().min(7).optional(),
})