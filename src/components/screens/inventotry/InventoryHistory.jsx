import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMainContext } from '../../../context/MainContext';
import { SecondaryNavbar } from '../../common/SecondaryNavbar';
import { CustomTable } from '../../common/CustomTable';
import { CustomButton } from '../../common/CustomButton';
import { Spinner } from '../../common/Spinner';
import { formatNumber } from '../../../utilities/utils';
import { useLoadInventory } from './useLoadInventory';

// ─── Color tokens ────────────────────────────────────────────────────────────
const SEL_ROW = 'table-success';         // entire row selected
const SEL_COL = 'table-primary';         // entire col selected
const SEL_CELL = 'table-warning';         // individual cell selected
const SEL_HEADER_COL = 'bg-primary text-white';
const SEL_HEADER_ROW = 'bg-success text-white';   // "Ref"/"Item" header when ≥1 row selected

// ─── Inline style for the clickable row header cell ──────────────────────────
const rowToggleStyle = { cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' };
const colToggleStyle = { cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' };
const cellStyle = { cursor: 'pointer', userSelect: 'none' };

export const InventoryHistory = ({ onBack, onLoadInventory }) => {
    const { t } = useTranslation();
    const { inventoryService } = useMainContext();

    const [historyList, setHistoryList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const {
        toggleRow, toggleCol, toggleCell,
        isCellSelected, isRowSelected, isColSelected,
        hasSelection, buildPartialRecord, reset
    } = useLoadInventory();

    // ── Data fetching ─────────────────────────────────────────────────────────
    const fetchHistory = async () => {
        setLoading(true);
        const inventories = await inventoryService.getAllInventories();
        setHistoryList(inventories);
        setLoading(false);
    };

    useEffect(() => { fetchHistory(); }, []);

    // Reset selections whenever a new record is opened
    const openRecord = (record) => {
        reset();
        setSelectedRecord(record);
    };

    // ── Delete ────────────────────────────────────────────────────────────────
    const handleDelete = async (id) => {
        if (confirm(t('inventory.deleteConfirm') || '¿Estás seguro de que deseas eliminar este registro de inventario?')) {
            const success = await inventoryService.deleteInventory(id);
            if (success) fetchHistory();
        }
    };

    // ── Date formatter ────────────────────────────────────────────────────────
    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        try {
            const normalized = typeof dateStr === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)
                ? dateStr.replace(/-/g, '/')
                : dateStr;
            const d = new Date(normalized);
            if (isNaN(d.getTime())) return dateStr;
            return d.toLocaleString('es-CO', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit', hour12: true
            });
        } catch { return dateStr; }
    };

    // ── Load handler ──────────────────────────────────────────────────────────
    const handleLoadFull = () => {
        if (!selectedRecord) return;
        const rec = selectedRecord;

        // Cerramos el modal primero para liberar el DOM antes de actualizar estados globales
        setSelectedRecord(null);

        // Un pequeño retraso de un tick o ejecución directa controlada asegura que React monte limpia la tabla
        setTimeout(() => {
            onLoadInventory(rec);
        }, 0);
    };

    const handleLoadSelection = () => {
        if (!selectedRecord || !hasSelection) return;
        const partial = buildPartialRecord(selectedRecord);

        setSelectedRecord(null);

        setTimeout(() => {
            onLoadInventory(partial);
        }, 0);
    };

    // ── List table (unchanged look) ───────────────────────────────────────────
    const tableData = {
        title: t('inventory.historyTitle') || 'Historial de Inventarios',
        tableData: historyList.map((record) => ({
            [t('inventory.creationDate') || 'Fecha de creación']: (
                <button
                    type="button"
                    className="btn btn-link p-0 text-decoration-none text-start"
                    onClick={() => openRecord(record)}
                    title={t('common.view') || 'Ver'}
                >
                    {formatDate(record.creationDate || record.createdAt)}
                </button>
            ),
            [t('myIngredients.title') || 'Productos']: record.items ? record.items.length : 0,
            [t('inventory.count') || 'Conteos']: record.countColumns ? record.countColumns.length : 0,
            [t('common.actions') || 'Acciones']: (
                <div className="d-flex gap-2">
                    {onLoadInventory && (
                        <CustomButton
                            className="success"
                            onClick={() => onLoadInventory(record)}
                            label={<i className="bi bi-download" />}
                            title={t('common.load') || 'Cargar'}
                        />
                    )}
                    <CustomButton
                        className="danger"
                        onClick={() => handleDelete(record.id)}
                        label={<i className="bi bi-trash" />}
                        title={t('common.delete') || 'Eliminar'}
                    />
                </div>
            )
        }))
    };

    // ── Interactive selection table ───────────────────────────────────────────
    const renderSelectionTable = () => {
        if (!selectedRecord) return null;

        const items = selectedRecord.items || [];
        const cols = selectedRecord.countColumns || [];
        const totalColIdx = cols.length; // virtual index for the Total column

        const anyRowSel = items.some(item => isRowSelected(item.id));

        return (
            <div className="table-responsive">
                <table className="table table-light table-striped text-nowrap mb-0">
                    <thead>
                        <tr>
                            {/* Ref header – clicking does nothing special (row toggled by row cell) */}
                            <th className={`p-1 ${anyRowSel ? SEL_HEADER_ROW : ''}`}>
                                {t('inventory.ref')}
                            </th>

                            {/* Item header */}
                            <th className={`p-1 ${anyRowSel ? SEL_HEADER_ROW : ''}`}>
                                {t('inventory.item')}
                            </th>

                            {/* Count column headers – click to select whole column */}
                            {cols.map((col, colIdx) => (
                                <th
                                    key={col.id || colIdx}
                                    className={`p-1 ${isColSelected(colIdx) ? SEL_HEADER_COL : ''}`}
                                    style={colToggleStyle}
                                    onClick={() => toggleCol(colIdx)}
                                    title={t('inventory.selectColumn') || 'Seleccionar columna'}
                                >
                                    {col.name}
                                    {isColSelected(colIdx) && (
                                        <i className="bi bi-check2 ms-1" />
                                    )}
                                </th>
                            ))}

                            {/* Total column header – click to select all totals */}
                            <th
                                className={`p-1 ${isColSelected(totalColIdx) ? SEL_HEADER_COL : ''}`}
                                style={colToggleStyle}
                                onClick={() => toggleCol(totalColIdx)}
                                title={t('inventory.selectColumn') || 'Seleccionar columna total'}
                            >
                                {t('inventory.total')}
                                {isColSelected(totalColIdx) && (
                                    <i className="bi bi-check2 ms-1" />
                                )}
                            </th>
                        </tr>
                    </thead>

                    <tbody className="table-group-divider">
                        {items.map((item) => {
                            const rowSel = isRowSelected(item.id);
                            const rowClass = rowSel ? SEL_ROW : '';

                            return (
                                <tr key={item.id} className={rowClass}>
                                    {/* Ref cell – click to toggle entire row */}
                                    <td
                                        className={`p-1 fw-semibold ${rowSel ? SEL_ROW : ''}`}
                                        style={rowToggleStyle}
                                        onClick={() => toggleRow(item.id)}
                                        title={t('inventory.selectRow') || 'Seleccionar fila'}
                                    >
                                        {item.reference}
                                        {rowSel && <i className="bi bi-check2 ms-1" />}
                                    </td>

                                    {/* Item name cell – also toggles the row */}
                                    <td
                                        className={`p-1 ${rowSel ? SEL_ROW : ''}`}
                                        style={rowToggleStyle}
                                        onClick={() => toggleRow(item.id)}
                                        title={t('inventory.selectRow') || 'Seleccionar fila'}
                                    >
                                        {item.name}
                                    </td>

                                    {/* Count cells – click to toggle individual cell */}
                                    {cols.map((col, colIdx) => {
                                        const colSel = isColSelected(colIdx);
                                        const cellSel = !rowSel && !colSel && isCellSelected(item.id, colIdx);
                                        const cls = rowSel ? SEL_ROW : colSel ? SEL_COL : cellSel ? SEL_CELL : '';
                                        return (
                                            <td
                                                key={col.id || colIdx}
                                                className={`p-1 ${cls}`}
                                                style={cellStyle}
                                                onClick={() => !rowSel && !colSel && toggleCell(item.id, colIdx)}
                                                title={t('inventory.selectCell') || 'Seleccionar celda'}
                                            >
                                                {formatNumber(item.counts?.[colIdx] || 0)}
                                            </td>
                                        );
                                    })}

                                    {/* Total cell */}
                                    {(() => {
                                        const colSel = isColSelected(totalColIdx);
                                        const cellSel = !rowSel && !colSel && isCellSelected(item.id, totalColIdx);
                                        const cls = rowSel ? SEL_ROW : colSel ? SEL_COL : cellSel ? SEL_CELL : '';
                                        return (
                                            <td
                                                className={`p-1 ${cls}`}
                                                style={cellStyle}
                                                onClick={() => !rowSel && !colSel && toggleCell(item.id, totalColIdx)}
                                                title={t('inventory.selectCell') || 'Seleccionar celda'}
                                            >
                                                {formatNumber(item.stock || 0)} {item.unitOfMeasure || ''}
                                            </td>
                                        );
                                    })()}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* Selection legend */}
                <div className="d-flex flex-wrap gap-3 px-1 pt-2 pb-1 small text-muted border-top">
                    <span>
                        <span className={`badge ${SEL_HEADER_ROW} me-1`}>&nbsp;</span>
                        {t('inventory.legendRow') || 'Clic en Ref / Nombre → fila completa'}
                    </span>
                    <span>
                        <span className={`badge ${SEL_HEADER_COL} me-1`}>&nbsp;</span>
                        {t('inventory.legendCol') || 'Clic en encabezado de sección → columna completa'}
                    </span>
                    <span>
                        <span className="badge bg-warning text-dark me-1">&nbsp;</span>
                        {t('inventory.legendCell') || 'Clic en celda de conteo → valor individual'}
                    </span>
                </div>
            </div>
        );
    };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <>
            <SecondaryNavbar
                title={t('inventory.historyTitle') || 'Historial de Inventarios'}
                collapseButtonText={t('common.actions')}
                collapseButtonId="inventoryHistoryNavbarCollapse"
            >
                <CustomButton
                    className="light"
                    onClick={onBack}
                    label={`← ${t('myRecipe.goBack') || 'Volver al Inventario'}`}
                />
            </SecondaryNavbar>

            {loading ? (
                <Spinner />
            ) : historyList.length > 0 ? (
                <div className="container p-0">
                    <div className="table-responsive">
                        <CustomTable {...tableData} className="table table-light table-striped text-nowrap" />
                    </div>
                </div>
            ) : (
                <div className="text-center my-5 fs-5 text-muted">
                    {t('inventory.noHistory') || 'No hay registros de inventario guardados.'}
                </div>
            )}

            {/* ── Detail / selection modal ── */}
            {selectedRecord && (
                <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable" role="document">
                        <div className="modal-content border shadow">

                            {/* Header */}
                            <div className="modal-header bg-color-main text-light">
                                <h5 className="modal-title">
                                    <i className="bi bi-clock-history me-2" />
                                    {t('inventory.stockInventory')} ({formatDate(selectedRecord.creationDate || selectedRecord.createdAt)})
                                </h5>
                                <button
                                    type="button"
                                    className="bg-light btn-close"
                                    onClick={() => setSelectedRecord(null)}
                                />
                            </div>

                            {/* Body – interactive table */}
                            <div className="modal-body p-2">
                                <p className="text-muted small mb-2 px-1">
                                    <i className="bi bi-info-circle me-1" />
                                    {t('inventory.selectionHint') || 'Selecciona filas, columnas o celdas individuales para cargar solo esa parte del inventario. Sin selección, se carga el inventario completo.'}
                                </p>
                                {renderSelectionTable()}
                            </div>

                            {/* Footer */}
                            <div className="modal-footer justify-content-between flex-wrap gap-2">
                                <div className="d-flex gap-2 flex-wrap">
                                    {/* Load full */}
                                    {onLoadInventory && (
                                        <button
                                            type="button"
                                            className="btn btn-success"
                                            onClick={handleLoadFull}
                                        >
                                            <i className="bi bi-download me-1" />
                                            {t('inventory.loadFull') || 'Cargar completo'}
                                        </button>
                                    )}

                                    {/* Load selection (only enabled when something is selected) */}
                                    {onLoadInventory && (
                                        <button
                                            type="button"
                                            className="btn btn-warning text-dark"
                                            onClick={handleLoadSelection}
                                            disabled={!hasSelection}
                                            title={hasSelection ? '' : (t('inventory.noSelection') || 'Selecciona al menos una fila, columna o celda')}
                                        >
                                            <i className="bi bi-ui-checks me-1" />
                                            {t('inventory.loadSelection') || 'Cargar selección'}
                                        </button>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setSelectedRecord(null)}
                                >
                                    {t('common.close') || 'Cerrar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
