import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, BookOpen, Layers, Save, X, Filter, ChevronDown, Edit3, Trash2, CheckSquare, Square, Users, Hash, AlertCircle } from 'lucide-react';
import { GroupModal, ConfirmationModal } from '../../../components/Modals';
import { useNotification } from '../../../hooks/useNotification';
import { useTranslation } from 'react-i18next';
import studentService from '../../../services/studentService';
import './Squadrons.css';
import '../../../styles/admin-shared.css';

const Squadrons = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';
    const { addNotification } = useNotification();
    const [groups, setGroups] = useState([]);
    const [formateurs, setFormateurs] = useState([]);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [newGroup, setNewGroup] = useState({ id: '', filiereId: '', lead: [], année_scolaire: '2025/2026', salleIds: [] });
    const [flippedCardId, setFlippedCardId] = useState(null);
    const [editData, setEditData] = useState({ filiereId: '', lead: [], année_scolaire: '', salleIds: [] });
    const [yearFilter, setYearFilter] = useState('ALL');
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
    const [isYearFilterDropdownOpen, setIsYearFilterDropdownOpen] = useState(false);
    const [isEditDropdownOpen, setIsEditDropdownOpen] = useState(false);

    const [isFiliereEditDropdownOpen, setIsFiliereEditDropdownOpen] = useState(false);
    const [isFiliereEditAutre, setIsFiliereEditAutre] = useState(false);
    const [isAnneeEditDropdownOpen, setIsAnneeEditDropdownOpen] = useState(false);
    const [isSalleEditDropdownOpen, setIsSalleEditDropdownOpen] = useState(false);
    const [availableSalles, setAvailableSalles] = useState([]);

    const anneesScolaires = ['2023/2024', '2024/2025', '2025/2026', '2026/2027', '2027/2028'];
    const [availableFilieres, setAvailableFilieres] = useState([]);
    const [customFiliere, setCustomFiliere] = useState({ nom: '' });
    const [purgeInfo, setPurgeInfo] = useState({ isOpen: false, groupId: '' });

    const fetchData = async () => {
        try {
            const [groupsData, formateurData, filiereData, sallesData] = await Promise.all([
                studentService.getGroups(),
                studentService.getFormateurs(),
                studentService.getFilieres(),
                studentService.getSalles()
            ]);
 
            setGroups(groupsData.groups || []);
            setFormateurs(formateurData.formateurs || []);
            setAvailableFilieres(filiereData.filieres || []);
            setAvailableSalles(sallesData.salles || []);
        } catch (error) {
            console.error('Error fetching dashboard data', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddGroup = async (e, customData = null) => {
        if (e && e.preventDefault) e.preventDefault();
        try {
            const dataToSubmit = customData || newGroup;
 
            const payload = {
                ...dataToSubmit,
                lead: Array.isArray(dataToSubmit.lead) ? dataToSubmit.lead.join(', ') : dataToSubmit.lead
            };
 
            await studentService.createGroup(payload);
            await fetchData();
            setIsGroupModalOpen(false);
            setNewGroup({ id: '', filiereId: '', lead: [], année_scolaire: '2025/2026' });
            addNotification('Groupe créé et déployé avec succès.', 'success');
        } catch (error) {
            console.error('Error creating group', error);
            addNotification(error.response?.data?.message || 'Erreur lors de la configuration du groupe', 'error');
        }
    };

    const handleUpdateGroup = async (id) => {
        try {
            let finalEditData = { ...editData };
 
            if (isFiliereEditAutre && customFiliere.nom) {
                const resFData = await studentService.createFiliere(customFiliere);
                finalEditData.filiereId = resFData.id;
                setAvailableFilieres(prev => [...prev, resFData]);
                setIsFiliereEditAutre(false);
            }
 
            const payload = {
                ...finalEditData,
                lead: Array.isArray(finalEditData.lead) ? finalEditData.lead.join(', ') : finalEditData.lead
            };
 
            await studentService.updateGroup(id, payload);
            await fetchData();
            setFlippedCardId(null);
            addNotification('Informations du groupe mises à jour.', 'success');
        } catch (error) {
            console.error('Error updating group', error);
            addNotification(error.response?.data?.message || 'Erreur lors de la mise à jour', 'error');
        }
    };

    const handlePurgeGroup = async () => {
        const id = purgeInfo.groupId;
        try {
            await studentService.deleteGroup(id);
            setGroups(prev => prev.filter(g => g.id !== id));
            addNotification('Groupe supprimé du système.', 'success');
            setPurgeInfo({ isOpen: false, groupId: '' });
        } catch (error) {
            console.error('Error deleting group', error);
            addNotification('Échec de la suppression: Erreur serveur.', 'error');
            setPurgeInfo({ isOpen: false, groupId: '' });
        }
    };

    const handleFlip = (grp) => {
        if (flippedCardId === grp.id) {
            setFlippedCardId(null);
        } else {
            setFlippedCardId(grp.id);
            const leadArray = Array.isArray(grp.lead) 
                ? grp.lead 
                : (grp.lead ? String(grp.lead).split(',').map(s => s.trim()) : []);
                
            setEditData({
                id: grp.id,
                filiereId: grp.filiereId || grp.filiereid || '',
                année_scolaire: grp.année_scolaire || grp.annee_scolaire || '',
                salleIds: grp.salleIds || [],
                lead: leadArray
            });
            setIsFiliereEditAutre(false);
            setCustomFiliere({ nom: '' });
            setIsEditDropdownOpen(false);
            setIsFiliereEditDropdownOpen(false);
            setIsAnneeEditDropdownOpen(false);
            setIsSalleEditDropdownOpen(false);
        }
    };

    const uniqueYears = ['ALL', ...new Set(groups.map(g => g.année_scolaire).filter(Boolean))];
    
    const filteredGroups = groups.filter(g => {
        const matchYear = yearFilter === 'ALL' || g.année_scolaire === yearFilter;
        return matchYear;
    });

    return (
        <div className={`squadrons-container ${isRtl ? 'rtl' : ''}`}>
            <div className={`squadrons-header ${isRtl ? 'rtl' : ''}`}>
                <div className="squadrons-title-wrapper">
                    <h1 className="squadrons-title">
                        {t('groups.title')}
                    </h1>
                    <div className={`squadrons-subtitle-wrapper ${isRtl ? 'rtl' : ''}`}>
                        <div className="pulse-dot"></div>
                        {t('groups.subtitle')}
                    </div>
                </div>

                <div className="squadrons-actions">
                    <div className="squadrons-filter-wrapper">
                        <button
                            onClick={() => setIsYearFilterDropdownOpen(!isYearFilterDropdownOpen)}
                            className="squadrons-filter-btn"
                        >
                            <Layers className="squadrons-filter-icon" />
                            <span className="squadrons-filter-text">{yearFilter === 'ALL' ? 'TOUTES LES ANNÉES' : yearFilter}</span>
                            <ChevronDown className={`squadrons-filter-chevron ${isYearFilterDropdownOpen ? 'open' : ''}`} />
                        </button>

                        {isYearFilterDropdownOpen && (
                            <div className="squadrons-filter-dropdown">
                                {uniqueYears.map(year => (
                                    <div
                                        key={year}
                                        className={`squadrons-filter-item ${yearFilter === year ? 'active' : 'inactive'}`}
                                        onClick={() => {
                                            setYearFilter(year);
                                            setIsYearFilterDropdownOpen(false);
                                        }}
                                    >
                                        {year === 'ALL' ? 'TOUTES LES ANNÉES' : year}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button onClick={() => setIsGroupModalOpen(true)} className="btn-ista px-8 py-4 flex items-center gap-3">
                        <Plus className="w-5 h-5" />
                        <span>CRÉER UN GROUPE</span>
                    </button>
                </div>
            </div>

            <div className="squadrons-grid">
                {filteredGroups.map((grp) => (
                    <div key={grp.id} className="squadrons-card-container">
                        <div className={`squadrons-card-inner ${flippedCardId === grp.id ? 'flipped' : ''}`}>
                            
                            <div className="squadrons-card-front">
                                <div className="squadrons-card-bg-shape"></div>

                                <div className="squadrons-card-header">
                                    <div className="squadrons-card-icon-wrapper">
                                        <Users className="squadrons-card-icon" />
                                    </div>
                                    <div className="squadrons-card-actions">
                                        <button onClick={() => handleFlip(grp)} className="squadrons-action-btn edit">
                                            <Edit3 className="squadrons-action-icon" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setPurgeInfo({ isOpen: true, groupId: grp.id });
                                            }}
                                            className="squadrons-action-btn delete"
                                        >
                                            <Trash2 className="squadrons-action-icon" />
                                        </button>
                                    </div>
                                </div>

                                <div className="squadrons-card-content">
                                    <h2 className="squadrons-card-title">
                                        {grp.id}
                                    </h2>
                                    <div className="squadrons-card-subtitle">
                                        {grp.filiere}
                                    </div>

                                    <div className="squadrons-card-info">
                                        {grp.année_scolaire}
                                        {grp.salle_nom && (
                                            <>
                                                <span className="squadrons-info-dot">•</span>
                                                <span className="squadrons-info-highlight">{grp.salle_nom}</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="squadrons-card-footer">
                                    <div>
                                        <p className="squadrons-footer-label">Stagiaires</p>
                                        <p className="squadrons-footer-value-large">
                                            {grp.students !== undefined && grp.students !== null ? grp.students : '0'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="squadrons-footer-label">Formateur(s)</p>
                                        <p className="squadrons-footer-value-small" title={grp.formateur || grp.lead}>
                                            {grp.formateur || grp.lead}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="squadrons-card-back">
                                <div className="squadrons-back-header">
                                    <span className="squadrons-back-title">Mise à jour du Groupe</span>
                                    <button onClick={() => setFlippedCardId(null)} className="squadrons-close-btn">
                                        <X className="squadrons-close-icon" />
                                    </button>
                                </div>

                                <div className="squadrons-back-content ista-scrollbar">
                                    <button 
                                        onClick={() => navigate(`/admin/users?group=${grp.id}`)}
                                        className="squadrons-view-students-btn"
                                    >
                                        <Users className="squadrons-btn-icon" />
                                        VOIR LES STAGIAIRES ({grp.students || 0})
                                    </button>

                                    <div className="squadrons-input-wrapper">
                                        <label className="squadrons-label">Filière</label>
                                        {!isFiliereEditAutre ? (
                                            <div className="relative">
                                                <div
                                                    onClick={() => setIsFiliereEditDropdownOpen(!isFiliereEditDropdownOpen)}
                                                    className="squadrons-dropdown-toggle"
                                                >
                                                    <div className="squadrons-dropdown-content">
                                                        <BookOpen className="squadrons-dropdown-icon-left" />
                                                        <span className="squadrons-dropdown-text">
                                                             {availableFilieres.find(f => Number(f.id) === Number(editData.filiereId))?.nom || 'SÉLECTIONNER...'}
                                                        </span>
                                                    </div>
                                                    <ChevronDown className={`squadrons-dropdown-chevron ${isFiliereEditDropdownOpen ? 'open' : ''}`} />
                                                </div>

                                                {isFiliereEditDropdownOpen && (
                                                    <div className="squadrons-dropdown-menu">
                                                        <div className="squadrons-dropdown-list ista-scrollbar">
                                                            {availableFilieres.map(f => (
                                                                <div
                                                                    key={f.id}
                                                                     className={`squadrons-dropdown-item ${Number(editData.filiereId) === Number(f.id) ? 'selected' : ''}`}
                                                                     onClick={() => {
                                                                         setEditData({ ...editData, filiereId: f.id });
                                                                         setIsFiliereEditDropdownOpen(false);
                                                                     }}
                                                                 >
                                                                     <span className={`squadrons-dropdown-item-text ${Number(editData.filiereId) === Number(f.id) ? 'selected' : 'unselected'}`}>
                                                                         {f.nom}
                                                                     </span>
                                                                     {Number(editData.filiereId) === Number(f.id) && <div className="squadrons-dropdown-dot"></div>}
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div
                                                            className="squadrons-dropdown-autre"
                                                            onClick={() => {
                                                                setIsFiliereEditAutre(true);
                                                                setIsFiliereEditDropdownOpen(false);
                                                            }}
                                                        >
                                                            <span className="squadrons-dropdown-autre-text">AUTRE (PERSONNALISÉ)</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="squadrons-custom-input-wrapper">
                                                <input
                                                    type="text"
                                                    autoFocus
                                                    value={customFiliere.nom}
                                                    onChange={e => setCustomFiliere({ ...customFiliere, nom: e.target.value.toUpperCase() })}
                                                    placeholder="NOM DE LA FILIÈRE..."
                                                    className="squadrons-custom-input"
                                                />
                                                <button
                                                    onClick={() => setIsFiliereEditAutre(false)}
                                                    className="squadrons-custom-close"
                                                >
                                                    <X className="squadrons-custom-close-icon" />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="squadrons-input-wrapper">
                                        <label className="squadrons-label">Année Scolaire</label>
                                        <div
                                            onClick={() => setIsAnneeEditDropdownOpen(!isAnneeEditDropdownOpen)}
                                            className="squadrons-dropdown-toggle"
                                        >
                                            <div className="squadrons-dropdown-content">
                                                <BookOpen className="squadrons-dropdown-icon-left" />
                                                <span className="squadrons-dropdown-text">
                                                    {editData.année_scolaire || 'SÉLECTIONNER...'}
                                                </span>
                                            </div>
                                            <ChevronDown className={`squadrons-dropdown-chevron ${isAnneeEditDropdownOpen ? 'open' : ''}`} />
                                        </div>

                                        {isAnneeEditDropdownOpen && (
                                            <div className="squadrons-dropdown-menu">
                                                {anneesScolaires.map((annee) => (
                                                    <div
                                                        key={annee}
                                                        className={`squadrons-dropdown-item ${editData.année_scolaire === annee ? 'selected' : ''}`}
                                                        onClick={() => {
                                                            setEditData({ ...editData, année_scolaire: annee });
                                                            setIsAnneeEditDropdownOpen(false);
                                                        }}
                                                    >
                                                        <span className={`squadrons-dropdown-item-text ${editData.année_scolaire === annee ? 'selected' : 'unselected'}`}>
                                                            {annee}
                                                        </span>
                                                        {editData.année_scolaire === annee && <div className="squadrons-dropdown-dot"></div>}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="squadrons-input-wrapper">
                                        <label className="squadrons-label">Salle d'assignation</label>
                                        <div
                                            onClick={() => setIsSalleEditDropdownOpen(!isSalleEditDropdownOpen)}
                                            className="squadrons-dropdown-toggle"
                                        >
                                            <div className="squadrons-dropdown-content">
                                                <Layers className="squadrons-dropdown-icon-left" />
                                                <span className="squadrons-dropdown-text">
                                            {editData.salleIds?.length > 0
                                                ? availableSalles.filter(s => editData.salleIds.includes(s.id)).map(s => s.nom).join(', ')
                                                : 'SÉLECTIONNER...'}
                                        </span>
                                            </div>
                                            <ChevronDown className={`squadrons-dropdown-chevron ${isSalleEditDropdownOpen ? 'open' : ''}`} />
                                        </div>

                                        {isSalleEditDropdownOpen && (
                                            <div className="squadrons-dropdown-menu">
                                                <div
                                                    className="squadrons-dropdown-deselect"
                                                    onClick={() => {
                                                        setEditData({ ...editData, salleIds: [] });
                                                    }}
                                                >
                                                    <span className="squadrons-dropdown-deselect-text">DÉSÉLECTIONNER TOUT</span>
                                                </div>
                                                {availableSalles.map((s) => {
                                                    const isSelected = editData.salleIds?.includes(s.id);
                                                    return (
                                                        <div
                                                            key={s.id}
                                                            className={`squadrons-dropdown-item ${isSelected ? 'selected' : ''}`}
                                                            onClick={() => {
                                                                const currentIds = Array.isArray(editData.salleIds) ? editData.salleIds : [];
                                                                const nextIds = isSelected 
                                                                    ? currentIds.filter(id => id !== s.id)
                                                                    : [...currentIds, s.id];
                                                                setEditData({ ...editData, salleIds: nextIds });
                                                            }}
                                                        >
                                                            <span className={`squadrons-dropdown-item-text ${isSelected ? 'selected' : 'unselected'}`}>
                                                                {s.nom}
                                                            </span>
                                                            {isSelected ? <CheckSquare className="squadrons-dropdown-icon-left" /> : <Square className="squadrons-dropdown-icon-left unselected" />}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>

                                    <div className="squadrons-input-wrapper">
                                        <label className="squadrons-label">Formateurs</label>
                                        <div
                                            onClick={() => setIsEditDropdownOpen(!isEditDropdownOpen)}
                                            className="squadrons-dropdown-toggle"
                                        >
                                            <span className={`squadrons-dropdown-text ${editData.lead.length > 0 ? '' : 'unselected'}`}>
                                                {editData.lead.length > 0 ? editData.lead.join(', ') : 'SÉLECTIONNER...'}
                                            </span>
                                            <ChevronDown className={`squadrons-dropdown-chevron ${isEditDropdownOpen ? 'open' : ''}`} />
                                        </div>

                                        {isEditDropdownOpen && (
                                            <div className="squadrons-dropdown-menu">
                                                <div className="squadrons-dropdown-list ista-scrollbar">
                                                {formateurs.map((f) => {
                                                    const isSelected = editData.lead.includes(f.name);
                                                    return (
                                                        <div
                                                            key={f.id}
                                                            className={`squadrons-dropdown-item ${isSelected ? 'selected' : ''}`}
                                                            onClick={() => {
                                                                const newLead = isSelected
                                                                    ? editData.lead.filter(l => l !== f.name)
                                                                    : [...editData.lead, f.name];
                                                                setEditData({ ...editData, lead: newLead });
                                                            }}
                                                        >
                                                            <span className={`squadrons-dropdown-item-text ${isSelected ? 'selected' : 'unselected'}`}>{f.name}</span>
                                                            {isSelected ? <CheckSquare className="squadrons-dropdown-icon-left" /> : <Square className="squadrons-dropdown-icon-left unselected" />}
                                                        </div>
                                                    );
                                                })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleUpdateGroup(grp.id)}
                                    className="btn-ista squadrons-save-btn"
                                >
                                    <Save className="w-4 h-4" />
                                    <span>{t('groups.save_button')}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                <div
                    onClick={() => setIsGroupModalOpen(true)}
                    className="squadrons-init-card"
                >
                    <div className="squadrons-init-icon-wrapper">
                        <Plus className="squadrons-init-icon" />
                    </div>
                    <h3 className="squadrons-init-title">Initialiser un Groupe</h3>
                    <p className="squadrons-init-subtitle">Ajouter une nouvelle division</p>
                </div>
            </div>

            <GroupModal
                isOpen={isGroupModalOpen}
                onClose={() => setIsGroupModalOpen(false)}
                newGroup={newGroup}
                setNewGroup={setNewGroup}
                handleAddGroup={handleAddGroup}
                formateurs={formateurs}
                groups={groups}
            />

            <ConfirmationModal
                isOpen={purgeInfo.isOpen}
                onClose={() => setPurgeInfo({ isOpen: false, groupId: '' })}
                onConfirm={handlePurgeGroup}
                title="Suppression du Groupe"
                message={`Êtes-vous sûr de vouloir supprimer le groupe ${purgeInfo.groupId}? Cette action supprimera également toutes les séances associées dans l'emploi du temps.`}
            />
        </div>
    );
};

export default Squadrons;
