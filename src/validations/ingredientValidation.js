import { z } from "zod";

export const ingredientSchema = z.object({
  name: z.string().min(1, "Name is required"), // Campo obligatorio
  unitOfMeasure: z.string().min(1, "Unit of measure is required"), // Campo obligatorio
  brand: z.string().nullable().optional(), // Opcional y permite `null`
  supplier: z.string().nullable().optional(),
  costPerKg: z.number().nullable().optional(),
  expirationDate: z.string().nullable().optional(), // Puede ser `null` y debe ser un string (Formato de fecha)
  batch: z.string().nullable().optional(),
  stock: z.number().nullable().optional(),
  reference: z.string().nullable().optional(), // Número en formato string, opcional
})