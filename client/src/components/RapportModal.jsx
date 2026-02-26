import React from 'react';
import ReactDOM from 'react-dom';
import { X, ChevronDown } from 'lucide-react';

const RapportModal = ({ isOpen, onClose, rapport }) => {
    if (!isOpen || !rapport) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] bg-[var(--background)] flex items-center justify-center p-4 sm:p-8 overflow-y-auto w-full h-full">
            <div className="bg-[var(--background)] w-full max-w-7xl h-[90vh] min-h-[700px] flex flex-col md:flex-row relative fade-up">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 bg-[var(--surface)] border border-[var(--border-strong)] hover:border-[var(--primary)] transition-colors text-[var(--text-muted)] hover:text-[var(--primary)] z-10"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Corner accents (white) */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[var(--primary)] -translate-x-4 -translate-y-4"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[var(--primary)] translate-x-4 -translate-y-4"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[var(--primary)] -translate-x-4 translate-y-4"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[var(--primary)] translate-x-4 translate-y-4"></div>

                {/* Left Column (Info Panel) */}
                <div className="w-full md:w-[380px] border-r border-[var(--border-strong)] p-12 flex flex-col relative">
                    <div className="mb-12">
                        <span className="flex items-center gap-2 text-[10px] font-black tracking-[0.3em] text-[var(--primary)] uppercase mb-4">
                            <div className="w-2 h-2 bg-[var(--primary)]"></div>
                            RAPPORT MANIFEST
                        </span>
                        <h2 className="text-5xl font-black italic tracking-tighter text-[var(--primary)] leading-[0.9]">
                            ABSENCE<br />REPORT
                        </h2>
                    </div>

                    <div className="space-y-8 mt-auto">
                        <div>
                            <label className="block text-[8px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase mb-3 text-left">DOCUMENT ID</label>
                            <div className="px-5 py-4 bg-[var(--background)] border border-[var(--border-strong)] flex items-center">
                                <span className="text-xl font-black italic text-[var(--primary)] tracking-tighter">
                                    {rapport.id}
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-[8px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase mb-3 text-left">STATUS</label>
                            <div className={`px-5 py-4 bg-[var(--background)] border flex items-center gap-3 ${rapport.status === 'JUSTIFIED' ? 'border-[var(--primary)]' : 'border-red-500'}`}>
                                <div className={`w-3 h-3 flex items-center justify-center ${rapport.status === 'JUSTIFIED' ? 'bg-[var(--primary)]' : 'bg-red-500'}`}>
                                    <ChevronDown className="w-3 h-3 text-[var(--background)] -rotate-90" />
                                </div>
                                <span className={`text-xs font-black tracking-widest uppercase ${rapport.status === 'JUSTIFIED' ? 'text-[var(--primary)]' : 'text-red-500'}`}>
                                    {rapport.status.replace('_', ' ')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column (Details) */}
                <div className="flex-1 p-12 flex flex-col relative h-[100%] overflow-hidden">
                    <div className="mb-10 max-w-2xl shrink-0">
                        <h3 className="text-2xl font-black italic tracking-tighter text-[var(--primary)] uppercase mb-2">INCIDENT DETAILS</h3>
                        <p className="text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase">Complete telemetry log for the recorded absence.</p>
                    </div>

                    <div className="space-y-8 flex-1 overflow-y-auto custom-scrollbar">
                        <div>
                            <label className="block text-[10px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase mb-2">MODULE SESSION</label>
                            <div className="w-full bg-transparent border-b border-[var(--border-strong)] py-4">
                                <span className="text-md font-black tracking-widest text-[var(--text-main)] uppercase">{rapport.subject}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <label className="block text-[10px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase mb-2">FORMATEUR</label>
                                <div className="w-full bg-transparent border-b border-[var(--border-strong)] py-4">
                                    <span className="text-md font-black tracking-widest text-[var(--text-main)] uppercase">{rapport.formateur}</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase mb-2">DATE UTC</label>
                                <div className="w-full bg-transparent border-b border-[var(--border-strong)] py-4">
                                    <span className="text-md font-black font-mono tracking-widest text-[var(--text-main)] uppercase">{rapport.date}</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase mb-2">SALLE (ROOM)</label>
                                <div className="w-full bg-transparent border-b border-[var(--border-strong)] py-4">
                                    <span className="text-md font-black tracking-widest text-[var(--text-main)] uppercase">{rapport.salle || 'N/A'}</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase mb-2">SEANCE (TIME)</label>
                                <div className="w-full bg-transparent border-b border-[var(--border-strong)] py-4">
                                    <span className="text-md font-black font-mono tracking-widest text-[var(--text-main)] uppercase">{rapport.heure || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase mb-4 mt-6">STAGIAIRES ROLL CALL</label>
                            <div className="border border-[var(--border-strong)] bg-[var(--surface)] max-h-[300px] overflow-y-auto custom-scrollbar">
                                <table className="w-full text-left border-collapse">
                                    <thead className="sticky top-0 bg-[var(--surface)] z-10 border-b border-[var(--border-strong)]">
                                        <tr className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                                            <th className="p-4">Cadet Alias</th>
                                            <th className="p-4 text-right">Attendance</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--border-strong)]">
                                        {(rapport.stagiaires || []).map((stagiaire, idx) => (
                                            <tr key={idx} className="hover:bg-[var(--surface-hover)] transition-colors">
                                                <td className="p-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold tracking-widest text-[var(--primary)] uppercase">{stagiaire.name}</span>
                                                        <span className="text-[9px] font-bold tracking-widest text-[var(--text-muted)] uppercase">{stagiaire.id}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <span className={`text-[9px] font-black tracking-[0.2em] px-3 py-1 border ${stagiaire.status === 'ABSENT' ? 'border-red-500 text-red-500 bg-red-500/10' : 'border-[var(--primary)] text-[var(--primary)] bg-[var(--primary)]/10'}`}>
                                                        {stagiaire.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="pt-8 mt-auto flex justify-end">
                            <div className="flex flex-col items-center">
                                <label className="text-[8px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase mb-2">DIGITAL SIGNATURE</label>
                                <div className="px-8 py-3 border border-dashed border-[var(--primary)] bg-[var(--primary)]/5">
                                    <span className="font-['Brush_Script_MT',cursive] italic text-2xl text-[var(--primary)] tracking-wider">
                                        {rapport.formateur}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default RapportModal;
