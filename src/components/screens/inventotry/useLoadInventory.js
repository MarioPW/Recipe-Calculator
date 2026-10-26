import { useState, useCallback } from 'react';

/**
 * useLoadInventory
 *
 * Manages granular selection state for loading a historical inventory record.
 *
 * Selection model:
 * - selectedRows  : Set of item ids whose FULL ROW is selected (all columns)
 * - selectedCols  : Set of column indexes whose FULL COLUMN is selected (all rows)
 * - selectedCells : Map of "itemId:colIndex" whose individual CELL is selected
 *
 * Precedence when merging to load:
 *   A cell is included if ANY of the following is true:
 *     1. Its row is in selectedRows
 *     2. Its col index is in selectedCols
 *     3. Its exact "itemId:colIndex" key is in selectedCells
 */
export const useLoadInventory = () => {
    const [selectedRows, setSelectedRows] = useState(new Set());
    const [selectedCols, setSelectedCols] = useState(new Set());
    const [selectedCells, setSelectedCells] = useState(new Set());

    const reset = useCallback(() => {
        setSelectedRows(new Set());
        setSelectedCols(new Set());
        setSelectedCells(new Set());
    }, []);

    /** Toggle an entire row (all columns for that item) */
    const toggleRow = useCallback((itemId) => {
        setSelectedRows(prev => {
            const next = new Set(prev);
            if (next.has(itemId)) {
                next.delete(itemId);
            } else {
                next.add(itemId);
            }
            return next;
        });
    }, []);

    /** Toggle an entire column (all rows for that section index) */
    const toggleCol = useCallback((colIndex) => {
        setSelectedCols(prev => {
            const next = new Set(prev);
            if (next.has(colIndex)) {
                next.delete(colIndex);
            } else {
                next.add(colIndex);
            }
            return next;
        });
    }, []);

    /** Toggle a single cell (specific row + column) */
    const toggleCell = useCallback((itemId, colIndex) => {
        const key = `${itemId}:${colIndex}`;
        setSelectedCells(prev => {
            const next = new Set(prev);
            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
            }
            return next;
        });
    }, []);

    /** Returns true if a given cell is selected by any of the three mechanisms */
    const isCellSelected = useCallback((itemId, colIndex) => {
        return (
            selectedRows.has(itemId) ||
            selectedCols.has(colIndex) ||
            selectedCells.has(`${itemId}:${colIndex}`)
        );
    }, [selectedRows, selectedCols, selectedCells]);

    const isRowSelected = useCallback((itemId) => selectedRows.has(itemId), [selectedRows]);
    const isColSelected = useCallback((colIndex) => selectedCols.has(colIndex), [selectedCols]);

    const hasSelection = selectedRows.size > 0 || selectedCols.size > 0 || selectedCells.size > 0;

    /**
     * Builds a partial inventory record based on the current selection.
     * ALL items are included; unselected items/cells default to 0.
     * Columns represent count sections; "total" col index = countColumns.length (special).
     * All columns from the original record are preserved.
     * 
     * @param {Object} record historical inventory record
     * @returns {Object} Partial record ready to merge into currentInventory
     */
    const buildPartialRecord = useCallback((record) => {
        const { items = [], countColumns = [] } = record;
        const totalColIndex = countColumns.length; // virtual index for the "Total" column

        const partialItems = items.map((item) => {
            const rowSel = selectedRows.has(item.id);
            // Determine which count indexes to include
            const includedCounts = countColumns.map((_, idx) => {
                return isCellSelected(item.id, idx);
            });
            const includeTotal = isCellSelected(item.id, totalColIndex);

            const anySelected = rowSel || includedCounts.some(Boolean) || includeTotal;

            if (rowSel) {
                // Full row: include everything from the historical record
                return { ...item };
            }

            if (!anySelected) {
                // No selection for this item: include it with 0 counts and 0 stock
                const zeroCounts = Array.isArray(item.counts)
                    ? item.counts.map(() => 0)
                    : countColumns.map(() => 0);
                return {
                    ...item,
                    counts: zeroCounts,
                    stock: 0
                };
            }

            // Partial row: merge only selected counts into zeros, keep all columns
            const baseCounts = Array.isArray(item.counts) ? item.counts : [];
            const newCounts = countColumns.map((_, idx) => {
                if (includedCounts[idx]) {
                    return baseCounts[idx] || 0;
                }
                return 0;
            });

            // Recalculate stock only from included counts
            const newStock = includeTotal
                ? (item.stock || 0)
                : newCounts.reduce((acc, c) => acc + c, 0);

            return {
                ...item,
                counts: newCounts,
                stock: newStock
            };
        });

        return {
            ...record,
            items: partialItems,
            countColumns: countColumns // keep all columns
        };
    }, [selectedRows, selectedCols, selectedCells, isCellSelected]);

    return {
        selectedRows,
        selectedCols,
        selectedCells,
        toggleRow,
        toggleCol,
        toggleCell,
        isCellSelected,
        isRowSelected,
        isColSelected,
        hasSelection,
        buildPartialRecord,
        reset
    };
};