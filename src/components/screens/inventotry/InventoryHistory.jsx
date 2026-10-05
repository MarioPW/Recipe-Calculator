import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMainContext } from '../../../context/MainContext';
import { SecondaryNavbar } from '../../common/SecondaryNavbar';
import { CustomTable } from '../../common/CustomTable';
import { CustomButton } from '../../common/CustomButton';
import { Spinner } from '../../common/Spinner';
import { formatNumber } from '../../../utilities/utils';

export const InventoryHistory = ({ onBack, onLoadInventory }) => {
    const { t } = useTranslation();
    const { inventoryService } = useMainContext();
    const [historyList, setHistoryList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const fetchHistory = async () => {
        setLoading(true);
        const inventories = await inventoryService.getAllInventories();
        setHistoryList(inventories);
        setLoading(false);
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleDelete = async (id) => {
        if (confirm(t('inventory.deleteConfirm') || '¿Estás seguro de que deseas eliminar este registro de inventario?')) {
            const success = await inventoryService.deleteInventory(id);
            if (success) {
                fetchHistory();
            }
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';

        try {
            const normalizedInput = typeof dateStr === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)
                ? dateStr.replace(/-/g, '/')
                : dateStr;

            const d = new Date(normalizedInput);

            if (isNaN(d.getTime())) return dateStr;

            // 'es-CO' fuerza estrictamente el formato DD/MM/YYYY
            return d.toLocaleString('es-CO', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } catch (e) {
            return dateStr;
        }
    };

    const tableData = {
        title: t('inventory.historyTitle') || 'Historial de Inventarios',
        tableData: historyList.map((record) => ({
            [t('inventory.creationDate') || 'Fecha de creación']: formatDate(record.creationDate || record.createdAt),
            [t('myIngredients.title') || 'Productos']: record.items ? record.items.length : 0,
            [t('inventory.count') || 'Conteos']: record.countColumns ? record.countColumns.length : 0,
            [t('common.actions') || 'Acciones']: (
                <div className="d-flex gap-2">
                    <CustomButton
                        className="info"
                        onClick={() => setSelectedRecord(record)}
                        label={<i className="bi bi-eye"></i>}
                        title={t('common.view') || 'Ver'}
                    />
                    {onLoadInventory && (
                        <CustomButton
                            className="success"
                            onClick={() => onLoadInventory(record)}
                            label={<i className="bi bi-download"></i>}
                            title={t('common.load') || 'Cargar'}
                        />
                    )}
                    <CustomButton
                        className="danger"
                        onClick={() => handleDelete(record.id)}
                        label={<i className="bi bi-trash"></i>}
                        title={t('common.delete') || 'Eliminar'}
                    />
                </div>
            )
        }))
    };

    const modalTableData = selectedRecord
        ? {
            title: `${t('inventory.stockInventory')} - ${formatDate(selectedRecord.creationDate || selectedRecord.createdAt)}`,
            tableData: (selectedRecord.items || []).map((item) => {
                const row = {
                    [t('inventory.ref') || 'Ref']: item.reference,
                    [t('inventory.item') || 'Producto']: item.name,
                };
                (selectedRecord.countColumns || []).forEach((col, idx) => {
                    row[col.name || `Sección ${idx + 1}`] = formatNumber(item.counts?.[idx] || 0);
                });
                row[t('inventory.total') || 'Total'] = `${formatNumber(item.stock || 0)} ${item.unitOfMeasure || ''}`;
                return row;
            })
        }
        : null;

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

            {/* Modal to view detail snapshot of selected inventory */}
            {selectedRecord && modalTableData && (
                <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                        <div className="modal-content border shadow">
                            <div className="modal-header bg-color-main text-light">
                                <h5 className="modal-title">
                                    <i className="bi bi-clock-history me-2"></i>
                                    {t('inventory.stockInventory')} ({formatDate(selectedRecord.creationDate || selectedRecord.createdAt)})
                                </h5>
                                <button
                                    type="button"
                                    className="bg-light btn-close"
                                    onClick={() => setSelectedRecord(null)}
                                />
                            </div>
                            <div className="modal-body table-responsive">
                                <CustomTable {...modalTableData} className="table table-light table-striped text-nowrap" />
                            </div>
                            <div className="modal-footer justify-content-between">
                                {onLoadInventory && (
                                    <CustomButton
                                        className="success"
                                        onClick={() => {
                                            const rec = selectedRecord;
                                            setSelectedRecord(null);
                                            onLoadInventory(rec);
                                        }}
                                        label={t('common.load') || 'Cargar este inventario'}
                                    />
                                )}
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
