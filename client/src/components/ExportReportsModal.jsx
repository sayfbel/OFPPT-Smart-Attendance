import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, FileText, Calendar, User, Download, Filter, CheckCircle2, ChevronRight, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CustomDatePicker from './CustomDatePicker';

const ExportReportsModal = ({ isOpen, onClose, onExport, allReports, availableGroups }) => {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';
    const [exportType, setExportType] = useState('ALL'); // ALL, WEEKLY, FORMATEUR, CUSTOM
    const [selectedFormateur, setSelectedFormateur] = useState('ALL');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('ALL');

    const [isFormateurDropdownOpen, setIsFormateurDropdownOpen] = useState(false);
    const [isGroupDropdownOpen, setIsGroupDropdownOpen] = useState(false);
    const dropdownRef = React.useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsFormateurDropdownOpen(false);
                setIsGroupDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!isOpen) return null;

    const availableFormateurs = [...new Set(allReports.map(r => r.formateur))].filter(Boolean).sort();

    const handleExportClick = () => {
        let filteredReports = [...allReports];

        // 1. Filter by Type
        if (exportType === 'WEEKLY') {
            const lastWeek = new Date();
            lastWeek.setDate(lastWeek.getDate() - 7);
            filteredReports = filteredReports.filter(r => r.date && new Date(r.date) >= lastWeek);
        } else if (exportType === 'CUSTOM') {
            if (startDate) {
                filteredReports = filteredReports.filter(r => r.date >= startDate);
            }
            if (endDate) {
                filteredReports = filteredReports.filter(r => r.date <= endDate);
            }
        }

        // 2. Filter by Formateur
        if (exportType === 'FORMATEUR' && selectedFormateur !== 'ALL') {
            filteredReports = filteredReports.filter(r => r.formateur === selectedFormateur);
        }

        // 3. Filter by Group
        if (selectedGroup !== 'ALL') {
            filteredReports = filteredReports.filter(r => r.group_id === selectedGroup);
        }

        onExport(filteredReports, {
            type: exportType,
            formateur: selectedFormateur,
            startDate,
            endDate,
            group: selectedGroup
        });
    };

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300">
            <div className="bg-white rounded-[40px] w-full max-w-4xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-8 right-8 p-3 hover:bg-slate-50 rounded-2xl transition-all text-slate-300 hover:text-[var(--secondary)] z-10"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Left Side: Illustration & Title */}
                <div className="w-full md:w-2/5 bg-gradient-to-br from-[var(--secondary)] to-[#003d6b] text-white p-12 flex flex-col justify-between">
                    <div>
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 mb-8">
                            <Download className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-4xl font-black italic tracking-tighter leading-none mb-6 uppercase">
                            {t('reports.export_title')} <br /> <span className="text-[var(--primary)]">{t('reports.export_presence')}</span>
                        </h2>
                        <p className="text-[10px] font-bold text-white/50 tracking-[0.3em] uppercase leading-relaxed">
                            {t('reports.export_subtitle_modal')}
                        </p>
                    </div>

                    <div className="space-y-4 bg-black/20 p-6 rounded-3xl border border-white/10">
                        <div className="flex items-center gap-4 text-white/60">
                            <CheckCircle2 className="w-4 h-4 text-[var(--primary)]" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{t('reports.export_step1')}</span>
                        </div>
                        <div className="flex items-center gap-4 text-white/60">
                            <CheckCircle2 className="w-4 h-4 text-[var(--primary)]" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{t('reports.export_step2')}</span>
                        </div>
                        <div className="flex items-center gap-4 text-white/60">
                            <div className="w-4 h-4 rounded-full border-2 border-white/20"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest">{t('reports.export_step3')}</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Configuration */}
                <div ref={dropdownRef} className="flex-1 p-12 overflow-y-auto ista-scrollbar">
                    <div className="mb-10">
                        <h3 className="text-xl font-black italic tracking-tight text-[var(--secondary)] uppercase mb-2">{t('reports.export_config_title')}</h3>
                        <div className="h-1 w-12 bg-[var(--primary)] rounded-full"></div>
                    </div>

                    <div className="space-y-8">
                        {/* Type Selection */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase flex items-center gap-2">
                                <Filter className="w-3 h-3 text-[var(--primary)]" />
                                {t('reports.export_select_type')}
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { id: 'ALL', icon: FileText, label: t('reports.all_data') },
                                    { id: 'WEEKLY', icon: Clock, label: t('reports.weekly') },
                                    { id: 'FORMATEUR', icon: User, label: t('reports.by_formateur') },
                                    { id: 'CUSTOM', icon: Calendar, label: t('reports.custom_range') }
                                ].map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => setExportType(type.id)}
                                        className={`flex items-center gap-3 p-4 rounded-2xl border transition-all text-left ${exportType === type.id ? 'bg-[var(--primary)]/10 border-[var(--primary)] text-[var(--primary)]' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
                                    >
                                        <type.icon className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{type.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Conditional Filters */}
                        <div className="space-y-6 animate-in slide-in-from-top-4 duration-300">
                            {exportType === 'FORMATEUR' && (
                                <div className="space-y-3 relative">
                                    <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">{t('reports.select_formateur')}</label>
                                    <button
                                        onClick={() => setIsFormateurDropdownOpen(!isFormateurDropdownOpen)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 flex items-center justify-between group hover:border-[var(--primary)]/30 transition-all"
                                    >
                                        <span className="text-[11px] font-black uppercase tracking-widest text-[var(--secondary)]">
                                            {selectedFormateur === 'ALL' ? t('reports.all_formateurs') : selectedFormateur}
                                        </span>
                                        <ChevronRight className={`w-4 h-4 text-[var(--primary)] transition-transform ${isFormateurDropdownOpen ? 'rotate-90' : ''}`} />
                                    </button>

                                    {isFormateurDropdownOpen && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 max-h-48 overflow-y-auto ista-scrollbar animate-in fade-in zoom-in-95 duration-200">
                                            <div
                                                className={`px-6 py-4 cursor-pointer text-[10px] font-black tracking-widest uppercase transition-colors ${selectedFormateur === 'ALL' ? 'bg-[var(--primary)] text-white' : 'text-[var(--secondary)] hover:bg-slate-50'}`}
                                                onClick={() => { setSelectedFormateur('ALL'); setIsFormateurDropdownOpen(false); }}
                                            >
                                                {t('reports.all_formateurs')}
                                            </div>
                                            {availableFormateurs.map(f => (
                                                <div
                                                    key={f}
                                                    className={`px-6 py-4 cursor-pointer text-[10px] font-black tracking-widest uppercase transition-colors ${selectedFormateur === f ? 'bg-[var(--primary)] text-white' : 'text-[var(--secondary)] hover:bg-slate-50'}`}
                                                    onClick={() => { setSelectedFormateur(f); setIsFormateurDropdownOpen(false); }}
                                                >
                                                    {f}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {exportType === 'CUSTOM' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">{t('reports.start_date')}</label>
                                        <CustomDatePicker selectedDate={startDate} onChange={setStartDate} />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">{t('reports.end_date')}</label>
                                        <CustomDatePicker selectedDate={endDate} onChange={setEndDate} />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-3 relative">
                                <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">{t('reports.group_filter')}</label>
                                <button
                                    onClick={() => setIsGroupDropdownOpen(!isGroupDropdownOpen)}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 flex items-center justify-between group hover:border-[var(--primary)]/30 transition-all"
                                >
                                    <span className="text-[11px] font-black uppercase tracking-widest text-[var(--secondary)]">
                                        {selectedGroup === 'ALL' ? t('reports.all_groups') : selectedGroup}
                                    </span>
                                    <ChevronRight className={`w-4 h-4 text-[var(--primary)] transition-transform ${isGroupDropdownOpen ? 'rotate-90' : ''}`} />
                                </button>

                                {isGroupDropdownOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 max-h-48 overflow-y-auto ista-scrollbar animate-in fade-in zoom-in-95 duration-200">
                                        <div
                                            className={`px-6 py-4 cursor-pointer text-[10px] font-black tracking-widest uppercase transition-colors ${selectedGroup === 'ALL' ? 'bg-[var(--primary)] text-white' : 'text-[var(--secondary)] hover:bg-slate-50'}`}
                                            onClick={() => { setSelectedGroup('ALL'); setIsGroupDropdownOpen(false); }}
                                        >
                                            {t('reports.all_groups')}
                                        </div>
                                        {availableGroups.map(grp => (
                                            <div
                                                key={grp.id}
                                                className={`px-6 py-4 cursor-pointer text-[10px] font-black tracking-widest uppercase transition-colors ${selectedGroup === grp.id ? 'bg-[var(--primary)] text-white' : 'text-[var(--secondary)] hover:bg-slate-50'}`}
                                                onClick={() => { setSelectedGroup(grp.id); setIsGroupDropdownOpen(false); }}
                                            >
                                                {grp.id}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-50">
                            <button
                                onClick={handleExportClick}
                                className="w-full btn-ista py-5 rounded-[24px] flex items-center justify-center gap-4 group hover:shadow-xl hover:shadow-[var(--primary)]/20 transition-all active:scale-95"
                            >
                                <span className="text-xs font-black uppercase tracking-[0.2em]">{t('reports.generate_pdf', 'Générer le Rapport PDF')}</span>
                                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ExportReportsModal;
