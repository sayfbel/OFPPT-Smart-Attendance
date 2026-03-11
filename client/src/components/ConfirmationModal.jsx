import React from 'react';
import ReactDOM from 'react-dom';
import { AlertTriangle, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    const { t } = useTranslation();
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white rounded-[40px] p-10 max-w-lg w-full shadow-2xl relative overflow-hidden fade-up border border-slate-100">
                {/* Accent line */}
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-red-500"></div>

                <div className="flex flex-col items-center text-center gap-6 mb-10">
                    <div className="w-20 h-20 bg-red-50 rounded-[24px] flex items-center justify-center border border-red-100">
                        <AlertTriangle className="w-10 h-10 text-red-500" />
                    </div>
                    <div className="space-y-3">
                        <span className="text-[10px] font-black tracking-[0.4em] uppercase text-red-500 block">
                            {title || 'ACTION CRITIQUE'}
                        </span>
                        <h3 className="text-xl font-black italic text-[var(--secondary)] uppercase tracking-tight">
                            {message}
                        </h3>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 px-8 py-5 border border-slate-100 rounded-2xl text-slate-400 text-[10px] font-black tracking-widest uppercase hover:bg-slate-50 hover:text-[var(--secondary)] transition-all duration-300"
                    >
                        {t('common.cancel')}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-8 py-5 bg-red-500 text-white rounded-2xl text-[10px] font-black tracking-widest uppercase hover:bg-red-600 transition-all duration-300 shadow-xl shadow-red-500/20 active:scale-95"
                    >
                        {t('common.confirm')}
                    </button>
                </div>

                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 text-slate-300 hover:text-[var(--secondary)] transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>
        </div>,
        document.body
    );
};

export default ConfirmationModal;
