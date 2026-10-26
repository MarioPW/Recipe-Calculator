import { describe, it, expect } from 'vitest'
import { recipeSchema, validateRecipe } from './recipeValidation'

describe('recipeValidation', () => {
  describe('recipeSchema', () => {
    it('validates a valid recipe', () => {
      const recipe = {
        name: 'Torta',
        description: 'Una rica torta',
        ingredients: [{ id: '1', name: 'Harina', quantity: 500 }],
        steps: ['Mezclar', 'Hornear'],
        userId: 'user123'
      }

      const result = recipeSchema.safeParse(recipe)
      expect(result.success).toBe(true)
    })

    it('requires name', () => {
      const recipe = {
        userId: 'user123'
      }

      const result = recipeSchema.safeParse(recipe)
      expect(result.success).toBe(false)
    })

    it('applies defaults', () => {
      const recipe = {
        name: 'Torta'
      }

      const result = recipeSchema.safeParse(recipe)
      expect(result.success).toBe(true)
      expect(result.data.description).toBe('')
      expect(result.data.ingredients).toEqual([])
      expect(result.data.steps).toEqual([])
      expect(result.data.image).toBe('')
      expect(result.data.isSubRecipe).toBe(false)
      expect(result.data.productWeight).toBe(0)
    })

    it('preprocesses empty string numbers to 0', () => {
      const recipe = {
        name: 'Torta',
        productWeight: ''
      }

      const result = recipeSchema.safeParse(recipe)
      expect(result.success).toBe(true)
      expect(result.data.productWeight).toBe(0)
    })

    it('converts string quantities to numbers', () => {
      const recipe = {
        name: 'Torta',
        ingredients: [{ name: 'Harina', quantity: '500' }]
      }

      const result = recipeSchema.safeParse(recipe)
      expect(result.success).toBe(true)
      expect(result.data.ingredients[0].quantity).toBe(500)
    })

    it('rejects negative quantities', () => {
      const recipe = {
        name: 'Torta',
        ingredients: [{ name: 'Harina', quantity: -10 }]
      }

      const result = recipeSchema.safeParse(recipe)
      expect(result.success).toBe(false)
    })

    it('rejects negative productWeight', () => {
      const recipe = {
        name: 'Torta',
        productWeight: -100
      }

      const result = recipeSchema.safeParse(recipe)
      expect(result.success).toBe(false)
    })
  })

  describe('validateRecipe', () => {
    it('returns success true for valid data', () => {
      const recipe = {
        name: 'Torta'
      }

      const result = validateRecipe(recipe)
      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
    })

    it('returns success false with errors for invalid data', () => {
      const recipe = {}

      const result = validateRecipe(recipe)
      expect(result.success).toBe(false)
      expect(result.errors).toBeDefined()
      expect(Array.isArray(result.errors)).toBe(true)
    })
  })
})
