import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { ChevronRight, X, ChevronDown, CheckSquare, Square, UserPlus, Save, Mail, Shield, GraduationCap, Briefcase, Settings } from 'lucide-react';

const IdentityModal = ({ isOpen, onClose, newUser, setNewUser, handleAddUser, handleUpdateUser, selectedClass, availableClasses = [], isEditing = false }) => {
    const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
    const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);

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
        { value: 'stagiaire', label: 'Stagiaire', icon: GraduationCap },
        { value: 'formateur', label: 'Formateur', icon: Briefcase },
        { value: 'admin', label: 'Administrateur', icon: Shield }
    ];

    const currentRole = roles.find(r => r.value === newUser.role) || roles[0];

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300">
            <div className="bg-white rounded-[40px] w-full max-w-5xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row h-[90vh] max-h-[800px]">

                {/* Left side (Info/Status) */}
                <div className="w-full md:w-[35%] bg-gradient-to-b from-[var(--secondary)] to-[#003d6b] text-white p-12 flex flex-col">
                    <div className="mb-auto">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 mb-8">
                            <Settings className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-5xl font-black italic tracking-tighter leading-[0.9] mb-4">
                            {isEditing ? 'ÉDITION' : 'NOUVELLE'} <br /> <span className="text-[var(--primary)]">IDENTITÉ</span>
                        </h2>
                        <p className="text-[10px] font-bold text-white/50 tracking-[0.3em] uppercase">Service de Gestion des Comptes</p>
                    </div>

                    <div className="space-y-8 mt-12 bg-black/10 p-8 rounded-3xl border border-white/5">
                        <div className="space-y-1">
                            <p className="text-[9px] font-black text-white/40 tracking-widest uppercase">ID SYSTÈME</p>
                            <p className="text-sm font-black italic uppercase tracking-tight">{isEditing ? `ID_${newUser.id.toString().padStart(4, '0')}` : 'GÉNÉRATION AUTO'}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[9px] font-black text-white/40 tracking-widest uppercase">GROUPE ACTUEL</p>
                            <p className="text-sm font-black italic uppercase tracking-tight text-[var(--primary)]">{selectedClass || 'ACCÈS GLOBAL'}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[9px] font-black text-white/40 tracking-widest uppercase">STATUT</p>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-[var(--primary)] rounded-full animate-pulse"></div>
                                <p className="text-[10px] font-black uppercase tracking-widest">{isEditing ? 'MISE À JOUR' : 'INITIALISATION'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto hidden md:block">
                        <p className="text-[8px] font-bold text-white/30 tracking-[0.4em] uppercase">ISTA_OFPPT_D.A.D_SYSTEM_v2.0</p>
                    </div>
                </div>

                {/* Right side (Form) */}
                <div className="flex-1 bg-white p-12 flex flex-col relative overflow-y-auto ista-scrollbar">
                    <button
                        onClick={onClose}
                        className="absolute top-8 right-8 p-3 hover:bg-slate-50 rounded-2xl transition-all text-slate-300 hover:text-[var(--secondary)]"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="mb-12">
                        <h3 className="text-2xl font-black italic tracking-tight text-[var(--secondary)] uppercase mb-2">Détails de l'utilisateur</h3>
                        <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Veuillez renseigner les paramètres d'accès ci-dessous.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10 flex-1 flex flex-col">
                        <div className="space-y-8">
                            {/* Nom Complet */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                    <User className="w-3 h-3" />
                                    Nom Complet
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
                                    placeholder="Prénom et Nom..."
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-[var(--secondary)] focus:border-[var(--primary)] focus:ring-4 focus:ring-green-500/5 outline-none transition-all placeholder:text-slate-300"
                                />
                            </div>

                            {/* Rôle */}
                            <div className="relative space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                    <Shield className="w-3 h-3" />
                                    Niveau d'Accès
                                </label>
                                <div
                                    onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 flex justify-between items-center cursor-pointer hover:border-[var(--primary)] transition-all"
                                >
                                    <div className="flex items-center gap-3">
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
                                                className={`px-6 py-4 cursor-pointer flex items-center justify-between hover:bg-slate-50 transition-colors ${newUser.role === role.value ? 'bg-green-50' : ''}`}
                                                onClick={() => {
                                                    setNewUser({ ...newUser, role: role.value });
                                                    setIsRoleDropdownOpen(false);
                                                }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <role.icon className={`w-4 h-4 ${newUser.role === role.value ? 'text-[var(--primary)]' : 'text-slate-400'}`} />
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${newUser.role === role.value ? 'text-[var(--primary)]' : 'text-slate-400'}`}>{role.label}</span>
                                                </div>
                                                {newUser.role === role.value && <div className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full"></div>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Groupes */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                    <Briefcase className="w-3 h-3" />
                                    Affectation aux Groupes
                                </label>
                                {newUser.role === 'admin' ? (
                                    <div className="px-6 py-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                                        <p className="text-[10px] font-black text-slate-400 uppercase italic">Accès global au système - Aucun groupe requis</p>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <div
                                            onClick={() => setIsClassDropdownOpen(!isClassDropdownOpen)}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 flex justify-between items-center cursor-pointer hover:border-[var(--primary)] transition-all"
                                        >
                                            <span className={`text-sm font-bold truncate ${newUser.role === 'stagiaire'
                                                ? (newUser.class_id ? 'text-[var(--secondary)]' : 'text-slate-400')
                                                : (newUser.class_ids?.length > 0 ? 'text-[var(--secondary)]' : 'text-slate-400')
                                                }`}>
                                                {newUser.role === 'stagiaire'
                                                    ? (newUser.class_id || 'SÉLECTIONNER UN GROUPE...')
                                                    : (newUser.class_ids?.length > 0 ? newUser.class_ids.join(', ') : 'SÉLECTIONNER LES GROUPES...')
                                                }
                                            </span>
                                            <ChevronDown className={`w-5 h-5 text-[var(--primary)] transition-transform ${isClassDropdownOpen ? 'rotate-180' : ''}`} />
                                        </div>

                                        {isClassDropdownOpen && (
                                            <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 max-h-48 overflow-y-auto ista-scrollbar animate-in fade-in zoom-in-95 duration-200">
                                                {availableClasses.map((cls) => {
                                                    const isSelected = newUser.role === 'stagiaire'
                                                        ? newUser.class_id === cls.id
                                                        : newUser.class_ids?.includes(cls.id);

                                                    return (
                                                        <div
                                                            key={cls.id}
                                                            className={`px-6 py-4 cursor-pointer flex items-center justify-between hover:bg-slate-50 transition-colors ${isSelected ? 'bg-green-50' : ''}`}
                                                            onClick={() => {
                                                                if (newUser.role === 'stagiaire') {
                                                                    setNewUser({ ...newUser, class_id: cls.id });
                                                                    setIsClassDropdownOpen(false);
                                                                } else {
                                                                    const currentIds = newUser.class_ids || [];
                                                                    const newClassArray = isSelected
                                                                        ? currentIds.filter(id => id !== cls.id)
                                                                        : [...currentIds, cls.id];
                                                                    setNewUser({ ...newUser, class_ids: newClassArray });
                                                                }
                                                            }}
                                                        >
                                                            <span className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? 'text-[var(--primary)]' : 'text-slate-400'}`}>{cls.id}</span>
                                                            {isSelected ? <CheckSquare className="w-5 h-5 text-[var(--primary)]" /> : <Square className="w-5 h-5 text-slate-200" />}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-auto pt-12">
                            <button
                                type="submit"
                                className="w-full btn-ista py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-[0.99] transition-all"
                            >
                                {isEditing ? <Save className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                                <span>{isEditing ? 'Enregistrer les modifications' : 'Créer le profil utilisateur'}</span>
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
        </div>,
        document.body
    );
};

export default IdentityModal;
