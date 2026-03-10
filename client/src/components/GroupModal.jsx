import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { X, CheckSquare, Square, ChevronDown, BookOpen, UserCheck, Hash } from 'lucide-react';

const GroupModal = ({ isOpen, onClose, newClass, setNewClass, handleAddClass, formateurs = [] }) => {
    const [isFormateurDropdownOpen, setIsFormateurDropdownOpen] = useState(false);

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl relative overflow-hidden flex flex-col">

                {/* Header */}
                <div className="p-8 border-b border-[var(--border)] bg-gradient-to-r from-[var(--secondary)] to-[#003d6b] text-white">
                    <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-all">
                        <X className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black uppercase italic leading-none mb-1">Initialiser un Groupe</h2>
                            <p className="text-[10px] font-bold text-white/60 tracking-widest uppercase">Configuration de la nouvelle division</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleAddClass} className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black tracking-widest text-[var(--text-muted)] uppercase">CODE DU GROUPE</label>
                            <input
                                type="text"
                                required
                                value={newClass.id}
                                onChange={e => setNewClass({ ...newClass, id: e.target.value.toUpperCase() })}
                                placeholder="EX: DEV101"
                                className="w-full bg-slate-50 border border-[var(--border)] rounded-xl p-4 text-sm font-bold text-[var(--secondary)] focus:ring-4 focus:ring-green-500/10 focus:border-[var(--primary)] outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black tracking-widest text-[var(--text-muted)] uppercase">FILIÈRE / STREAM</label>
                            <input
                                type="text"
                                required
                                value={newClass.stream}
                                onChange={e => setNewClass({ ...newClass, stream: e.target.value.toUpperCase() })}
                                placeholder="EX: DÉVELOPPEMENT DIGITAL"
                                className="w-full bg-slate-50 border border-[var(--border)] rounded-xl p-4 text-sm font-bold text-[var(--secondary)] focus:ring-4 focus:ring-green-500/10 focus:border-[var(--primary)] outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black tracking-widest text-[var(--text-muted)] uppercase">NOM DU GROUPE / TITRE</label>
                        <input
                            type="text"
                            required
                            value={newClass.title}
                            onChange={e => setNewClass({ ...newClass, title: e.target.value })}
                            placeholder="EX: Développement Digital 101"
                            className="w-full bg-slate-50 border border-[var(--border)] rounded-xl p-4 text-sm font-bold text-[var(--secondary)] focus:ring-4 focus:ring-green-500/10 focus:border-[var(--primary)] outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-2 relative">
                        <label className="text-[10px] font-black tracking-widest text-[var(--text-muted)] uppercase">FORMATEURS RÉFÉRENTS</label>
                        <div
                            onClick={() => setIsFormateurDropdownOpen(!isFormateurDropdownOpen)}
                            className="w-full bg-slate-50 border border-[var(--border)] rounded-xl p-4 flex justify-between items-center cursor-pointer hover:border-[var(--primary)] transition-all"
                        >
                            <span className={`text-sm font-bold truncate ${newClass.lead?.length > 0 ? 'text-[var(--secondary)]' : 'text-slate-400'}`}>
                                {newClass.lead?.length > 0 ? newClass.lead.join(', ') : 'Sélectionner les formateurs...'}
                            </span>
                            <ChevronDown className={`w-5 h-5 text-[var(--primary)] transition-transform ${isFormateurDropdownOpen ? 'rotate-180' : ''}`} />
                        </div>

                        {isFormateurDropdownOpen && (
                            <div className="absolute top-full left-0 w-full mt-2 bg-white border border-[var(--border)] rounded-xl shadow-2xl z-50 max-h-48 overflow-y-auto ista-scrollbar">
                                {formateurs.map((f) => {
                                    const isSelected = newClass.lead?.includes(f.name);
                                    return (
                                        <div
                                            key={f.id}
                                            className={`px-6 py-4 cursor-pointer flex items-center justify-between hover:bg-slate-50 transition-colors ${isSelected ? 'bg-green-50' : ''}`}
                                            onClick={() => {
                                                const currentLeads = newClass.lead || [];
                                                const newLeads = isSelected
                                                    ? currentLeads.filter(l => l !== f.name)
                                                    : [...currentLeads, f.name];
                                                setNewClass({ ...newClass, lead: newLeads });
                                            }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] font-black text-[var(--secondary)]">
                                                    {f.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <span className="text-xs font-bold text-[var(--secondary)] uppercase">{f.name}</span>
                                            </div>
                                            {isSelected ? <CheckSquare className="w-5 h-5 text-[var(--primary)]" /> : <Square className="w-5 h-5 text-slate-300" />}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full btn-ista py-5 rounded-xl font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-[0.99] transition-all"
                        >
                            <UserCheck className="w-5 h-5" />
                            Créer le Groupe
                        </button>
                    </div>
                </form>

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

export default GroupModal;
