import React from 'react';
import ReactDOM from 'react-dom';
import { AlertTriangle, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './ConfirmationModal.css';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="confirmation-modal-overlay">
            <div className={`confirmation-modal-content ${isRtl ? 'rtl' : ''}`}>
                {/* Accent line */}
                <div className="confirmation-modal-accent-line"></div>

                <div className="confirmation-modal-header">
                    <div className="confirmation-modal-icon-wrapper">
                        <AlertTriangle className="confirmation-modal-icon" />
                    </div>
                    <div className="confirmation-modal-title-group">
                        <span className="confirmation-modal-title-tag">
                            {title || 'ACTION CRITIQUE'}
                        </span>
                        <h3 className="confirmation-modal-message">
                            {message}
                        </h3>
                    </div>
                </div>

                <div className={`confirmation-modal-actions ${isRtl ? 'rtl' : ''}`}>
                    <button
                        onClick={onClose}
                        className="confirmation-modal-btn-cancel"
                    >
                        {t('common.cancel')}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="confirmation-modal-btn-confirm"
                    >
                        {t('common.confirm')}
                    </button>
                </div>

                <button
                    onClick={onClose}
                    className="confirmation-modal-close-btn"
                >
                    <X className="confirmation-modal-close-icon" />
                </button>
            </div>
        </div>,
        document.body
    );
};

export default ConfirmationModal;
