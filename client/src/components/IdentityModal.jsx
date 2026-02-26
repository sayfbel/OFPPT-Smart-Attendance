import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { ChevronRight, X, ChevronDown, CheckSquare, Square } from 'lucide-react';

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

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] bg-[var(--background)] flex items-center justify-center p-4 sm:p-8 overflow-y-auto w-full h-full">
            <div className="bg-[var(--background)] w-full max-w-7xl flex flex-col md:flex-row relative fade-up my-auto h-[80vh] min-h-[600px]">

                {/* Corner accents (white) */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[var(--primary)] -translate-x-4 -translate-y-4"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[var(--primary)] translate-x-4 -translate-y-4"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[var(--primary)] -translate-x-4 translate-y-4"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[var(--primary)] translate-x-4 translate-y-4"></div>

                {/* Left Column (Info Panel) */}
                <div className="w-full md:w-[400px] border-r border-[var(--border-strong)] p-12 flex flex-col relative">

                    <div className="mb-12">
                        <span className="flex items-center gap-2 text-[10px] font-black tracking-[0.3em] text-[var(--primary)] uppercase mb-4">
                            <div className="w-2 h-2 bg-[var(--primary)]"></div>
                            IDENTITY MANIFEST
                        </span>
                        <h2 className="text-6xl font-black italic tracking-tighter text-[var(--primary)] leading-[0.9]">
                            USER<br />{isEditing ? 'EDIT' : 'LOG'}
                        </h2>
                    </div>

                    <div className="space-y-8 mt-auto">
                        <div>
                            <label className="block text-[8px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase mb-3 text-left">TARGET NODE</label>
                            <div className="px-5 py-4 bg-[var(--background)] border border-[var(--border-strong)] flex items-center">
                                <span className="text-xl font-black italic text-[var(--primary)] tracking-tighter">
                                    NODE_ID: {isEditing ? newUser.id : 'PENDING'}
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-[8px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase mb-3 text-left">ASSIGNED CLUSTER</label>
                            <div className="px-5 py-4 bg-[var(--background)] border border-[var(--border-strong)]">
                                <span className="text-sm font-black tracking-widest text-[var(--primary)] uppercase">
                                    {selectedClass || 'SYSTEM WIDE'}
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-[8px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase mb-3 text-left">AUTHORIZATION STATUS</label>
                            <div className="px-5 py-4 bg-[var(--background)] border border-[var(--border-strong)] flex items-center gap-3">
                                <div className="w-3 h-3 bg-[var(--primary)] flex items-center justify-center">
                                    <ChevronRight className="w-3 h-3 text-[var(--background)]" />
                                </div>
                                <span className="text-xs font-black tracking-widest text-[var(--primary)] uppercase">
                                    {isEditing ? 'PENDING_UPDATE' : 'PENDING_INIT'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 pt-8 font-mono text-[8px] text-[var(--text-muted)] tracking-widest uppercase opacity-50 space-y-1 block text-left">
                        <p>SYSTEM_ID: {isEditing ? newUser.id : 'SYSTEM_GEN'}</p>
                        <p>STATUS: {isEditing ? 'MODIFICATION' : 'CREATION'}</p>
                        <p>ORIGIN: D.A.D_HQ_OPS</p>
                    </div>
                </div>

                {/* Right Column (Input Fields) */}
                <div className="flex-1 p-12 flex flex-col relative overflow-y-auto">
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 bg-[var(--surface)] border border-[var(--border-strong)] hover:border-[var(--primary)] transition-colors text-[var(--text-muted)] hover:text-[var(--primary)] z-10"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    <div className="mb-14 max-w-2xl">
                        <h3 className="text-2xl font-black italic tracking-tighter text-[var(--primary)] uppercase mb-2">IDENTITY DETAIL INPUT</h3>
                        <p className="text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase">
                            {isEditing ? 'Modify personal and access parameters for the existing node.' : 'Define personal and access parameters for the new node.'}
                        </p>
                    </div>

                    <form className="flex flex-col flex-1" onSubmit={handleSubmit}>
                        <div className="space-y-10 max-w-2xl">
                            <div>
                                <label className="block text-[10px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase mb-2">FULL NAME (ALIAS)</label>
                                <input
                                    type="text"
                                    required
                                    value={newUser.name}
                                    onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                                    placeholder="ENTER FULL NAME..."
                                    className="w-full bg-transparent border-b border-[var(--border-strong)] py-4 text-sm font-black tracking-widest text-[var(--primary)] uppercase placeholder:text-[var(--border-strong)] focus:border-[var(--primary)] focus:outline-none transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase mb-2">EMAIL ADDRESS (COM-LINK)</label>
                                <input
                                    type="email"
                                    required
                                    value={newUser.email}
                                    onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                    placeholder="ENTER EMAIL..."
                                    className="w-full bg-transparent border-b border-[var(--border-strong)] py-4 text-sm font-black tracking-widest text-[var(--primary)] uppercase placeholder:text-[var(--border-strong)] focus:border-[var(--primary)] focus:outline-none transition-colors"
                                />
                            </div>

                            <div className="relative">
                                <label className="block text-[10px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase mb-2">ACCESS LEVEL (ROLE)</label>
                                <div
                                    className="w-full bg-[var(--background)] border-b border-[var(--border-strong)] py-4 flex justify-between items-center cursor-pointer group"
                                    onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                                >
                                    <span className="text-sm font-black tracking-widest text-[var(--primary)] uppercase">
                                        {newUser.role === 'stagiaire' ? 'STAGIAIRE (CADET)' :
                                            newUser.role === 'formateur' ? 'FORMATEUR (OFFICER)' :
                                                'ADMINISTRATOR (COMMANDER)'}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 text-[var(--primary)] transition-transform duration-300 ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
                                </div>

                                {isRoleDropdownOpen && (
                                    <div className="absolute top-full left-0 w-full mt-2 bg-[var(--background)] border border-[var(--border-strong)] z-50 fade-up shadow-2xl">
                                        {[
                                            { value: 'stagiaire', label: 'STAGIAIRE (CADET)' },
                                            { value: 'formateur', label: 'FORMATEUR (OFFICER)' },
                                            { value: 'admin', label: 'ADMINISTRATOR (COMMANDER)' }
                                        ].map((roleOption) => (
                                            <div
                                                key={roleOption.value}
                                                className={`px-6 py-4 cursor-pointer text-sm font-black tracking-widest uppercase transition-colors hover:bg-[var(--surface-hover)] ${newUser.role === roleOption.value ? 'bg-[var(--primary)] text-[var(--background)] hover:bg-[var(--primary)]' : 'text-[var(--text-muted)] hover:text-[var(--primary)]'}`}
                                                onClick={() => {
                                                    setNewUser({ ...newUser, role: roleOption.value });
                                                    setIsRoleDropdownOpen(false);
                                                }}
                                            >
                                                {roleOption.label}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-[10px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase mb-2">SQUADRON DEPLOYMENT (CLASS_ID)</label>

                                {newUser.role === 'admin' ? (
                                    <div className="px-5 py-4 bg-[var(--surface)] border border-[var(--border-strong)] opacity-50">
                                        <span className="text-xs font-black tracking-widest text-[var(--text-muted)] uppercase italic">SYSTEM WIDE ACCESS - NO CLUSTER REQUIRED</span>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <div
                                            className="w-full bg-transparent border-b border-[var(--border-strong)] py-4 flex justify-between items-center cursor-pointer group"
                                            onClick={() => setIsClassDropdownOpen(!isClassDropdownOpen)}
                                        >
                                            <span className={`text-sm font-black tracking-widest uppercase truncate ${newUser.role === 'stagiaire'
                                                ? (newUser.class_id ? 'text-[var(--primary)]' : 'text-[var(--border-strong)]')
                                                : (newUser.class_ids?.length > 0 ? 'text-[var(--primary)]' : 'text-[var(--border-strong)]')
                                                }`}>
                                                {newUser.role === 'stagiaire'
                                                    ? (newUser.class_id || 'SELECT SQUADRON...')
                                                    : (newUser.class_ids?.length > 0 ? newUser.class_ids.join(', ') : 'SELECT SQUADRON(S)...')
                                                }
                                            </span>
                                            <ChevronDown className={`w-4 h-4 text-[var(--primary)] transition-transform duration-300 ${isClassDropdownOpen ? 'rotate-180' : ''}`} />
                                        </div>

                                        {isClassDropdownOpen && (
                                            <div className="absolute top-full left-0 w-full mt-2 bg-[var(--background)] border border-[var(--border-strong)] z-50 shadow-2xl max-h-48 overflow-y-auto custom-scrollbar fade-up">
                                                {availableClasses.length === 0 ? (
                                                    <div className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
                                                        NO SQUADRONS FOUND
                                                    </div>
                                                ) : (
                                                    availableClasses.map((cls) => {
                                                        const isSelected = newUser.role === 'stagiaire'
                                                            ? newUser.class_id === cls.id
                                                            : newUser.class_ids?.includes(cls.id);

                                                        return (
                                                            <div
                                                                key={cls.id}
                                                                className={`px-6 py-4 cursor-pointer flex items-center justify-between transition-colors hover:bg-[var(--surface-hover)] group ${isSelected ? 'bg-[var(--surface-hover)]' : ''}`}
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
                                                                <div className="flex flex-col">
                                                                    <span className={`text-sm font-black tracking-widest uppercase transition-colors ${isSelected ? 'text-[var(--primary)]' : 'text-[var(--text-muted)] group-hover:text-[var(--primary)]'}`}>
                                                                        {cls.id}
                                                                    </span>
                                                                </div>
                                                                {isSelected ? (
                                                                    <CheckSquare className="w-4 h-4 text-[var(--primary)]" />
                                                                ) : (
                                                                    <Square className="w-4 h-4 text-[var(--border-strong)] group-hover:text-[var(--primary)] transition-colors" />
                                                                )}
                                                            </div>
                                                        );
                                                    })
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-auto flex justify-end pt-12 max-w-2xl">
                            <button
                                type="submit"
                                className="w-full md:w-auto bg-[var(--primary)] text-[var(--background)] px-12 py-5 font-black tracking-[0.3em] text-[11px] hover:bg-[var(--surface-hover)] hover:text-[var(--primary)] transition-colors border border-[var(--primary)]"
                            >
                                {isEditing ? 'UPDATE IDENTITY' : 'INITIALIZE IDENTITY'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default IdentityModal;
