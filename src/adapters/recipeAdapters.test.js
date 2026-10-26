import { describe, it, expect } from 'vitest'
import { RecipeAdapter } from './recipeAdapters'

describe('RecipeAdapter', () => {
  describe('adapt', () => {
    it('adapts recipe with all fields', () => {
      const recipe = {
        name: 'Torta',
        description: 'Una rica torta',
        ingredients: [{ id: '1', name: 'Harina', quantity: 500 }],
        steps: ['Mezclar', 'Hornear'],
        image: 'image.jpg',
        userId: 'user123',
        isSubRecipe: true,
        productWeight: 1000
      }

      const result = RecipeAdapter.adapt(recipe)

      expect(result.name).toBe('Torta')
      expect(result.description).toBe('Una rica torta')
      expect(result.ingredients).toEqual([{ id: '1', name: 'Harina', quantity: 500 }])
      expect(result.steps).toEqual(['Mezclar', 'Hornear'])
      expect(result.image).toBe('image.jpg')
      expect(result.userId).toBe('user123')
      expect(result.isSubRecipe).toBe(true)
      expect(result.productWeight).toBe(1000)
    })

    it('applies defaults for missing fields', () => {
      const recipe = {
        name: 'Torta',
        userId: 'user123'
      }

      const result = RecipeAdapter.adapt(recipe)

      expect(result.description).toBe('')
      expect(result.ingredients).toEqual([])
      expect(result.steps).toEqual([])
      expect(result.image).toBe('')
      expect(result.isSubRecipe).toBe(false)
      expect(result.productWeight).toBe(0)
    })

    it('handles recipe with empty arrays', () => {
      const recipe = {
        name: 'Torta',
        userId: 'user123',
        ingredients: [],
        steps: []
      }

      const result = RecipeAdapter.adapt(recipe)

      expect(result.ingredients).toEqual([])
      expect(result.steps).toEqual([])
    })
  })
})
