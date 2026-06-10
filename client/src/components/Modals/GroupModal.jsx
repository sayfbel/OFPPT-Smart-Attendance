import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, CheckSquare, Square, ChevronDown, BookOpen, UserCheck, Hash, Layers, ArrowLeft, Trash2 } from 'lucide-react';
import axios from 'axios';
import { useNotification } from '../../hooks/useNotification';
import { useTranslation } from 'react-i18next';
import ConfirmationModal from './ConfirmationModal';
import './GroupModal.css';

const GroupModal = ({ isOpen, onClose, newGroup, setNewGroup, handleAddGroup, formateurs = [], groups = [], isEditing = false }) => {
    const { addNotification } = useNotification();
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';

    const [isAnneeDropdownOpen, setIsAnneeDropdownOpen] = useState(false);
    const [isFiliereDropdownOpen, setIsFiliereDropdownOpen] = useState(false);
    const [isSalleDropdownOpen, setIsSalleDropdownOpen] = useState(false);
    const [isFormateurDropdownOpen, setIsFormateurDropdownOpen] = useState(false);
    const [isFiliereAutre, setIsFiliereAutre] = useState(false);
    const [deleteModalInfo, setDeleteModalInfo] = useState({ isOpen: false, type: '', id: null, message: '' });


    // API Data
    const [availableFilieres, setAvailableFilieres] = useState([]);
    const [availableSalles, setAvailableSalles] = useState([]);
    const [loading, setLoading] = useState(false);

    // Custom Input Mode (Alternative to selecting from API)
    const [customFiliere, setCustomFiliere] = useState({ nom: '' });

    const anneesScolaires = ['2023/2024', '2024/2025', '2025/2026', '2026/2027', '2027/2028'];



    useEffect(() => {
        if (isOpen) {
            fetchInfrastructure();
        }
    }, [isOpen]);



    const fetchInfrastructure = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const [fRes, sRes] = await Promise.all([
                axios.get('/api/admin/filieres', config),
                axios.get('/api/admin/salles', config)
            ]);
 
            setAvailableFilieres(fRes.data.filieres || []);
            setAvailableSalles(sRes.data.salles || []);
        } catch (error) {
            console.error('Error fetching infrastructure:', error);
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        const { type, id } = deleteModalInfo;
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            if (type === 'filiere') {
                await axios.delete(`/api/admin/filieres/${id}`, config);
                setAvailableFilieres(prev => prev.filter(f => f.id !== id));
                if (newGroup.filiereId === id) setNewGroup(prev => ({ ...prev, filiereId: '' }));
            }
        } catch (error) {
            console.error('Error deleting:', error);
            addNotification(`Erreur: La ${type} est probablement liée à un groupe ou une autre entité.`, 'error');
        } finally {
            setDeleteModalInfo({ isOpen: false, type: '', id: null, message: '' });
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        let finalGroupData = { ...newGroup };

        // 1. Client-side duplicate check
        if (!isEditing && groups.some(g => g.id.toUpperCase() === finalGroupData.id.toUpperCase())) {
            addNotification("Ce code de groupe existe déjà.", "error");
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            if (isFiliereAutre && customFiliere.nom) {
                const resF = await axios.post('/api/admin/filieres', customFiliere, config);
                finalGroupData.filiereId = resF.data.id;
                setAvailableFilieres(prev => [...prev, resF.data]);
                setIsFiliereAutre(false);
            }

            if (!finalGroupData.filiereId && !isFiliereAutre) {
                addNotification("Veuillez sélectionner une filière.", "error");
                setLoading(false);
                return;
            }

            await handleAddGroup(null, finalGroupData);

        } catch (error) {
            console.error('Error during creation:', error);
            addNotification(error.response?.data?.message || "Erreur lors de l'enregistrement", "error");
        } finally {
            setLoading(false);
        }
    };

    const selectedFiliereNom = availableFilieres.find(f => Number(f.id) === Number(newGroup.filiereId))?.nom;

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="group-modal-overlay">
            <div className="group-modal-content">

                {/* Header */}
                <div className="group-modal-header">
                    <button onClick={onClose} className="group-modal-close-btn">
                        <X className="group-modal-icon" />
                    </button>
                    <div className={`group-modal-header-info ${isRtl ? 'rtl' : ''}`}>
                        <div className="group-modal-header-icon-wrapper">
                            <BookOpen className="group-modal-header-icon" />
                        </div>
                        <div>
                            <h2 className="group-modal-title">
                                {isEditing ? t('groups.update_title') : t('groups.init_title')}
                            </h2>
                            <p className="group-modal-subtitle">
                                {t('groups.init_subtitle')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleFormSubmit} className="group-modal-form">
                    <div className="group-modal-grid">
                        <div className="group-modal-field">
                            <label className="group-modal-label">{t('modals.group.group_code')}</label>
                            <input
                                type="text"
                                required
                                value={newGroup.id}
                                onChange={e => setNewGroup({ ...newGroup, id: e.target.value.toUpperCase() })}
                                placeholder="EX: DEV101"
                                className="group-modal-input"
                            />
                        </div>

                        <div className="group-modal-field">
                            <label className="group-modal-label">{t('modals.group.filiere')}</label>
                            {!isFiliereAutre ? (
                                <>
                                    <div
                                        onClick={() => setIsFiliereDropdownOpen(!isFiliereDropdownOpen)}
                                        className="group-modal-dropdown-toggle"
                                    >
                                        <div className="group-modal-dropdown-info">
                                            <BookOpen className="group-modal-dropdown-icon" />
                                            <span className="group-modal-dropdown-text">
                                                {selectedFiliereNom || t('modals.group.select')}
                                            </span>
                                        </div>
                                        <ChevronDown className={`group-modal-chevron ${isFiliereDropdownOpen ? 'open' : ''}`} />
                                    </div>

                                    {isFiliereDropdownOpen && (
                                        <div className="group-modal-dropdown-menu scrollable">
                                            {availableFilieres.map(f => (
                                                <div
                                                    key={f.id}
                                                    className={`group-modal-dropdown-item ${Number(newGroup.filiereId) === Number(f.id) ? 'selected' : ''}`}
                                                    onClick={() => {
                                                        setNewGroup({ ...newGroup, filiereId: f.id });
                                                        setIsFiliereDropdownOpen(false);
                                                    }}
                                                >
                                                    <span className={`group-modal-item-text ${Number(newGroup.filiereId) === Number(f.id) ? 'selected' : 'unselected'}`}>
                                                        {f.nom}
                                                    </span>
                                                    <div className="group-modal-item-actions">
                                                        {Number(newGroup.filiereId) === Number(f.id) && <div className="group-modal-indicator"></div>}
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setDeleteModalInfo({
                                                                    isOpen: true,
                                                                    type: 'filiere',
                                                                    id: f.id,
                                                                    message: "Voulez-vous vraiment supprimer cette filière ?"
                                                                });
                                                            }}
                                                            className="group-modal-delete-btn"
                                                        >
                                                            <Trash2 className="group-modal-delete-icon" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            <div
                                                className="group-modal-dropdown-item border-top"
                                                onClick={() => {
                                                    setIsFiliereAutre(true);
                                                    setIsFiliereDropdownOpen(false);
                                                }}
                                            >
                                                <span className="group-modal-other-text">{t('modals.group.other_custom')}</span>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <input
                                        type="text"
                                        autoFocus
                                        required
                                        value={customFiliere.nom}
                                        onChange={e => setCustomFiliere({ ...customFiliere, nom: e.target.value.toUpperCase() })}
                                        placeholder="NOM DE LA FILIÈRE..."
                                        className="group-modal-input pr-12"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setIsFiliereAutre(false)}
                                        className="group-modal-clear-input-btn"
                                    >
                                        <X className="group-modal-delete-icon" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="group-modal-grid">
                        <div className="group-modal-field">
                            <label className="group-modal-label">{t('modals.group.school_year')}</label>
                            <div
                                onClick={() => setIsAnneeDropdownOpen(!isAnneeDropdownOpen)}
                                className="group-modal-dropdown-toggle"
                            >
                                <div className="group-modal-dropdown-info">
                                    <BookOpen className="group-modal-dropdown-icon" />
                                    <span className="group-modal-dropdown-text">
                                        {newGroup.année_scolaire || t('modals.group.select')}
                                    </span>
                                </div>
                                <ChevronDown className={`group-modal-chevron ${isAnneeDropdownOpen ? 'open' : ''}`} />
                            </div>

                            {isAnneeDropdownOpen && (
                                <div className="group-modal-dropdown-menu">
                                    {anneesScolaires.map((annee) => (
                                        <div
                                            key={annee}
                                            className={`group-modal-dropdown-item ${newGroup.année_scolaire === annee ? 'selected' : ''}`}
                                            onClick={() => {
                                                setNewGroup({ ...newGroup, année_scolaire: annee });
                                                setIsAnneeDropdownOpen(false);
                                            }}
                                        >
                                            <span className={`group-modal-item-text ${newGroup.année_scolaire === annee ? 'selected' : 'unselected'}`}>
                                                {annee}
                                            </span>
                                            {newGroup.année_scolaire === annee && <div className="group-modal-indicator"></div>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="group-modal-field">
                            <label className="group-modal-label">{t('modals.group.room_assignment')}</label>
                            <div
                                onClick={() => setIsSalleDropdownOpen(!isSalleDropdownOpen)}
                                className="group-modal-dropdown-toggle"
                            >
                                <div className="group-modal-dropdown-info">
                                    <Layers className="group-modal-dropdown-icon" />
                                    <span className={`group-modal-dropdown-text ${newGroup.salleIds?.length > 0 ? '' : 'muted'}`}>
                                        {newGroup.salleIds?.length > 0 
                                            ? availableSalles.filter(s => newGroup.salleIds.includes(s.id)).map(s => s.nom).join(', ') 
                                            : t('modals.group.select')}
                                    </span>
                                </div>
                                <ChevronDown className={`group-modal-chevron ${isSalleDropdownOpen ? 'open' : ''}`} />
                            </div>

                            {isSalleDropdownOpen && (
                                <div className="group-modal-dropdown-menu scrollable">
                                    <div
                                        className="group-modal-dropdown-item"
                                        onClick={() => {
                                            setNewGroup({ ...newGroup, salleIds: [] });
                                        }}
                                    >
                                        <span className="group-modal-item-text muted">{t('modals.group.deselect_all')}</span>
                                    </div>
                                    {availableSalles.map((s) => {
                                            const isSelected = newGroup.salleIds?.includes(s.id);
                                            return (
                                                <div
                                                    key={s.id}
                                                    className={`group-modal-dropdown-item ${isSelected ? 'selected' : ''}`}
                                                    onClick={() => {
                                                        const currentIds = Array.isArray(newGroup.salleIds) ? newGroup.salleIds : [];
                                                        const nextIds = isSelected 
                                                            ? currentIds.filter(id => id !== s.id)
                                                            : [...currentIds, s.id];
                                                        setNewGroup({ ...newGroup, salleIds: nextIds });
                                                    }}
                                                >
                                                    <span className={`group-modal-item-text ${isSelected ? 'selected' : 'unselected'}`}>{s.nom}</span>
                                                    {isSelected ? <CheckSquare className="group-modal-checkbox-icon checked" /> : <Square className="group-modal-checkbox-icon unchecked" />}
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="group-modal-field">
                        <label className="group-modal-label">{t('modals.group.leads')}</label>
                        <div
                            onClick={() => setIsFormateurDropdownOpen(!isFormateurDropdownOpen)}
                            className="group-modal-dropdown-toggle"
                        >
                            <div className="group-modal-dropdown-info">
                                <UserCheck className="group-modal-dropdown-icon" />
                                <span className={`group-modal-dropdown-text ${newGroup.lead?.length > 0 ? '' : 'muted'}`}>
                                    {newGroup.lead?.length > 0 ? newGroup.lead.join(', ') : t('modals.group.select')}
                                </span>
                            </div>
                            <ChevronDown className={`group-modal-chevron ${isFormateurDropdownOpen ? 'open' : ''}`} />
                        </div>

                        {isFormateurDropdownOpen && (
                            <div className="group-modal-dropdown-menu scrollable upwards">
                                {formateurs.map((f) => {
                                    const isSelected = newGroup.lead?.includes(f.name);
                                    return (
                                        <div
                                            key={f.id}
                                            className={`group-modal-dropdown-item ${isSelected ? 'selected' : ''}`}
                                            onClick={() => {
                                                const currentLeads = Array.isArray(newGroup.lead) ? newGroup.lead : [];
                                                const newLead = isSelected
                                                    ? currentLeads.filter(l => l !== f.name)
                                                    : [...currentLeads, f.name];
                                                setNewGroup({ ...newGroup, lead: newLead });
                                            }}
                                        >
                                            <span className={`group-modal-item-text ${isSelected ? 'selected' : 'unselected'}`}>{f.name}</span>
                                            {isSelected ? <CheckSquare className="group-modal-checkbox-icon checked" /> : <Square className="group-modal-checkbox-icon unchecked" />}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="group-modal-submit-container">
                        <button
                            type="submit"
                            className="btn-ista group-modal-submit-btn"
                        >
                            <UserCheck className="group-modal-submit-icon" />
                            {t('modals.group.create')}
                        </button>
                    </div>
                </form>

            </div>

            <ConfirmationModal
                isOpen={deleteModalInfo.isOpen}
                onClose={() => setDeleteModalInfo({ isOpen: false, type: '', id: null, message: '' })}
                onConfirm={confirmDelete}
                title={`SUPPRESSION ${deleteModalInfo.type === 'option' ? "D'OPTION" : 'DE FILIÈRE'}`}
                message={deleteModalInfo.message}
            />

        </div>,
        document.body
    );
};

export default GroupModal;
