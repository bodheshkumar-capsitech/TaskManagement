import { z } from "zod";

export const todoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Todo title is required")
    .max(40, "Todo title cannot exceed 40 characters"),

  description: z
    .string()
    .max(200, "Description cannot exceed 200 characters"),
});

export type TodoFormData = z.infer<typeof todoSchema>;