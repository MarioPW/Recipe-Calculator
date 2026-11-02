import { describe, it, expect, beforeEach, vi } from 'vitest'
import { isRepeated, cleanLocalStorage, checkIngredientsOrder, startNewRecipe, formatNumber, getLocalISOString } from './utils'

describe('utils', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  describe('isRepeated', () => {
    it('returns false if file does not exist in localStorage', () => {
      expect(isRepeated('Harina', 'ingredients')).toBe(false)
    })

    it('returns true if item name already exists', () => {
      const items = [{ name: 'Harina' }, { name: 'Azúcar' }]
      localStorage.setItem('ingredients', JSON.stringify(items))
      expect(isRepeated('Harina', 'ingredients')).toBe(true)
    })

    it('returns false if item name does not exist', () => {
      const items = [{ name: 'Harina' }, { name: 'Azúcar' }]
      localStorage.setItem('ingredients', JSON.stringify(items))
      expect(isRepeated('Sal', 'ingredients')).toBe(false)
    })
  })

  describe('cleanLocalStorage', () => {
    it('removes ingredients, recipeTitle and valuesList', () => {
      localStorage.setItem('ingredients', JSON.stringify([]))
      localStorage.setItem('recipeTitle', 'test')
      localStorage.setItem('valuesList', JSON.stringify([]))
      localStorage.setItem('other', 'keep')

      cleanLocalStorage()

      expect(localStorage.getItem('ingredients')).toBeNull()
      expect(localStorage.getItem('recipeTitle')).toBeNull()
      expect(localStorage.getItem('valuesList')).toBeNull()
      expect(localStorage.getItem('other')).toBe('keep')
    })
  })

  describe('checkIngredientsOrder', () => {
    it('returns the stored order value', () => {
      localStorage.setItem('ingredientsSort', 'name')
      expect(checkIngredientsOrder()).toBe('name')
    })

    it('returns null if not set', () => {
      expect(checkIngredientsOrder()).toBeNull()
    })
  })

  describe('startNewRecipe', () => {
    it('cleans localStorage if recipe element has no children', () => {
      const recipe = document.createElement('div')
      recipe.id = 'recipe'
      document.body.appendChild(recipe)

      localStorage.setItem('ingredients', JSON.stringify([]))
      localStorage.setItem('recipeTitle', 'test')
      localStorage.setItem('valuesList', JSON.stringify([]))

      startNewRecipe()

      expect(localStorage.getItem('ingredients')).toBeNull()
      expect(localStorage.getItem('recipeTitle')).toBeNull()
      expect(localStorage.getItem('valuesList')).toBeNull()

      document.body.removeChild(recipe)
    })

    it('does nothing if recipe element has children', () => {
      const recipe = document.createElement('div')
      recipe.id = 'recipe'
      const child = document.createElement('div')
      recipe.appendChild(child)
      document.body.appendChild(recipe)

      localStorage.setItem('ingredients', JSON.stringify([{ name: 'test' }]))

      startNewRecipe()

      expect(localStorage.getItem('ingredients')).not.toBeNull()

      document.body.removeChild(recipe)
    })
  })

  describe('formatNumber', () => {
    it('returns "0" for null', () => {
      expect(formatNumber(null)).toBe('0')
    })

    it('returns "0" for undefined', () => {
      expect(formatNumber(undefined)).toBe('0')
    })

    it('returns "0" for empty string', () => {
      expect(formatNumber('')).toBe('0')
    })

    it('formats number with es-CO locale', () => {
      const result = formatNumber(1234.56)
      expect(result).toBe('1.234,56')
    })

    it('formats number with up to 4 decimal places', () => {
      const result = formatNumber(1.23456)
      expect(result).toBe('1,2346')
    })

    it('parses string with comma as decimal separator', () => {
      expect(formatNumber('1234,56')).toBe('1.234,56')
    })

    it('parses string with dot as decimal separator', () => {
      expect(formatNumber('1234.56')).toBe('1.234,56')
    })

    it('returns original value if string is not a valid number', () => {
      expect(formatNumber('abc')).toBe('abc')
    })

    it('trims whitespace from string', () => {
      expect(formatNumber('  10,5  ')).toBe('10,5')
    })
  })

  describe('getLocalISOString', () => {
    it('formats a date to local ISO string without timezone', () => {
      const date = new Date(2024, 0, 15, 10, 30, 45) // Jan 15 2024 10:30:45
      expect(getLocalISOString(date)).toBe('2024-01-15T10:30:45')
    })

    it('pads single digits with zeros', () => {
      const date = new Date(2024, 4, 5, 3, 7, 9) // May 5 2024 03:07:09
      expect(getLocalISOString(date)).toBe('2024-05-05T03:07:09')
    })

    it('uses current date if no argument provided', () => {
      const result = getLocalISOString()
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)
    })

    it('falls back to the current date for invalid input', () => {
      const result = getLocalISOString('invalid')
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)
    })
  })
})
