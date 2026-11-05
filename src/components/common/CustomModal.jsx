/* eslint-disable react/prop-types */
import { useEffect, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { CustomButton } from './CustomButton';

export const CustomModal = ({
  id,
  title,
  onClose,
  size = '',
  centered = false,
  headerActions = null,
  footer = null,
  closeOnBackdrop = true,
  children
}) => {
  const { t } = useTranslation();
  const generatedId = useId();
  const modalId = id || generatedId;
  const titleId = `${modalId}-title`;

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleBackdropClick = (event) => {
    if (closeOnBackdrop && event.target === event.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div
      className="modal fade show d-block"
      id={modalId}
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={handleBackdropClick}
    >
      <div className={`modal-dialog ${size} ${centered ? 'modal-dialog-centered' : ''}`.trim()}>
        <div className="modal-content">
          <div className="modal-header bg-color-main text-white">
            <h5 className="modal-title" id={titleId}>{title}</h5>
            <div className="d-flex align-items-center gap-2">
              {headerActions}
              <CustomButton
                className="light"
                onClick={() => onClose?.()}
                label={
                  <>
                    <i className="bi bi-x-lg" aria-hidden="true"></i>
                    <span className="visually-hidden">{t('common.close')}</span>
                  </>
                }
                title={t('common.close')}
              />
            </div>
          </div>

          {children && <div className="modal-body">{children}</div>}

          {footer && <div className="modal-footer">{footer}</div>}
        </div>
      </div>
    </div>
  );
};
