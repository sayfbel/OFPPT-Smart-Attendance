import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { ChevronRight, X, ChevronDown, CheckSquare, Square } from 'lucide-react';

const ClassDossierModal = ({ isOpen, onClose, newClass, setNewClass, handleAddClass, formateurs = [] }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] bg-[var(--background)] flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
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
                            CLASS DOSSIER
                        </span>
                        <h2 className="text-6xl font-black italic tracking-tighter text-[var(--primary)] leading-[0.9]">
                            CLASS<br />LOG
                        </h2>
                    </div>

                    <div className="space-y-8 mt-auto">
                        <div>
                            <label className="block text-[8px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase mb-3 text-left">SYSTEM_ID</label>
                            <div className="px-5 py-4 bg-[var(--background)] border border-[var(--border-strong)] flex items-center">
                                <span className="text-xl font-black italic text-[var(--primary)] tracking-tighter">
                                    {newClass.id || 'N/A'}
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-[8px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase mb-3 text-left">CLASSIFICATION</label>
                            <div className="px-5 py-4 bg-[var(--background)] border border-[var(--border-strong)]">
                                <span className="text-sm font-black tracking-widest text-[var(--primary)] uppercase">
                                    {newClass.stream || 'SQUADRON DATA'}
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-[8px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase mb-3 text-left">OPERATIONAL_STATUS</label>
                            <div className="px-5 py-4 bg-[var(--background)] border border-[var(--border-strong)] flex items-center gap-3">
                                <div className="w-3 h-3 bg-[var(--primary)] flex items-center justify-center">
                                    <ChevronRight className="w-3 h-3 text-[var(--background)]" />
                                </div>
                                <span className="text-xs font-black tracking-widest text-[var(--primary)] uppercase">PENDING_INIT</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 pt-8 font-mono text-[8px] text-[var(--text-muted)] tracking-widest uppercase opacity-50 space-y-1 block text-left">
                        <p>SYSTEM_ID: NEW_ENTRY</p>
                        <p>STATUS: CREATION</p>
                        <p>ORIGIN: D.A.D_HQ_OPS</p>
                    </div>
                </div>

                {/* Right Column (Input Fields) */}
                <div className="flex-1 p-12 flex flex-col relative">
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 bg-[var(--surface)] border border-[var(--border-strong)] hover:border-[var(--primary)] transition-colors text-[var(--text-muted)] hover:text-[var(--primary)] z-10"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    <div className="mb-14 max-w-2xl">
                        <h3 className="text-2xl font-black italic tracking-tighter text-[var(--primary)] uppercase mb-2">CLASS DETAIL INPUT</h3>
                        <p className="text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase">Define visual and textual parameters for the new squadron.</p>
                    </div>

                    <form className="flex flex-col flex-1" onSubmit={handleAddClass}>
                        <div className="space-y-10 max-w-2xl">
                            <div>
                                <label className="block text-[10px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase mb-2">CLASS DESIGNATION (ID)</label>
                                <input
                                    type="text"
                                    required
                                    value={newClass.id}
                                    onChange={e => setNewClass({ ...newClass, id: e.target.value.toUpperCase() })}
                                    placeholder="ENTER SQUADRON ID... (E.G. DEV101)"
                                    className="w-full bg-transparent border-b border-[var(--border-strong)] py-4 text-sm font-black tracking-widest text-[var(--primary)] uppercase placeholder:text-[var(--border-strong)] focus:border-[var(--primary)] focus:outline-none transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase mb-2">SQUADRON FULL TITLE</label>
                                <input
                                    type="text"
                                    required
                                    value={newClass.title}
                                    onChange={e => setNewClass({ ...newClass, title: e.target.value })}
                                    placeholder="ENTER FULL TITLE... (E.G. DEV101 - SQUADRON)"
                                    className="w-full bg-transparent border-b border-[var(--border-strong)] py-4 text-sm font-black tracking-widest text-[var(--primary)] uppercase placeholder:text-[var(--border-strong)] focus:border-[var(--primary)] focus:outline-none transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase mb-2">STREAM SPECIFICATION</label>
                                <input
                                    type="text"
                                    required
                                    value={newClass.stream}
                                    onChange={e => setNewClass({ ...newClass, stream: e.target.value })}
                                    placeholder="ENTER STREAM... (E.G. FULL STACK WEB DEV)"
                                    className="w-full bg-transparent border-b border-[var(--border-strong)] py-4 text-sm font-black tracking-widest text-[var(--primary)] uppercase placeholder:text-[var(--border-strong)] focus:border-[var(--primary)] focus:outline-none transition-colors"
                                />
                            </div>

                            <div className="relative">
                                <label className="block text-[10px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase mb-2">TEAM LEAD FORMATEUR</label>

                                {/* Dropdown Trigger */}
                                <div
                                    className="w-full bg-transparent border-b border-[var(--border-strong)] py-4 flex justify-between items-center cursor-pointer group"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    <span className={`text-sm font-black tracking-widest uppercase truncate ${newClass.lead.length > 0 ? 'text-[var(--primary)]' : 'text-[var(--border-strong)]'}`}>
                                        {newClass.lead.length > 0 ? newClass.lead.join(', ') : 'SELECT LEAD FORMATEUR(S)...'}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 text-[var(--primary)] transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </div>

                                {/* Custom Dropdown Content */}
                                {isDropdownOpen && (
                                    <div className="absolute top-full left-0 w-full mt-2 bg-[var(--background)] border border-[var(--border-strong)] z-50 shadow-2xl max-h-48 overflow-y-auto custom-scrollbar fade-up">
                                        {formateurs.length === 0 ? (
                                            <div className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
                                                NO FORMATEURS FOUND
                                            </div>
                                        ) : (
                                            formateurs.map((formateur) => {
                                                const isSelected = newClass.lead.includes(formateur.name);
                                                return (
                                                    <div
                                                        key={formateur.id}
                                                        className={`px-6 py-4 cursor-pointer flex items-center justify-between transition-colors hover:bg-[var(--surface-hover)] group ${isSelected ? 'bg-[var(--surface-hover)]' : ''}`}
                                                        onClick={() => {
                                                            const newLeadArray = isSelected
                                                                ? newClass.lead.filter(l => l !== formateur.name)
                                                                : [...newClass.lead, formateur.name];

                                                            setNewClass({ ...newClass, lead: newLeadArray });
                                                        }}
                                                    >
                                                        <div className="flex flex-col">
                                                            <span className={`text-sm font-black tracking-widest uppercase transition-colors ${isSelected ? 'text-[var(--primary)]' : 'text-[var(--text-muted)] group-hover:text-[var(--primary)]'}`}>
                                                                {formateur.name}
                                                            </span>
                                                            <span className="text-[8px] font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase mt-1">
                                                                {formateur.email}
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
                        </div>

                        <div className="mt-auto flex justify-end pt-12 max-w-2xl">
                            <button
                                type="submit"
                                className="w-full md:w-auto bg-[var(--primary)] text-[var(--background)] px-12 py-5 font-black tracking-[0.3em] text-[11px] hover:bg-[var(--surface-hover)] hover:text-[var(--primary)] transition-colors border border-[var(--primary)]"
                            >
                                INITIALIZE CLASS
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ClassDossierModal;
