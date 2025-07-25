import { z } from "zod";

export const ingredientSchema = z.object({
  name: z.string().min(1, "nameRequired.").default(""),
  unitOfMeasure: z.string().min(1, "unitRequired").default(""),
  brand: z.string().nullable().optional().default(""),
  supplier: z.string().nullable().optional().default(""),
  costPerKg: z
    .preprocess((v) => (v === "" ? null : Number(v)), z.number().nonnegative().nullable().optional())
    .default(null),
  expirationDate: z.string().nullable().optional().default(""),
  batch: z.string().nullable().optional().default(""),
  stock: z
    .preprocess((v) => (v === "" ? null : Number(v)), z.number().nonnegative().nullable().optional())
    .default(null),
  minStock: z
    .preprocess((v) => (v === "" ? null : Number(v)), z.number().nonnegative().nullable().optional())
    .default(null),
  reference: z.string().nullable().optional().default(""),
  setInInventory: z.boolean().default(true),
});