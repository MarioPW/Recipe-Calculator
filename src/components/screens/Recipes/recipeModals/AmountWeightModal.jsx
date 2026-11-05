import { useTranslation } from 'react-i18next';
import { CustomButton } from '../../../common/CustomButton';
import { CustomModal } from '../../../common/CustomModal';

export const AmountWeightModal = ({ handleAmountWeightModal, amount, setAmount, weightPerUnit, setWeightPerUnit, handleSaveAmountWeight, operation }) => {
    const { t } = useTranslation();

    return (
        <CustomModal
            id="amount-weight-modal"
            title={t('amountWeightModal.title')}
            onClose={handleAmountWeightModal}
            footer={
                <>
                    <CustomButton
                        type="button"
                        className="secondary"
                        onClick={handleAmountWeightModal}
                        label={t('common.close')}
                    />
                    <CustomButton
                        type="button"
                        className="primary"
                        onClick={handleSaveAmountWeight}
                        label={operation}
                    />
                </>
            }
        >
            <div className="mb-3">
                <label className="form-label" htmlFor="amount-weight-modal-amount">
                    {t('amountWeightModal.amount')}:
                </label>
                <input
                    id="amount-weight-modal-amount"
                    className="form-control"
                    value={amount}
                    type="number"
                    min="0"
                    onChange={(e) => setAmount(e.target.value)}
                />
            </div>
            <div>
                <label className="form-label" htmlFor="amount-weight-modal-weight-per-unit">
                    {t('amountWeightModal.weightPerUnit')}:
                </label>
                <input
                    id="amount-weight-modal-weight-per-unit"
                    className="form-control"
                    value={weightPerUnit}
                    type="number"
                    min="0"
                    onChange={(e) => setWeightPerUnit(e.target.value)}
                    placeholder={t('amountWeightModal.weightPerUnitPlaceholder')}
                />
            </div>
        </CustomModal>
    )
}
