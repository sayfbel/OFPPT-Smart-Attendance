import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Layers, Plus, Trash2, Edit2, Search, X, Check, AlertTriangle, ArrowRight, Hash, Activity } from 'lucide-react';
import studentService from '../../../services/studentService';
import './Filiere.css';
import '../../../styles/admin-shared.css';

const Filiere = () => {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';
    const [filieres, setFilieres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFiliere, setEditingFiliere] = useState(null);
    const [formData, setFormData] = useState({ nom: '' });
    const [isDeleting, setIsDeleting] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const fetchFilieres = async () => {
        try {
            const res = await studentService.getFilieres();
            setFilieres(res.filieres);
            setLoading(false);
        } catch (err) {
            console.error("FETCH FILIERES ERROR:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFilieres();
    }, []);

    const handleOpenModal = (filiere = null) => {
        if (filiere) {
            setEditingFiliere(filiere);
            setFormData({ nom: filiere.nom });
        } else {
            setEditingFiliere(null);
            setFormData({ nom: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingFiliere) {
                await studentService.updateFiliere(editingFiliere.id, formData);
            } else {
                await studentService.createFiliere(formData);
            }
            setIsModalOpen(false);
            fetchFilieres();
        } catch (err) {
            console.error("SUBMIT FILIERE ERROR:", err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await studentService.deleteFiliere(id);
            setIsDeleting(null);
            fetchFilieres();
        } catch (err) {
            console.error("DELETE FILIERE ERROR:", err);
        }
    };

    const [flippedCardId, setFlippedCardId] = useState(null);

    const handleFlip = (filiere) => {
        if (flippedCardId === filiere.id) {
            setFlippedCardId(null);
        } else {
            setFlippedCardId(filiere.id);
            setFormData({ nom: filiere.nom });
        }
    };

    const handleUpdate = async (id) => {
        setSubmitting(true);
        try {
            await studentService.updateFiliere(id, formData);
            setFlippedCardId(null);
            fetchFilieres();
        } catch (err) {
            console.error("UPDATE FILIERE ERROR:", err);
        } finally {
            setSubmitting(false);
        }
    };

    const filteredFilieres = filieres.filter(f => 
        f.nom.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={`filiere-container ${isRtl ? 'rtl' : ''}`}>
            
             <div className={`filiere-header-section ${isRtl ? 'rtl' : ''}`}>
                <div className="filiere-title-wrapper">
                    <h1 className="filiere-title">
                        {t('nav.filieres_nav')}
                    </h1>
                    <div className={`filiere-subtitle-wrapper ${isRtl ? 'rtl' : ''}`}>
                        <div className="pulse-dot"></div>
                        {t('filiere.subtitle')}
                    </div>
                </div>

                <div className="filiere-actions">
                    <div className="filiere-search-wrapper">
                        <Search className={`filiere-search-icon ${isRtl ? 'rtl' : 'ltr'}`} />
                        <input
                            type="text"
                            placeholder={t('filiere.search_placeholder')}
                            className={`filiere-search-input ${isRtl ? 'rtl' : 'ltr'}`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button onClick={() => handleOpenModal()} className="btn-ista btn-add-filiere">
                        <Plus className="btn-add-icon" />
                        <span>{t('filiere.add_button')}</span>
                    </button>
                </div>
            </div>

            <div className="filiere-grid">
                
                <div onClick={() => handleOpenModal()} className="filiere-init-card">
                    <div className="filiere-init-icon-wrapper">
                        <Plus className="filiere-init-icon" />
                    </div>
                    <h3 className="filiere-init-title">{t('filiere.new_unit')}</h3>
                    <p className="filiere-init-subtitle">{t('filiere.register_specialty')}</p>
                </div>

                {loading ? (
                    Array(5).fill(0).map((_, i) => (
                        <div key={i} className="filiere-loading-card">
                            <div className="filiere-loading-icon"></div>
                            <div className="filiere-loading-title"></div>
                            <div className="filiere-loading-subtitle"></div>
                        </div>
                    ))
                ) : filteredFilieres.length > 0 ? (
                    filteredFilieres.map((filiere) => (
                        <div key={filiere.id} className="filiere-card-container">
                            <div className={`filiere-card-inner ${flippedCardId === filiere.id ? 'flipped' : ''}`}>
                                
                                <div className="filiere-card-front">
                                    <div className="filiere-card-bg-shape"></div>

                                    <div className="filiere-card-header">
                                        <div className="filiere-card-icon-wrapper">
                                            <Layers className="filiere-card-icon" />
                                        </div>
                                        <div className="filiere-card-actions">
                                            <button onClick={() => handleFlip(filiere)} className="filiere-action-btn edit">
                                                <Edit2 className="filiere-action-icon" />
                                            </button>
                                            <button onClick={() => setIsDeleting(filiere.id)} className="filiere-action-btn delete">
                                                <Trash2 className="filiere-action-icon" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="filiere-card-content">
                                        <div className="filiere-id-wrapper">
                                            <Hash className="filiere-id-icon" />
                                            <span className="filiere-id-text">{filiere.id}</span>
                                        </div>
                                        <h2 className="filiere-card-title">
                                            {filiere.nom}
                                        </h2>
                                        <div className="filiere-status-badge">
                                            <div className="filiere-status-dot"></div>
                                            <span className="filiere-status-text">{t('filiere.active_training')}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="filiere-card-back">
                                    <div className="filiere-back-header">
                                        <span className="filiere-back-title">{t('filiere.update_ref')}</span>
                                        <button onClick={() => setFlippedCardId(null)} className="filiere-close-btn">
                                            <X className="filiere-close-icon" />
                                        </button>
                                    </div>

                                    <div className="filiere-back-form">
                                        <div className="admin-header-text">
                                            <label className="filiere-label">{t('filiere.label')}</label>
                                            <textarea
                                                autoFocus
                                                required
                                                rows={3}
                                                className="filiere-textarea ista-scrollbar"
                                                placeholder={t('filiere.placeholder')}
                                                value={formData.nom}
                                                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleUpdate(filiere.id)}
                                        disabled={submitting}
                                        className="btn-ista filiere-save-btn"
                                    >
                                        {submitting ? (
                                            <Activity className="filiere-save-icon animate-spin text-white" />
                                        ) : (
                                            <>
                                                <Layers className="filiere-save-icon" />
                                                <span>{t('filiere.save')}</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                            </div>
                        </div>
                    ))
                ) : (
                    <div className="filiere-empty-state">
                        <div className="filiere-empty-icon-wrapper">
                             <Layers className="filiere-empty-icon" />
                        </div>
                        <p className="filiere-empty-text">{t('filiere.no_ref')}</p>
                    </div>
                )}
            </div>

            {isModalOpen && ReactDOM.createPortal(
                <div className="filiere-modal-overlay">
                    <div className="filiere-modal-content">
                        
                        <div className="filiere-modal-header filiere-header-gradient">
                            <button onClick={() => setIsModalOpen(false)} className="filiere-modal-close">
                                <X className="filiere-modal-close-icon" />
                            </button>
                            <div className={`filiere-modal-header-content ${isRtl ? 'rtl' : ''}`}>
                                <div className="filiere-modal-icon-wrapper">
                                    <Layers className="filiere-modal-icon" />
                                </div>
                                <div>
                                    <h2 className="filiere-modal-title">
                                        {editingFiliere ? t('filiere.modal_edit') : t('filiere.modal_new')}
                                    </h2>
                                    <p className="filiere-modal-subtitle">
                                        {t('filiere.modal_admin')}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="filiere-modal-form">
                            <div className="filiere-modal-label-wrapper">
                                <label className={`filiere-modal-label ${isRtl ? 'rtl' : ''}`}>
                                    <Layers className="filiere-modal-label-icon" />
                                    {t('filiere.modal_label')}
                                </label>
                                <input
                                    type="text"
                                    required
                                    className={`filiere-modal-input ${isRtl ? 'rtl' : ''}`}
                                    placeholder={t('filiere.modal_placeholder')}
                                    value={formData.nom}
                                    onChange={(e) => setFormData({ nom: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className={`filiere-modal-submit ${submitting ? 'disabled' : 'active'}`}
                            >
                                {submitting ? (
                                    <>
                                        <Activity className="filiere-submit-icon animate-spin" />
                                        {t('filiere.sync')}
                                    </>
                                ) : (
                                    <>
                                        {editingFiliere ? t('filiere.modal_update') : t('filiere.modal_save')}
                                        <ArrowRight className={`filiere-submit-arrow ${isRtl ? 'rtl' : ''}`} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="filiere-modal-footer">
                            <p className="filiere-modal-footer-text">{t('filiere.system_tag')}</p>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {isDeleting && ReactDOM.createPortal(
                <div className="filiere-confirm-modal-wrapper">
                    <div className="filiere-confirm-modal">
                        <div className="filiere-confirm-icon-wrapper">
                            <AlertTriangle className="filiere-confirm-icon" />
                        </div>
                        <h2 className="filiere-confirm-title">{t('filiere.delete_title')}</h2>
                        <p className="filiere-confirm-msg">
                            {t('filiere.delete_msg')}
                        </p>
                        <div className="filiere-confirm-actions">
                            <button onClick={() => setIsDeleting(null)} className="filiere-btn-cancel">
                                {t('common.cancel')}
                            </button>
                            <button onClick={() => handleDelete(isDeleting)} className="filiere-btn-confirm">
                                {t('common.confirm')}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default Filiere;
