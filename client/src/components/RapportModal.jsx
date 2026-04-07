import React from 'react';
import ReactDOM from 'react-dom';
import { X, ChevronDown, FileText, Calendar, User, MapPin, Clock, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const RapportModal = ({ isOpen, onClose, rapport }) => {
    const { t } = useTranslation();
    if (!isOpen || !rapport) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300">
            <div className="bg-white rounded-[40px] w-full max-w-6xl h-[90vh] max-h-[850px] flex flex-col md:flex-row shadow-2xl relative overflow-hidden">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-8 right-8 p-3 hover:bg-slate-50 rounded-2xl transition-all text-slate-300 hover:text-[var(--secondary)] z-10"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Left Side (Branding & Status) */}
                <div className="w-full md:w-[35%] bg-gradient-to-br from-[var(--secondary)] to-[#003d6b] text-white p-12 flex flex-col">
                    <div className="mb-auto">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 mb-8">
                            <FileText className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-5xl font-black italic tracking-tighter leading-[0.9] mb-4">
                            {t('modals.report.title')} <br /> <span className="text-[var(--primary)]">{t('modals.report.subtitle')}</span>
                        </h2>
                        <p className="text-[10px] font-bold text-white/50 tracking-[0.3em] uppercase">{t('modals.report.official')}</p>
                    </div>

                    <div className="space-y-8 mt-12 bg-black/10 p-8 rounded-3xl border border-white/5">
                        <div className="space-y-1">
                            <p className="text-[9px] font-black text-white/40 tracking-widest uppercase">{t('modals.report.doc_code')}</p>
                            <p className="text-xl font-black italic uppercase tracking-tight text-[var(--primary)]">{rapport.id}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[9px] font-black text-white/40 tracking-widest uppercase">{t('modals.report.status_label')}</p>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full animate-pulse ${rapport.status === 'VALIDATED' ? 'bg-[var(--primary)]' : 'bg-gold-500'}`}></div>
                                <p className="text-[10px] font-black uppercase tracking-widest">
                                    {rapport.status === 'VALIDATED' ? t('modals.report.status_validated') : t('modals.report.status_waiting')}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[9px] font-black text-white/40 tracking-widest uppercase">{t('modals.report.group_label')}</p>
                            <p className="text-sm font-bold uppercase tracking-tight text-white/70">{rapport.group_id}</p>
                        </div>
                    </div>

                    <div className="mt-auto hidden md:block">
                        <p className="text-[8px] font-bold text-white/30 tracking-[0.4em] uppercase">ISTA_OFPPT_D.A.D_ARCHIVE_v3</p>
                    </div>
                </div>

                {/* Right Side (Content) */}
                <div className="flex-1 bg-white p-12 flex flex-col relative overflow-y-auto ista-scrollbar">
                    <div className="mb-12">
                        <h3 className="text-2xl font-black italic tracking-tight text-[var(--secondary)] uppercase mb-2">{t('modals.report.details_title')}</h3>
                        <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">{t('modals.report.details_sub')}</p>
                    </div>

                    <div className="space-y-10">
                        {/* Header Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-1 border-l-4 border-[var(--primary)] pl-6">
                                <p className="text-[9px] font-black text-slate-400 tracking-widest uppercase">{t('modals.report.module_label')}</p>
                                <p className="text-lg font-black italic text-[var(--secondary)] uppercase">{rapport.subject}</p>
                            </div>
                            <div className="space-y-1 border-l-4 border-slate-100 pl-6">
                                <p className="text-[9px] font-black text-slate-400 tracking-widest uppercase">{t('modals.report.formateur_label')}</p>
                                <p className="text-lg font-black italic text-[var(--secondary)] uppercase">{rapport.formateur}</p>
                            </div>
                            <div className="space-y-1 border-l-4 border-slate-100 pl-6">
                                <p className="text-[9px] font-black text-slate-400 tracking-widest uppercase">{t('modals.report.date_label')}</p>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-3 h-3 text-[var(--primary)]" />
                                    <p className="text-sm font-bold text-[var(--secondary)] uppercase font-mono">{rapport.date}</p>
                                </div>
                            </div>
                            <div className="space-y-1 border-l-4 border-slate-100 pl-6">
                                <p className="text-[9px] font-black text-slate-400 tracking-widest uppercase">{t('modals.report.schedule_label')}</p>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-3 h-3 text-[var(--primary)]" />
                                        <p className="text-sm font-bold text-[var(--secondary)] uppercase font-mono">{rapport.heure || 'N/A'}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-3 h-3 text-[var(--primary)]" />
                                        <p className="text-sm font-bold text-[var(--secondary)] uppercase">{rapport.salle || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Student List */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                    <Search className="w-3 h-3 text-[var(--primary)]" />
                                    {t('modals.report.list_label')}
                                </label>
                                <span className="text-[10px] font-black text-[var(--primary)] uppercase">
                                    {t('modals.report.present_count', { present: (rapport.stagiaires || []).filter(s => s.status === 'PRESENT').length, total: (rapport.stagiaires || []).length })}
                                </span>
                            </div>
                            <div className="border border-slate-100 rounded-3xl overflow-hidden bg-slate-50/30">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                            <th className="p-6">{t('accounts.student_name')}</th>
                                            <th className="p-6">{t('common.matricule')}</th>
                                            <th className="p-6 text-right">Statut</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {(rapport.stagiaires || []).map((stagiaire, idx) => (
                                            <tr key={idx} className="hover:bg-white transition-colors">
                                                <td className="p-6">
                                                    <span className="text-sm font-black italic text-[var(--secondary)] uppercase">{stagiaire.name}</span>
                                                </td>
                                                <td className="p-6">
                                                    <span className="text-[10px] font-bold text-slate-400 font-mono tracking-widest">{stagiaire.id}</span>
                                                </td>
                                                <td className="p-6 text-right">
                                                    <span className={`text-[9px] font-black tracking-widest px-4 py-1.5 rounded-lg border ${stagiaire.status === 'ABSENT' ? 'border-red-500 text-red-500 bg-red-50' : 'border-[var(--primary)] text-[var(--primary)] bg-green-50'}`}>
                                                        {stagiaire.status === 'PRESENT' ? t('dashboard.present') : t('dashboard.absent')}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Signature */}
                        <div className="pt-8 flex justify-end">
                            <div className="flex flex-col items-center">
                                <label className="text-[9px] font-black tracking-[0.3em] text-[var(--secondary)] uppercase mb-4">{t('modals.report.signature_label')}</label>
                                <div className="w-64 h-32 bg-slate-50 border border-dashed border-slate-200 rounded-[24px] flex items-center justify-center p-6 shadow-inner relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>
                                    {rapport.signature ? (
                                        <img src={rapport.signature} alt="Signature" className="max-h-full relative z-10" />
                                    ) : (
                                        <span className="font-['Brush_Script_MT',cursive] italic text-3xl text-[var(--secondary)] opacity-10 relative z-10">
                                            {rapport.formateur}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
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

export default RapportModal;
