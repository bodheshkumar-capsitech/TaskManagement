import { z } from "zod";

export const projectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Project name is required")
    .max(40, "Project name cannot exceed 40 characters"),

  description: z
    .string()
    .max(200, "Description cannot exceed 200 characters"),
});

export type ProjectFormData = z.infer<typeof projectSchema>;