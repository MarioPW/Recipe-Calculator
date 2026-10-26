import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLoadInventory } from './useLoadInventory'

describe('useLoadInventory - buildPartialRecord', () => {
  it('preserves all columns and zeros unselected values when selecting a single cell', () => {
    const { result } = renderHook(() => useLoadInventory())

    const record = {
      items: [
        { id: '1', name: 'Harina', reference: '001', unitOfMeasure: 'kg', counts: [10, 20], stock: 30 },
        { id: '2', name: 'Azúcar', reference: '002', unitOfMeasure: 'kg', counts: [5, 15], stock: 20 },
      ],
      countColumns: [
        { id: 1, name: 'Sección 1' },
        { id: 2, name: 'Sección 2' },
      ]
    }

    act(() => {
      result.current.toggleCell('1', 1)
    })

    const partial = result.current.buildPartialRecord(record)

    expect(partial.countColumns).toHaveLength(2)
    expect(partial.items[0].counts).toEqual([0, 20])
    expect(partial.items[0].stock).toBe(20)
    expect(partial.items[1].counts).toEqual([0, 0])
    expect(partial.items[1].stock).toBe(0)
  })

  it('preserves all columns when selecting an entire column', () => {
    const { result } = renderHook(() => useLoadInventory())

    const record = {
      items: [
        { id: '1', name: 'Harina', counts: [10, 20], stock: 30 },
        { id: '2', name: 'Azúcar', counts: [5, 15], stock: 20 },
      ],
      countColumns: [
        { id: 1, name: 'Sección 1' },
        { id: 2, name: 'Sección 2' },
      ]
    }

    act(() => {
      result.current.toggleCol(0)
    })

    const partial = result.current.buildPartialRecord(record)

    expect(partial.countColumns).toHaveLength(2)
    expect(partial.items[0].counts).toEqual([10, 0])
    expect(partial.items[0].stock).toBe(10)
    expect(partial.items[1].counts).toEqual([5, 0])
    expect(partial.items[1].stock).toBe(5)
  })

  it('loads full row when row is selected', () => {
    const { result } = renderHook(() => useLoadInventory())
    const record = {
      items: [{ id: '1', counts: [1, 2], stock: 3 }],
      countColumns: [{ id: 1, name: 'Sección 1' }, { id: 2, name: 'Sección 2' }]
    }

    act(() => {
      result.current.toggleRow('1')
    })

    const partial = result.current.buildPartialRecord(record)
    expect(partial.countColumns).toHaveLength(2)
    expect(partial.items[0].counts).toEqual([1, 2])
    expect(partial.items[0].stock).toBe(3)
  })

  it('preserves all columns with zeros when no selection is made', () => {
    const { result } = renderHook(() => useLoadInventory())

    const record = {
      items: [
        { id: '1', name: 'Harina', counts: [10, 20, 30], stock: 60 },
      ],
      countColumns: [
        { id: 1, name: 'Sección 1' },
        { id: 2, name: 'Sección 2' },
        { id: 3, name: 'Sección 3' },
      ]
    }

    const partial = result.current.buildPartialRecord(record)

    expect(partial.countColumns).toHaveLength(3)
    expect(partial.items[0].counts).toEqual([0, 0, 0])
    expect(partial.items[0].stock).toBe(0)
  })

  it('sums only selected counts when total column is not selected', () => {
    const { result } = renderHook(() => useLoadInventory())

    const record = {
      items: [
        { id: '1', counts: [10, 20], stock: 30 },
      ],
      countColumns: [
        { id: 1, name: 'Sección 1' },
        { id: 2, name: 'Sección 2' },
      ]
    }

    act(() => {
      result.current.toggleCell('1', 0)
    })

    const partial = result.current.buildPartialRecord(record)

    expect(partial.items[0].counts).toEqual([10, 0])
    expect(partial.items[0].stock).toBe(10)
  })

  it('keeps original stock when total column is selected', () => {
    const { result } = renderHook(() => useLoadInventory())

    const record = {
      items: [
        { id: '1', counts: [10, 20], stock: 30 },
      ],
      countColumns: [
        { id: 1, name: 'Sección 1' },
        { id: 2, name: 'Sección 2' },
      ]
    }

    act(() => {
      result.current.toggleCell('1', 2) // totalColIndex = 2
    })

    const partial = result.current.buildPartialRecord(record)

    expect(partial.items[0].counts).toEqual([0, 0])
    expect(partial.items[0].stock).toBe(30)
  })
})
