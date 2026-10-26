import { describe, it, expect } from 'vitest'
import { ingredientSchema, validateIngredient } from './ingredientValidation'

describe('ingredientValidation', () => {
  describe('ingredientSchema', () => {
    it('validates a valid ingredient', () => {
      const ingredient = {
        name: 'Harina',
        unitOfMeasure: 'kg',
        costPerKg: 10.5,
        minStock: 5
      }

      const result = ingredientSchema.safeParse(ingredient)
      expect(result.success).toBe(true)
    })

    it('requires name', () => {
      const ingredient = {
        unitOfMeasure: 'kg'
      }

      const result = ingredientSchema.safeParse(ingredient)
      expect(result.success).toBe(false)
    })

    it('requires unitOfMeasure', () => {
      const ingredient = {
        name: 'Harina'
      }

      const result = ingredientSchema.safeParse(ingredient)
      expect(result.success).toBe(false)
    })

    it('preprocesses empty string numbers to null', () => {
      const ingredient = {
        name: 'Harina',
        unitOfMeasure: 'kg',
        costPerKg: '',
        minStock: ''
      }

      const result = ingredientSchema.safeParse(ingredient)
      expect(result.success).toBe(true)
      expect(result.data.costPerKg).toBe(null)
      expect(result.data.minStock).toBe(null)
    })

    it('applies defaults', () => {
      const ingredient = {
        name: 'Harina',
        unitOfMeasure: 'kg'
      }

      const result = ingredientSchema.safeParse(ingredient)
      expect(result.success).toBe(true)
      expect(result.data.brand).toBe('')
      expect(result.data.supplier).toBe('')
      expect(result.data.setInInventory).toBe(true)
      expect(result.data.costPerKg).toBe(null)
    })

    it('converts string numbers to numbers', () => {
      const ingredient = {
        name: 'Harina',
        unitOfMeasure: 'kg',
        costPerKg: '10.5'
      }

      const result = ingredientSchema.safeParse(ingredient)
      expect(result.success).toBe(true)
      expect(result.data.costPerKg).toBe(10.5)
    })

    it('rejects negative numbers', () => {
      const ingredient = {
        name: 'Harina',
        unitOfMeasure: 'kg',
        costPerKg: -5
      }

      const result = ingredientSchema.safeParse(ingredient)
      expect(result.success).toBe(false)
    })
  })

  describe('validateIngredient', () => {
    it('returns success true for valid data', () => {
      const ingredient = {
        name: 'Harina',
        unitOfMeasure: 'kg'
      }

      const result = validateIngredient(ingredient)
      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
    })

    it('returns success false with errors for invalid data', () => {
      const ingredient = {
        unitOfMeasure: 'kg'
      }

      const result = validateIngredient(ingredient)
      expect(result.success).toBe(false)
      expect(result.errors).toBeDefined()
      expect(Array.isArray(result.errors)).toBe(true)
    })
  })
})
