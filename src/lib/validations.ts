import { z } from "zod";

// Sign In validation schema
export const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email field is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password field is required")
    .min(6, "Password must be at least 6 characters"),
});

// Sign Up validation schema
export const signUpSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and _"),
  email: z
    .string()
    .min(1, "Email field is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password field is required")
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

// Types
export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
