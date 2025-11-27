import { useTranslation } from 'react-i18next';
import { CustomButton } from '../../common/CustomButton';

export const ConfirmDeleteRecipe = ({ recipe, setDeleteRecipe, handleDelete }) => {
    const { t } = useTranslation();
    return (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header bg-danger">
                        <h5 className="modal-title text-white d-flex">{t('confirmDeleteRecipe.title')}</h5>
                        <button type="button" className="btn-close bg-white" data-bs-dismiss="modal" aria-label="Close" onClick={() => setDeleteRecipe(false)}></button>
                    </div>
                    <div className="modal-body fw-bold">
                        <p>{t('confirmDeleteRecipe.message', { recipe: recipe.name })}</p>
                    </div>
                    <div className="modal-footer bg-danger">
                        <CustomButton
                            type="button"
                            className=" bg-dark text-white"
                            onClick={() => setDeleteRecipe(false)}
                            label={t('common.cancel')}
                        />
                        <CustomButton
                            type="button"
                            className=" bg-light"
                            onClick={handleDelete}
                            label={t('common.delete')}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
