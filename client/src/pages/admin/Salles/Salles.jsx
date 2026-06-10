import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';
import studentService from '../../../services/studentService';
import './Salles.css';
import { MapPin, Plus, Trash2, Edit2, Search, X, Check, AlertTriangle, ArrowRight, Hash, Activity, Filter, ChevronDown, Layers, Users } from 'lucide-react';
import '../../../styles/admin-shared.css';

const Salles = () => {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';
    const [salles, setSalles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSalle, setEditingSalle] = useState(null);
    const [formData, setFormData] = useState({ nom: '', groupIds: [] });
    const [isDeleting, setIsDeleting] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [groups, setGroups] = useState([]);
    const [isGroupDropdownOpen, setIsGroupDropdownOpen] = useState(false);

    const fetchSalles = async () => {
        try {
            const [sallesData, groupsData] = await Promise.all([
                studentService.getSalles(),
                studentService.getGroups()
            ]);
            setSalles(sallesData.salles);
            setGroups(groupsData.groups);
            setLoading(false);
        } catch (err) {
            console.error("FETCH DATA ERROR:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSalles();
    }, []);

    const handleOpenModal = (salle = null) => {
        if (salle) {
            setEditingSalle(salle);
            setFormData({ nom: salle.nom, groupIds: salle.groupIds || [] });
        } else {
            setEditingSalle(null);
            setFormData({ nom: '', groupIds: [] });
        }
        setIsModalOpen(true);
        setIsGroupDropdownOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingSalle) {
                await studentService.updateSalle(editingSalle.id, formData);
            } else {
                await studentService.createSalle(formData);
            }
            setIsModalOpen(false);
            fetchSalles();
        } catch (err) {
            console.error("SUBMIT SALLE ERROR:", err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await studentService.deleteSalle(id);
            setIsDeleting(null);
            fetchSalles();
        } catch (err) {
            console.error("DELETE SALLE ERROR:", err);
        }
    };

    const [flippedCardId, setFlippedCardId] = useState(null);

    const handleFlip = (salle) => {
        if (flippedCardId === salle.id) {
            setFlippedCardId(null);
        } else {
            setFlippedCardId(salle.id);
            setFormData({ nom: salle.nom, groupIds: salle.groupIds || [] });
            setIsGroupDropdownOpen(false);
        }
    };

    const handleUpdate = async (id) => {
        setSubmitting(true);
        try {
            await studentService.updateSalle(id, formData);
            setFlippedCardId(null);
            fetchSalles();
        } catch (err) {
            console.error("UPDATE SALLE ERROR:", err);
        } finally {
            setSubmitting(false);
        }
    };

    const filteredSalles = salles.filter(s => 
        s.nom.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={`salles-container ${isRtl ? 'rtl' : ''}`}>
            
            <div className={`salles-header-section ${isRtl ? 'rtl' : ''}`}>
                <div className="salles-title-wrapper">
                    <h1 className="salles-title">
                        {t('nav.salles_nav')}
                    </h1>
                    <div className={`salles-subtitle-wrapper ${isRtl ? 'rtl' : ''}`}>
                        <div className="pulse-dot"></div>
                        {t('salles.subtitle')}
                    </div>
                </div>

                <div className="salles-actions">
                    <div className="salles-search-wrapper">
                        <Search className={`salles-search-icon ${isRtl ? 'rtl' : 'ltr'}`} />
                        <input
                            type="text"
                            placeholder={t('salles.search_placeholder')}
                            className={`salles-search-input ${isRtl ? 'rtl' : 'ltr'}`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button onClick={() => handleOpenModal()} className="btn-ista btn-add-salle">
                        <Plus className="w-5 h-5" />
                        <span>{t('salles.add_button')}</span>
                    </button>
                </div>
            </div>

            <div className="salles-grid">
                
                <div onClick={() => handleOpenModal()} className="salles-init-card">
                    <div className="salles-init-icon-wrapper">
                        <Plus className="salles-init-icon" />
                    </div>
                    <h3 className="salles-init-title">{t('salles.new_room')}</h3>
                    <p className="salles-init-subtitle">{t('salles.register_room')}</p>
                </div>

                {loading ? (
                    Array(5).fill(0).map((_, i) => (
                        <div key={i} className="salles-loading-card">
                            <div className="salles-loading-icon"></div>
                            <div className="salles-loading-title"></div>
                            <div className="salles-loading-subtitle"></div>
                        </div>
                    ))
                ) : filteredSalles.length > 0 ? (
                    filteredSalles.map((salle) => (
                        <div key={salle.id} className="salles-card-container">
                            <div className={`salles-card-inner ${flippedCardId === salle.id ? 'flipped' : ''}`}>
                                
                                <div className="salles-card-front">
                                    <div className="salles-card-bg-shape"></div>

                                    <div className="salles-card-header">
                                        <div className="salles-card-icon-wrapper">
                                            <MapPin className="salles-card-icon" />
                                        </div>
                                        <div className="salles-card-actions">
                                            <button onClick={() => handleFlip(salle)} className="salles-action-btn edit">
                                                <Edit2 className="salles-action-icon" />
                                            </button>
                                            <button onClick={() => setIsDeleting(salle.id)} className="salles-action-btn delete">
                                                <Trash2 className="salles-action-icon" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="salles-card-content">
                                        <div className="salles-id-wrapper">
                                            <Hash className="salles-id-icon" />
                                            <span className="salles-id-text">{salle.id}</span>
                                        </div>
                                        <h2 className="salles-card-title">
                                            {salle.nom}
                                        </h2>
                                        <div className="salles-status-badge">
                                            <div className="salles-status-row">
                                                <div className="salles-status-dot"></div>
                                                <span className="salles-status-text">{t('salles.available')}</span>
                                            </div>
                                            {salle.groupIds?.length > 0 && (
                                                <>
                                                    <div className="salles-group-list">
                                                        {salle.groupIds.map(gId => (
                                                            <div key={gId} className="salles-group-item">
                                                                <Users className="salles-group-icon" />
                                                                <span className="salles-group-text">{gId}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {salle.lead_formateurs && (
                                                        <div className="salles-lead-formateur">
                                                            <div className="salles-lead-dot"></div>
                                                            <span className="salles-lead-text">{salle.lead_formateurs}</span>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="salles-card-back">
                                    <div className="salles-back-header">
                                        <span className="salles-back-title">{t('salles.update_room')}</span>
                                        <button onClick={() => setFlippedCardId(null)} className="salles-close-btn">
                                            <X className="salles-close-icon" />
                                        </button>
                                    </div>

                                    <div className="salles-back-form ista-scrollbar">
                                        <div className="salles-input-wrapper">
                                            <label className="salles-label">{t('salles.label')}</label>
                                            <input
                                                type="text"
                                                autoFocus
                                                required
                                                className="salles-input"
                                                placeholder={t('salles.placeholder')}
                                                value={formData.nom}
                                                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                            />
                                        </div>

                                        <div className="salles-input-wrapper salles-dropdown-wrapper">
                                            <label className="salles-label">Groupe assigné</label>
                                            <div
                                                onClick={() => setIsGroupDropdownOpen(!isGroupDropdownOpen)}
                                                className="salles-dropdown-toggle"
                                            >
                                                <span className="salles-dropdown-text">
                                                    {formData.groupIds?.length > 0 ? formData.groupIds.join(', ') : 'NON ASSIGNÉ'}
                                                </span>
                                                <ChevronDown className={`salles-dropdown-icon ${isGroupDropdownOpen ? 'open' : ''}`} />
                                            </div>
                                            
                                            {isGroupDropdownOpen && (
                                                <div className="salles-dropdown-menu ista-scrollbar">
                                                    <div 
                                                        className="salles-dropdown-item"
                                                        onClick={() => {
                                                            setFormData({ ...formData, groupIds: [] });
                                                        }}
                                                    >
                                                        DÉSÉLECTIONNER TOUT
                                                    </div>
                                                    {groups.map(g => {
                                                        const isSelected = formData.groupIds?.includes(g.id);
                                                        return (
                                                            <div 
                                                                key={g.id}
                                                                className={`salles-dropdown-item ${isSelected ? 'selected' : 'unselected'}`}
                                                                onClick={() => {
                                                                    const currentIds = Array.isArray(formData.groupIds) ? formData.groupIds : [];
                                                                    const nextIds = isSelected 
                                                                        ? currentIds.filter(id => id !== g.id)
                                                                        : [...currentIds, g.id];
                                                                    setFormData({ ...formData, groupIds: nextIds });
                                                                }}
                                                            >
                                                                <span>{g.id}</span>
                                                                {isSelected ? <Check className="w-3 h-3" /> : <div className="salles-dropdown-checkbox" />}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleUpdate(salle.id)}
                                        disabled={submitting}
                                        className="btn-ista salles-save-btn"
                                    >
                                        {submitting ? (
                                            <Activity className="w-4 h-4 animate-spin text-white" />
                                        ) : (
                                            <>
                                                <Layers className="w-4 h-4" />
                                                <span>{t('salles.save')}</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                            </div>
                        </div>
                    ))
                ) : (
                    <div className="salles-empty-state">
                        <p className="salles-empty-text">{t('salles.no_rooms')}</p>
                    </div>
                )}
            </div>

            {isModalOpen && ReactDOM.createPortal(
                <div className="salles-modal-overlay">
                    <div className="salles-modal-content">
                        
                        <div className="salles-modal-header">
                            <button onClick={() => setIsModalOpen(false)} className="salles-modal-close">
                                <X className="w-6 h-6" />
                            </button>
                            <div className={`salles-modal-header-content ${isRtl ? 'rtl' : ''}`}>
                                <div className="salles-modal-icon-wrapper">
                                    <MapPin className="salles-modal-icon" />
                                </div>
                                <div>
                                    <h2 className="salles-modal-title">
                                        {editingSalle ? t('salles.modal_edit') : t('salles.modal_new')}
                                    </h2>
                                    <p className="salles-modal-subtitle">
                                        {t('salles.modal_admin')}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="salles-modal-form">
                            <div className="salles-modal-grid">
                                <div className="salles-modal-field">
                                    <label className={`salles-modal-label ${isRtl ? 'rtl' : ''}`}>
                                        <MapPin className="salles-modal-label-icon" />
                                        {t('salles.modal_label')}
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className={`salles-modal-input ${isRtl ? 'rtl' : ''}`}
                                        placeholder={t('salles.modal_placeholder')}
                                        value={formData.nom}
                                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                    />
                                </div>
                                <div className="salles-modal-field salles-dropdown-wrapper">
                                    <label className={`salles-modal-label ${isRtl ? 'rtl' : ''}`}>
                                        <Users className="salles-modal-label-icon amber" />
                                        Assigner un Groupe
                                    </label>
                                    <div
                                        onClick={() => setIsGroupDropdownOpen(!isGroupDropdownOpen)}
                                        className={`salles-modal-dropdown ${isRtl ? 'rtl' : ''}`}
                                    >
                                        <span className="salles-modal-dropdown-text">
                                            {formData.groupIds?.length > 0 ? formData.groupIds.join(', ') : 'NON ASSIGNÉ'}
                                        </span>
                                        <ChevronDown className={`salles-modal-dropdown-icon ${isGroupDropdownOpen ? 'open' : ''}`} />
                                    </div>

                                    {isGroupDropdownOpen && (
                                        <div className="salles-modal-dropdown-menu ista-scrollbar">
                                            <div 
                                                className="salles-modal-dropdown-header"
                                                onClick={() => {
                                                    setFormData({ ...formData, groupIds: [] });
                                                }}
                                            >
                                                DÉSÉLECTIONNER TOUT
                                            </div>
                                            {groups.map(g => {
                                                const isSelected = formData.groupIds?.includes(g.id);
                                                return (
                                                    <div 
                                                        key={g.id}
                                                        className={`salles-modal-dropdown-option ${isSelected ? 'selected' : 'unselected'}`}
                                                        onClick={() => {
                                                            const currentIds = Array.isArray(formData.groupIds) ? formData.groupIds : [];
                                                            const nextIds = isSelected 
                                                                ? currentIds.filter(id => id !== g.id)
                                                                : [...currentIds, g.id];
                                                            setFormData({ ...formData, groupIds: nextIds });
                                                        }}
                                                    >
                                                        <span>{g.id}</span>
                                                        {isSelected ? <Check className="w-5 h-5" /> : <div className="salles-modal-checkbox" />}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className={`salles-modal-submit ${submitting ? 'disabled' : 'active'}`}
                            >
                                {submitting ? (
                                    <>
                                        <Activity className="w-5 h-5 animate-spin" />
                                        {t('filiere.sync')}
                                    </>
                                ) : (
                                    <>
                                        {editingSalle ? t('salles.modal_update') : t('salles.modal_save')}
                                        <ArrowRight className={`salles-submit-arrow ${isRtl ? 'rtl' : ''}`} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="salles-modal-footer">
                            <p className="salles-modal-footer-text">GESTION DES ESPACES - OFPPT ISTA</p>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {isDeleting && ReactDOM.createPortal(
                <div className="salles-confirm-modal-wrapper">
                    <div className="salles-confirm-modal">
                        <div className="salles-confirm-icon-wrapper">
                            <AlertTriangle className="salles-confirm-icon" />
                        </div>
                        <h2 className="salles-confirm-title">{t('filiere.delete_title')}</h2>
                        <p className="salles-confirm-msg">
                            {t('filiere.delete_msg')}
                        </p>
                        <div className="salles-confirm-actions">
                            <button onClick={() => setIsDeleting(null)} className="salles-btn-cancel">
                                {t('common.cancel')}
                            </button>
                            <button onClick={() => handleDelete(isDeleting)} className="salles-btn-confirm">
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

export default Salles;
