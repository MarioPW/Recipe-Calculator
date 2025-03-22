import { z } from "zod";

export const ingredientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  unitOfMeasure: z.string().min(1, "Unit of measure is required"), 
  brand: z.string().nullable().optional(),
  supplier: z.string().nullable().optional(),
  costPerKg: z.number().nullable().optional(),
  expirationDate: z.string().nullable().optional(),
  batch: z.string().nullable().optional(),
  stock: z.number().nullable().optional(),
  reference: z.string().nullable().optional(),
})