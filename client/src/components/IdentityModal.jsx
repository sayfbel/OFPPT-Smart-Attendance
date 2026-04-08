import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { ChevronRight, X, ChevronDown, CheckSquare, Square, UserPlus, Save, Mail, Shield, GraduationCap, Briefcase, Settings, User, BookOpen, Hash, Layers, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const IdentityModal = ({ isOpen, onClose, newUser, setNewUser, handleAddUser, handleUpdateUser, selectedGroup, availableGroups = [], availableFilieres = [], isEditing = false }) => {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';
    const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
    const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);
    const [isFiliereDropdownOpen, setIsFiliereDropdownOpen] = useState(false);

    if (!isOpen) return null;

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
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300">
            <div className={`bg-white rounded-[40px] w-full max-w-5xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row h-[90vh] max-h-[800px] ${isRtl ? 'md:flex-row-reverse' : ''}`}>

                {/* Left side (Info/Status) */}
                <div className="w-full md:w-[35%] bg-gradient-to-b from-[var(--secondary)] to-[#003d6b] text-white p-12 flex flex-col">
                    <div className="mb-auto">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 mb-8">
                            <Settings className="w-8 h-8 text-white" />
                        </div>
                        <h2 className={`text-4xl lg:text-5xl font-black italic tracking-tighter leading-[0.9] mb-4 uppercase ${isRtl ? 'text-right' : ''}`}>
                            {isEditing ? t('modals.identity.editing') : t('modals.identity.new')} <br />
                            <span className="text-[var(--primary)] text-5xl lg:text-6xl">{t('modals.identity.label')}</span>
                        </h2>
                        <p className={`text-[10px] font-bold text-white/50 tracking-[0.3em] uppercase ${isRtl ? 'text-right' : ''}`}>{t('modals.identity.service_tag')}</p>
                    </div>

                    <div className="space-y-8 mt-12 bg-black/10 p-8 rounded-3xl border border-white/5">
                        <div className={`space-y-1 ${isRtl ? 'text-right' : ''}`}>
                            <p className="text-[9px] font-black text-white/40 tracking-widest uppercase">{t('modals.identity.system_id')}</p>
                            <p className="text-sm font-black italic uppercase tracking-tight">{isEditing ? `ID_${newUser.id.toString().padStart(4, '0')}` : t('modals.identity.auto_gen')}</p>
                        </div>
                        <div className={`space-y-1 ${isRtl ? 'text-right' : ''}`}>
                            <p className="text-[9px] font-black text-white/40 tracking-widest uppercase">{t('modals.identity.group_label')}</p>
                            <p className="text-sm font-black italic uppercase tracking-tight text-[var(--primary)]">{selectedGroup || t('modals.identity.global_access')}</p>
                        </div>
                        <div className={`space-y-1 ${isRtl ? 'text-right' : ''}`}>
                            <p className="text-[9px] font-black text-white/40 tracking-widest uppercase">{t('modals.identity.updating')}</p>
                            <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-2 h-2 rounded-full animate-pulse ${isEditing ? 'bg-amber-400' : 'bg-green-500'}`}></div>
                                <p className="text-[10px] font-black uppercase tracking-widest">{isEditing ? t('modals.identity.updating') : t('modals.identity.init')}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto hidden md:block">
                        <p className={`text-[8px] font-bold text-white/30 tracking-[0.4em] uppercase ${isRtl ? 'text-right' : ''}`}>ISTA_OFPPT_DIGITAL_SYSTEM</p>
                    </div>
                </div>

                {/* Right side (Form) */}
                <div className="flex-1 bg-white flex flex-col relative overflow-hidden">

                    {/* Fixed Header */}
                    <div className={`p-12 pb-8 border-b border-slate-50 flex justify-between items-start bg-white sticky top-0 z-30`}>
                        <div className={isRtl ? 'text-right' : ''}>
                            <h3 className="text-2xl font-black italic tracking-tight text-[var(--secondary)] uppercase mb-2">{t('modals.identity.title')}</h3>
                            <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">{t('modals.identity.subtitle')}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className={`p-3 hover:bg-slate-50 rounded-2xl transition-all text-slate-300 hover:text-[var(--secondary)] -mt-2 -mr-2`}
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto ista-scrollbar p-12 pt-8">
                        <form onSubmit={handleSubmit} className="space-y-10 flex flex-col min-h-full">
                            <div className="space-y-8">
                                {/* Rôle */}
                                <div className="relative space-y-3">
                                    <label className={`flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase ${isRtl ? 'flex-row-reverse' : ''}`}>
                                        <Shield className="w-3 h-3" />
                                        {t('modals.identity.access_level')}
                                    </label>
                                    <div
                                        onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                                        className={`w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 flex justify-between items-center cursor-pointer hover:border-[var(--primary)] transition-all ${isRtl ? 'flex-row-reverse' : ''}`}
                                    >
                                        <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                            <currentRole.icon className="w-4 h-4 text-[var(--primary)]" />
                                            <span className="text-sm font-bold text-[var(--secondary)] uppercase tracking-tight">{currentRole.label}</span>
                                        </div>
                                        <ChevronDown className={`w-5 h-5 text-[var(--primary)] transition-transform ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
                                    </div>

                                    {isRoleDropdownOpen && (
                                        <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                            {roles.map((role) => (
                                                <div
                                                    key={role.value}
                                                    className={`px-6 py-4 cursor-pointer flex items-center justify-between hover:bg-slate-50 transition-colors ${newUser.role === role.value ? 'bg-green-50' : ''} ${isRtl ? 'flex-row-reverse' : ''}`}
                                                    onClick={() => {
                                                        setNewUser({ ...newUser, role: role.value });
                                                        setIsRoleDropdownOpen(false);
                                                    }}
                                                >
                                                    <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                                        <role.icon className={`w-4 h-4 ${newUser.role === role.value ? 'text-[var(--primary)]' : 'text-slate-400'}`} />
                                                        <span className={`text-[10px] font-black uppercase tracking-widest ${newUser.role === role.value ? 'text-[var(--primary)]' : 'text-slate-400'}`}>{role.label}</span>
                                                    </div>
                                                    {newUser.role === role.value && <div className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full"></div>}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Nom Complet */}
                                <div className="space-y-3">
                                    <label className={`flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase ${isRtl ? 'flex-row-reverse' : ''}`}>
                                        <User className="w-3 h-3" />
                                        {t('modals.identity.full_name')}
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={newUser.name}
                                        onChange={e => {
                                            const name = e.target.value;
                                            const email = name.trim().toLowerCase().replace(/\s+/g, '.') + '@ofppt.ma';
                                            setNewUser({ ...newUser, name, email });
                                        }}
                                        placeholder={t('modals.identity.name_placeholder')}
                                        className={`w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-[var(--secondary)] focus:border-[var(--primary)] focus:ring-4 focus:ring-green-500/5 outline-none transition-all placeholder:text-slate-300 ${isRtl ? 'text-right' : ''}`}
                                    />
                                </div>

                                {/* Email & Password (Formateur / Admin only - Read Only) */}
                                {['formateur', 'admin'].includes(newUser.role) && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <label className={`flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase ${isRtl ? 'flex-row-reverse' : ''}`}>
                                                <Mail className="w-3 h-3" />
                                                EMAIL
                                            </label>
                                            <input
                                                type="email"
                                                disabled
                                                value={newUser.email || `${(newUser.name || 'nom').trim().toLowerCase().replace(/\s+/g, '.')}@ofppt.ma`}
                                                className={`w-full bg-slate-100/50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-400 outline-none transition-all cursor-not-allowed ${isRtl ? 'text-right' : ''}`}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className={`flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase ${isRtl ? 'flex-row-reverse' : ''}`}>
                                                <Lock className="w-3 h-3" />
                                                MOT DE PASSE PAR DÉFAUT
                                            </label>
                                            <input
                                                type="text"
                                                disabled
                                                value={(newUser.email || `${(newUser.name || 'nom').trim().toLowerCase().replace(/\s+/g, '.')}@ofppt.ma`).split('@')[0]}
                                                className={`w-full bg-slate-100/50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-400 outline-none transition-all cursor-not-allowed ${isRtl ? 'text-right' : ''}`}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* NumInscription (Stagiaire only) */}
                                {newUser.role === 'stagiaire' && (
                                    <div className="space-y-3">
                                        <label className={`flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase ${isRtl ? 'flex-row-reverse' : ''}`}>
                                            <Hash className="w-3 h-3" />
                                            {t('modals.identity.num_inscription') || 'Numéro d\'inscription'}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            disabled={isEditing}
                                            value={newUser.numInsc || newUser.id || ''}
                                            onChange={e => setNewUser({ ...newUser, numInsc: e.target.value.toUpperCase() })}
                                            placeholder="EX: STG12345..."
                                            className={`w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-[var(--secondary)] focus:border-[var(--primary)] focus:ring-4 focus:ring-green-500/5 outline-none transition-all placeholder:text-slate-300 ${isRtl ? 'text-right' : ''} ${isEditing ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                                        />
                                    </div>
                                )}

                                {/* Groupes */}
                                <div className="space-y-3 relative">
                                    <label className={`flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase ${isRtl ? 'flex-row-reverse' : ''}`}>
                                        <Briefcase className="w-3 h-3" />
                                        {t('modals.identity.group_assignment')}
                                    </label>


                                    <div
                                        onClick={() => setIsClassDropdownOpen(!isClassDropdownOpen)}
                                        className={`w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 flex justify-between items-center cursor-pointer hover:border-[var(--primary)] transition-all ${isRtl ? 'flex-row-reverse' : ''}`}
                                    >
                                        <span className={`text-sm font-bold truncate ${isRtl ? 'text-right' : ''} ${newUser.role === 'stagiaire'
                                            ? (newUser.group_id ? 'text-[var(--secondary)]' : 'text-slate-400')
                                            : (newUser.group_ids?.length > 0 ? 'text-[var(--secondary)]' : 'text-slate-400')
                                            }`}>
                                            {newUser.role === 'stagiaire'
                                                ? (newUser.group_id || t('modals.identity.select_group'))
                                                : (newUser.group_ids?.length > 0 ? newUser.group_ids.join(', ') : t('modals.identity.select_groups'))
                                            }
                                        </span>
                                        <ChevronDown className={`w-5 h-5 text-[var(--primary)] transition-transform ${isClassDropdownOpen ? 'rotate-180' : ''}`} />
                                    </div>

                                    {isClassDropdownOpen && (
                                        <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 max-h-48 overflow-y-auto ista-scrollbar animate-in fade-in zoom-in-95 duration-200">
                                            {availableGroups.map((grp) => {
                                                const isSelected = newUser.role === 'stagiaire'
                                                    ? newUser.group_id === grp.id
                                                    : newUser.group_ids?.includes(grp.id);

                                                return (
                                                    <div
                                                        key={grp.id}
                                                        className={`px-6 py-4 cursor-pointer flex items-center justify-between hover:bg-slate-50 transition-colors ${isSelected ? 'bg-green-50' : ''} ${isRtl ? 'flex-row-reverse text-right' : ''}`}
                                                        onClick={() => {
                                                            if (newUser.role === 'stagiaire') {
                                                                setNewUser({ 
                                                                    ...newUser, 
                                                                    group_id: grp.id,
                                                                    filiereId: grp.filiereId // Auto-sync Filière with Group
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
                                                        <span className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? 'text-[var(--primary)]' : 'text-slate-400'}`}>{grp.id}</span>
                                                        {isSelected ? <CheckSquare className="w-5 h-5 text-[var(--primary)]" /> : <Square className="w-5 h-5 text-slate-200" />}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                </div>                                {/* Filière (Stagiaire only - Auto-calculated) */}
                                {newUser.role === 'stagiaire' && (
                                    <div className="space-y-3">
                                        <label className={`flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase ${isRtl ? 'flex-row-reverse' : ''}`}>
                                            <BookOpen className="w-3 h-3" />
                                            FILIÈRE (ATTRIBUÉE PAR GROUPE)
                                        </label>
                                        <div
                                            className={`w-full bg-slate-100/50 border border-slate-100 rounded-2xl px-6 py-4 flex justify-between items-center transition-all cursor-not-allowed opacity-80 ${isRtl ? 'flex-row-reverse' : ''}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Layers className="w-4 h-4 text-slate-300" />
                                                <span className={`text-sm font-black italic uppercase tracking-tight text-slate-500 truncate`}>
                                                    {availableFilieres?.find(f => Number(f.id) === Number(newUser.filiereId))?.nom || t('modals.identity.unassigned') || 'AUCUN GROUPE SÉLECTIONNÉ'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 px-2 py-1 bg-slate-200/50 rounded-lg">
                                                <Lock className="w-2.5 h-2.5 text-slate-400" />
                                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Auto</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="w-full btn-ista py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-[0.99] transition-all"
                                >
                                    {isEditing ? <Save className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                                    <span>{isEditing ? t('modals.identity.save') : t('modals.identity.create')}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <style>{`
                .ista-scrollbar::-webkit-scrollbar { width: 4px; }
                .ista-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .ista-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
            `}</style>
            </div>
        </div>,
        document.body
    );
};

export default IdentityModal;
