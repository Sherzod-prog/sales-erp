import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2, 'Name kamida 2 ta belgi bo‘lsin'),
  email: z.email('Email noto‘g‘ri'),
  password: z.string().min(6, 'Parol kamida 6 ta belgi bo‘lsin'),
})

export const loginSchema = z.object({
  email: z.email('Email noto‘g‘ri'),
  password: z.string().min(6, 'Parol kamida 6 ta belgi bo‘lsin'),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>