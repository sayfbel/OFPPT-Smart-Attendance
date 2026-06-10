import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { ChevronRight, X, ChevronDown, CheckSquare, Square, UserPlus, Save, Mail, Shield, GraduationCap, Briefcase, Settings, User, BookOpen, Hash, Layers, Lock, FileUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './IdentityModal.css';

const IdentityModal = ({ isOpen, onClose, newUser, setNewUser, handleAddUser, handleUpdateUser, handleImportExcel, selectedGroup, availableGroups = [], availableFilieres = [], isEditing = false }) => {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';
    const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
    const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);
    const [isFiliereDropdownOpen, setIsFiliereDropdownOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('individual'); // 'individual' or 'excel'
    const [excelFile, setExcelFile] = useState(null);
    const [isImporting, setIsImporting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    if (!isOpen) return null;

    const onExcelFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setExcelFile(e.target.files[0]);
            setErrorMessage('');
        }
    };

    const handleImportSubmit = async (e) => {
        e.preventDefault();
        if (!excelFile) {
            setErrorMessage(isRtl ? 'الرجاء اختيار ملف Excel.' : 'Veuillez sélectionner un fichier Excel.');
            return;
        }
        if (!newUser.group_id) {
            setErrorMessage(isRtl ? 'الرجاء تحديد المجموعة.' : 'Veuillez sélectionner un groupe.');
            return;
        }

        try {
            setIsImporting(true);
            setErrorMessage('');
            await handleImportExcel(excelFile, newUser.group_id, newUser.filiereId);
            setExcelFile(null);
            onClose();
        } catch (err) {
            setErrorMessage(err.response?.data?.message || 'Erreur lors de l\'importation');
        } finally {
            setIsImporting(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            handleUpdateUser(e);
        } else {
            handleAddUser(e);
        }
    };

    const roles = [
        { value: 'stagiaire', label: t('roles.stagiaire'), icon: GraduationCap },
        { value: 'formateur', label: t('roles.formateur'), icon: Briefcase }
    ];

    const currentRole = roles.find(r => r.value === newUser.role) || roles[0];

    return ReactDOM.createPortal(
        <div className="identity-modal-overlay">
            <div className={`identity-modal-content ${isRtl ? 'rtl' : ''}`}>

                {/* Left side (Info/Status) */}
                <div className="identity-modal-info-panel">
                    <div className="identity-modal-info-top">
                        <div className="identity-modal-icon-wrapper">
                            <Settings className="identity-modal-icon" />
                        </div>
                        <h2 className={`identity-modal-panel-title ${isRtl ? 'rtl' : ''}`}>
                            {isEditing ? t('modals.identity.editing') : t('modals.identity.new')} <br />
                            <span className="identity-modal-panel-highlight">{t('modals.identity.label')}</span>
                        </h2>
                        <p className={`identity-modal-panel-subtitle ${isRtl ? 'rtl' : ''}`}>{t('modals.identity.service_tag')}</p>
                    </div>

                    <div className="identity-modal-status-box">
                        <div className={`identity-modal-status-item ${isRtl ? 'rtl' : ''}`}>
                            <p className="identity-modal-status-label">{t('modals.identity.system_id')}</p>
                            <p className="identity-modal-status-value">{isEditing ? `ID_${newUser.id.toString().padStart(4, '0')}` : t('modals.identity.auto_gen')}</p>
                        </div>
                        <div className={`identity-modal-status-item ${isRtl ? 'rtl' : ''}`}>
                            <p className="identity-modal-status-label">{t('modals.identity.group_label')}</p>
                            <p className="identity-modal-status-value primary">{selectedGroup || t('modals.identity.global_access')}</p>
                        </div>
                        <div className={`identity-modal-status-item ${isRtl ? 'rtl' : ''}`}>
                            <p className="identity-modal-status-label">{t('modals.identity.updating')}</p>
                            <div className={`identity-modal-updating-wrapper ${isRtl ? 'rtl' : ''}`}>
                                <div className={`identity-modal-updating-dot ${isEditing ? 'edit' : 'new'}`}></div>
                                <p className="identity-modal-updating-text">{isEditing ? t('modals.identity.updating') : t('modals.identity.init')}</p>
                            </div>
                        </div>
                    </div>

                    <p className={`identity-modal-system-tag ${isRtl ? 'rtl' : ''}`}>ISTA_OFPPT_DIGITAL_SYSTEM</p>
                </div>

                {/* Right side (Form) */}
                <div className="identity-modal-form-area">

                    {/* Fixed Header */}
                    <div className="identity-modal-header">
                        <div className={`identity-modal-header-text ${isRtl ? 'rtl' : ''}`}>
                            <h3 className="identity-modal-title">{t('modals.identity.title')}</h3>
                            <p className="identity-modal-subtitle">{t('modals.identity.subtitle')}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className={`identity-modal-close-btn ${isRtl ? 'rtl' : ''}`}
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="identity-modal-body ista-scrollbar">
                        <form onSubmit={newUser.role === 'stagiaire' && !isEditing && activeTab === 'excel' ? handleImportSubmit : handleSubmit} className="identity-modal-form">
                            <div className="identity-modal-fields">
                                {/* Rôle */}
                                <div className="identity-modal-field">
                                    <label className={`identity-modal-label ${isRtl ? 'rtl' : ''}`}>
                                        <Shield className="identity-modal-label-icon" />
                                        {t('modals.identity.access_level')}
                                    </label>
                                    <div
                                        onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                                        className={`identity-modal-dropdown-toggle ${isRtl ? 'rtl' : ''}`}
                                    >
                                        <div className={`identity-modal-dropdown-info ${isRtl ? 'rtl' : ''}`}>
                                            <currentRole.icon className="identity-modal-dropdown-icon" />
                                            <span className="identity-modal-dropdown-text">{currentRole.label}</span>
                                        </div>
                                        <ChevronDown className={`identity-modal-chevron ${isRoleDropdownOpen ? 'open' : ''}`} />
                                    </div>

                                    {isRoleDropdownOpen && (
                                        <div className="identity-modal-dropdown-menu">
                                            {roles.map((role) => (
                                                <div
                                                    key={role.value}
                                                    className={`identity-modal-dropdown-item ${newUser.role === role.value ? 'selected' : ''} ${isRtl ? 'rtl' : ''}`}
                                                    onClick={() => {
                                                        setNewUser({ ...newUser, role: role.value });
                                                        setIsRoleDropdownOpen(false);
                                                    }}
                                                >
                                                    <div className={`identity-modal-item-info ${isRtl ? 'rtl' : ''}`}>
                                                        <role.icon className={`identity-modal-item-icon ${newUser.role === role.value ? 'selected' : 'unselected'}`} />
                                                        <span className={`identity-modal-item-text ${newUser.role === role.value ? 'selected' : 'unselected'}`}>{role.label}</span>
                                                    </div>
                                                    {newUser.role === role.value && <div className="identity-modal-indicator"></div>}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Dynamic Tabs for Stagiaire creation */}
                                {newUser.role === 'stagiaire' && !isEditing && (
                                    <div className="identity-modal-tabs">
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab('individual')}
                                            className={`identity-modal-tab-btn ${activeTab === 'individual' ? 'active' : 'inactive'}`}
                                        >
                                            {isRtl ? 'فردي' : 'INDIVIDUEL'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab('excel')}
                                            className={`identity-modal-tab-btn ${activeTab === 'excel' ? 'active' : 'inactive'}`}
                                        >
                                            {isRtl ? 'استيراد من EXCEL' : 'IMPORTATION EXCEL'}
                                        </button>
                                    </div>
                                )}

                                {/* Nom Complet */}
                                {!(newUser.role === 'stagiaire' && !isEditing && activeTab === 'excel') && (
                                    <div className="identity-modal-field">
                                        <label className={`identity-modal-label ${isRtl ? 'rtl' : ''}`}>
                                            <User className="identity-modal-label-icon" />
                                            {t('modals.identity.full_name')}
                                        </label>
                                        <input
                                            type="text"
                                            required={!(newUser.role === 'stagiaire' && !isEditing && activeTab === 'excel')}
                                            value={newUser.name}
                                            onChange={e => {
                                                const name = e.target.value;
                                                const email = name.trim().toLowerCase().replace(/\s+/g, '.') + '@ofppt.ma';
                                                setNewUser({ ...newUser, name, email });
                                            }}
                                            placeholder={t('modals.identity.name_placeholder')}
                                            className={`identity-modal-input ${isRtl ? 'rtl' : ''}`}
                                        />
                                    </div>
                                )}

                                {/* Email & Password (Formateur / Admin only - Read Only) */}
                                {['formateur', 'admin'].includes(newUser.role) && (
                                    <div className="identity-modal-input-grid">
                                         <div className="identity-modal-field">
                                             <label className={`identity-modal-label ${isRtl ? 'rtl' : ''}`}>
                                                 <Mail className="identity-modal-label-icon" />
                                                 {t('modals.identity.email')}
                                             </label>
                                             <input
                                                 type="email"
                                                 disabled
                                                 value={newUser.email || `${(newUser.name || 'nom').trim().toLowerCase().replace(/\s+/g, '.')}@ofppt.ma`}
                                                 className={`identity-modal-input disabled ${isRtl ? 'rtl' : ''}`}
                                             />
                                         </div>
                                         <div className="identity-modal-field">
                                             <label className={`identity-modal-label ${isRtl ? 'rtl' : ''}`}>
                                                 <Lock className="identity-modal-label-icon" />
                                                 {t('modals.identity.default_password')}
                                             </label>
                                             <input
                                                 type="text"
                                                 disabled
                                                 value={(newUser.email || `${(newUser.name || 'nom').trim().toLowerCase().replace(/\s+/g, '.')}@ofppt.ma`).split('@')[0]}
                                                 className={`identity-modal-input disabled ${isRtl ? 'rtl' : ''}`}
                                             />
                                         </div>
                                    </div>
                                )}

                                {/* NumInscription (Stagiaire only) */}
                                {newUser.role === 'stagiaire' && !(newUser.role === 'stagiaire' && !isEditing && activeTab === 'excel') && (
                                    <div className="identity-modal-field">
                                        <label className={`identity-modal-label ${isRtl ? 'rtl' : ''}`}>
                                            <Hash className="identity-modal-label-icon" />
                                            {t('modals.identity.num_inscription')}
                                        </label>
                                        <input
                                            type="text"
                                            required={newUser.role === 'stagiaire' && !(newUser.role === 'stagiaire' && !isEditing && activeTab === 'excel')}
                                            disabled={isEditing}
                                            value={newUser.numInsc || newUser.id || ''}
                                            onChange={e => setNewUser({ ...newUser, numInsc: e.target.value.toUpperCase() })}
                                            placeholder={t('modals.identity.num_inscription_placeholder')}
                                            className={`identity-modal-input ${isEditing ? 'disabled' : ''} ${isRtl ? 'rtl' : ''}`}
                                        />
                                    </div>
                                )}

                                {/* Groupes */}
                                <div className="identity-modal-field">
                                    <label className={`identity-modal-label ${isRtl ? 'rtl' : ''}`}>
                                        <Briefcase className="identity-modal-label-icon" />
                                        {t('modals.identity.group_assignment')}
                                    </label>

                                    <div
                                        onClick={() => setIsClassDropdownOpen(!isClassDropdownOpen)}
                                        className={`identity-modal-dropdown-toggle ${isRtl ? 'rtl' : ''}`}
                                    >
                                        <span className={`identity-modal-dropdown-text ${isRtl ? 'rtl' : ''} ${newUser.role === 'stagiaire'
                                            ? (newUser.group_id ? '' : 'muted')
                                            : (newUser.group_ids?.length > 0 ? '' : 'muted')
                                            }`}>
                                            {newUser.role === 'stagiaire'
                                                ? (newUser.group_id || t('modals.identity.select_group'))
                                                : (newUser.group_ids?.length > 0 ? newUser.group_ids.join(', ') : t('modals.identity.select_groups'))
                                            }
                                        </span>
                                        <ChevronDown className={`identity-modal-chevron ${isClassDropdownOpen ? 'open' : ''}`} />
                                    </div>

                                    {isClassDropdownOpen && (
                                        <div className="identity-modal-dropdown-menu scrollable">
                                            {availableGroups.map((grp) => {
                                                const isSelected = newUser.role === 'stagiaire'
                                                    ? newUser.group_id === grp.id
                                                    : newUser.group_ids?.includes(grp.id);

                                                return (
                                                    <div
                                                        key={grp.id}
                                                        className={`identity-modal-dropdown-item ${isSelected ? 'selected' : ''} ${isRtl ? 'rtl' : ''}`}
                                                        onClick={() => {
                                                            if (newUser.role === 'stagiaire') {
                                                                setNewUser({ 
                                                                    ...newUser, 
                                                                    group_id: grp.id,
                                                                    filiereId: grp.filiereId
                                                                });
                                                                setIsClassDropdownOpen(false);
                                                            } else {
                                                                 const currentIds = newUser.group_ids || [];
                                                                 const newGroupArray = isSelected
                                                                     ? currentIds.filter(id => id !== grp.id)
                                                                     : [...currentIds, grp.id];
                                                                 setNewUser({ ...newUser, group_ids: newGroupArray });
                                                            }
                                                        }}
                                                    >
                                                        <span className={`identity-modal-item-text ${isSelected ? 'selected' : 'unselected'}`}>{grp.id}</span>
                                                        {isSelected ? <CheckSquare className="identity-modal-checkbox-icon checked" /> : <Square className="identity-modal-checkbox-icon unchecked" />}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Excel Uploader (Stagiaire only) */}
                                {newUser.role === 'stagiaire' && !isEditing && activeTab === 'excel' && (
                                    <div className="identity-modal-field">
                                        <label className={`identity-modal-label ${isRtl ? 'rtl' : ''}`}>
                                            <FileUp className="identity-modal-label-icon" />
                                            {isRtl ? 'ملف Excel' : 'FICHIER EXCEL (XLSX, XLS)'}
                                        </label>
                                        <div className="identity-modal-upload-wrapper">
                                            <input
                                                type="file"
                                                accept=".xlsx, .xls, .csv"
                                                id="excel-file-input"
                                                onChange={onExcelFileChange}
                                                className="identity-modal-upload-input"
                                            />
                                            <div className={`identity-modal-upload-box ${excelFile ? 'has-file' : ''}`}>
                                                <div className={`identity-modal-upload-icon-wrapper ${excelFile ? 'has-file' : 'empty'}`}>
                                                    <FileUp className="identity-modal-upload-icon" />
                                                </div>
                                                
                                                <div className="identity-modal-upload-text-container">
                                                    <p className="identity-modal-upload-filename">
                                                         {excelFile ? excelFile.name : (isRtl ? 'اسحب وأسقط ملف Excel هنا أو انقر للتصفح' : 'Glissez-déposez le fichier Excel ici ou cliquez pour parcourir')}
                                                    </p>
                                                    <p className="identity-modal-upload-filesize">
                                                         {excelFile ? `${(excelFile.size / 1024).toFixed(1)} KB` : (isRtl ? 'يدعم XLSX, XLS, CSV' : 'Formats acceptés : .xlsx, .xls, .csv')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                         
                                        {errorMessage && (
                                             <p className="identity-modal-error-msg">
                                                 {errorMessage}
                                             </p>
                                        )}

                                        <div className="identity-modal-format-info">
                                             <div className="identity-modal-format-icon-wrapper">
                                                 <svg className="identity-modal-format-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                     <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                 </svg>
                                             </div>
                                             <div className="identity-modal-format-text-wrapper">
                                                 <h4 className="identity-modal-format-title">
                                                     {isRtl ? 'تنسيق الملف المتوقع' : 'STRUCTURE DU FICHIER REQUIS'}
                                                 </h4>
                                                 <p className="identity-modal-format-desc">
                                                     {isRtl 
                                                         ? 'يجب أن يحتوي الملف على الأعمدة التالية كصف أول: NumInscription، Nom Complet (أو Nom)' 
                                                         : 'Le fichier doit contenir les en-têtes suivants sur la 1ère ligne : "NumInscription" et "Nom Complet" (ou "Nom").'}
                                                 </p>
                                             </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="identity-modal-submit-area">
                                <button
                                    type="submit"
                                    disabled={newUser.role === 'stagiaire' && !isEditing && activeTab === 'excel' ? isImporting || !excelFile || !newUser.group_id : false}
                                    className={`identity-modal-submit-btn ${
                                        newUser.role === 'stagiaire' && !isEditing && activeTab === 'excel' && (isImporting || !excelFile || !newUser.group_id)
                                             ? 'disabled'
                                             : ''
                                    }`}
                                >
                                    {newUser.role === 'stagiaire' && !isEditing && activeTab === 'excel' ? (
                                        <>
                                            <FileUp className={`identity-modal-submit-icon ${isImporting ? 'bounce' : ''}`} />
                                            <span>{isImporting ? (isRtl ? 'جاري الاستيراد...' : 'IMPORTATION EN COURS...') : (isRtl ? 'بدء استيراد Excel' : 'COMMENCER L\'IMPORT EXCEL')}</span>
                                        </>
                                    ) : (
                                        <>
                                            {isEditing ? <Save className="identity-modal-submit-icon" /> : <UserPlus className="identity-modal-submit-icon" />}
                                             <span>{isEditing ? t('modals.identity.save') : t('modals.identity.create')}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default IdentityModal;
