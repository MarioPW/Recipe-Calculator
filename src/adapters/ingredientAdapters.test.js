import { describe, it, expect } from 'vitest'
import { IngredientAdapter } from './ingredientAdapters'

describe('IngredientAdapter', () => {
  describe('parseNumber', () => {
    it('returns null for null', () => {
      expect(IngredientAdapter.parseNumber(null)).toBe(null)
    })

    it('returns null for undefined', () => {
      expect(IngredientAdapter.parseNumber(undefined)).toBe(null)
    })

    it('returns null for empty string', () => {
      expect(IngredientAdapter.parseNumber('')).toBe(null)
    })

    it('parses numeric string', () => {
      expect(IngredientAdapter.parseNumber('10')).toBe(10)
    })

    it('parses number', () => {
      expect(IngredientAdapter.parseNumber(5.5)).toBe(5.5)
    })

    it('returns null for non-numeric string', () => {
      expect(IngredientAdapter.parseNumber('abc')).toBe(null)
    })
  })

  describe('adapt', () => {
    it('adapts ingredient with all fields', () => {
      const ingredient = {
        id: '123',
        name: 'Harina',
        unitOfMeasure: 'kg',
        brand: 'Marca',
        supplier: 'Proveedor',
        costPerKg: '10.5',
        expirationDate: '2024-12-31',
        batch: 'L001',
        minStock: 5,
        reference: 'REF001',
        setInInventory: true
      }

      const result = IngredientAdapter.adapt(ingredient)

      expect(result.id).toBe('123')
      expect(result.name).toBe('Harina')
      expect(result.unitOfMeasure).toBe('kg')
      expect(result.brand).toBe('Marca')
      expect(result.supplier).toBe('Proveedor')
      expect(result.costPerKg).toBe(10.5)
      expect(result.expirationDate).toBe('2024-12-31')
      expect(result.batch).toBe('L001')
      expect(result.minStock).toBe(5)
      expect(result.reference).toBe('REF001')
      expect(result.setInInventory).toBe(true)
    })

    it('applies defaults for missing fields', () => {
      const ingredient = {
        name: 'Harina',
        unitOfMeasure: 'kg'
      }

      const result = IngredientAdapter.adapt(ingredient)

      expect(result.brand).toBe('')
      expect(result.supplier).toBe('')
      expect(result.expirationDate).toBe('')
      expect(result.batch).toBe('')
      expect(result.reference).toBe('')
      expect(result.setInInventory).toBe(false)
    })

    it('parses string numbers with parseNumber', () => {
      const ingredient = {
        name: 'Harina',
        unitOfMeasure: 'kg',
        costPerKg: '15.75',
        minStock: '3'
      }

      const result = IngredientAdapter.adapt(ingredient)

      expect(result.costPerKg).toBe(15.75)
      expect(result.minStock).toBe(3)
    })

    it('returns null for invalid numbers', () => {
      const ingredient = {
        name: 'Harina',
        unitOfMeasure: 'kg',
        costPerKg: 'abc',
        minStock: ''
      }

      const result = IngredientAdapter.adapt(ingredient)

      expect(result.costPerKg).toBe(null)
      expect(result.minStock).toBe(null)
    })

    it('falls back to FSUid or FSId for id', () => {
      const ingredient1 = { FSUid: 'fsu123', name: 'Test', unitOfMeasure: 'kg' }
      const ingredient2 = { FSId: 'fs123', name: 'Test', unitOfMeasure: 'kg' }

      expect(IngredientAdapter.adapt(ingredient1).id).toBe('fsu123')
      expect(IngredientAdapter.adapt(ingredient2).id).toBe('fs123')
    })

    it('instance method still works for backward compatibility', () => {
      const adapter = new IngredientAdapter()
      const ingredient = { name: 'Harina', unitOfMeasure: 'kg', costPerKg: '10' }
      const result = adapter.adapt(ingredient)
      expect(result.costPerKg).toBe(10)
    })
  })
})
