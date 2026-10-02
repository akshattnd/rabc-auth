import { z } from 'zod';
export const registerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must contain at least 2 characters")
        .max(50, "Name cannot exceed 50 characters"),

    email: z
        .email("Invalid email address")
        .trim()
        .toLowerCase(),

    password: z
        .string()
        .min(8, "Password must contain at least 8 characters")
        .max(100, "Password cannot exceed 100 characters"),
});

export const loginSchema = z.object({
   
    email: z
        .email("Invalid email address")
        .trim()
        .toLowerCase(),

    password: z
        .string()
        .min(8, "Password must contain at least 8 characters")
        .max(100, "Password cannot exceed 100 characters"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>