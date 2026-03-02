import React from 'react';
import ReactDOM from 'react-dom';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[var(--background)] border-red-500 border p-10 max-w-lg w-full shadow-2xl relative overflow-hidden fade-up">
                {/* Decorative elements similar to notifications */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-red-500 opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-red-500 opacity-50"></div>

                <div className="flex items-start gap-6 mb-10 text-left">
                    <div className="w-12 h-12 bg-red-500/10 flex items-center justify-center border border-red-500/20">
                        <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
                    </div>
                    <div className="flex-1">
                        <span className="text-[10px] font-black tracking-[0.4em] uppercase text-red-500 block mb-2">
                            {title || 'SYSTEM_CRITICAL_ACTION'}
                        </span>
                        <p className="text-sm font-black tracking-widest uppercase text-[var(--text)] leading-relaxed">
                            {message}
                        </p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-4 border border-[var(--border-strong)] text-[var(--text-muted)] text-[10px] font-black tracking-[0.2em] uppercase hover:bg-[var(--surface-hover)] hover:text-[var(--primary)] transition-all duration-300"
                    >
                        Abort Protocol
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-6 py-4 bg-red-500 text-black text-[10px] font-black tracking-[0.2em] uppercase hover:bg-red-600 transition-all duration-300 transform hover:scale-[1.02]"
                    >
                        Confirm Purge
                    </button>
                </div>

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>,
        document.body
    );
};

export default ConfirmationModal;

