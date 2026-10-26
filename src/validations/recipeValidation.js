import { z } from "zod";

const recipeIngredientSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  quantity: z
    .preprocess((v) => (v === "" || v === null || v === undefined ? 0 : Number(v)), z.number().nonnegative().optional())
    .default(0),
  unitOfMeasure: z.string().optional(),
  costPerKg: z
    .preprocess((v) => (v === "" || v === null || v === undefined ? null : Number(v)), z.number().nonnegative().nullable().optional())
    .default(null),
}).passthrough();

export const recipeSchema = z.object({
  name: z.string().min(1, "recipeNameRequired").default(""),
  description: z.string().nullable().optional().default(""),
  ingredients: z.array(recipeIngredientSchema).optional().default([]),
  steps: z.array(z.string()).optional().default([]),
  image: z.string().nullable().optional().default(""),
  userId: z.string().optional(),
  isSubRecipe: z.boolean().optional().default(false),
  productWeight: z
    .preprocess((v) => (v === "" || v === null || v === undefined ? 0 : Number(v)), z.number().nonnegative().optional())
    .default(0),
}).passthrough();

export const validateRecipe = (data) => {
  const result = recipeSchema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      errors: result.error.errors.map((e) => e.message),
      error: result.error
    };
  }
  return {
    success: true,
    data: result.data
  };
};
