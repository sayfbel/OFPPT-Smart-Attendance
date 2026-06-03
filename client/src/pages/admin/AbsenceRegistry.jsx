import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    ClipboardCheck,
    Search,
    Filter,
    Calendar,
    User,
    CheckCircle2,
    AlertCircle,
    Watch,
    Gavel,
    ChevronDown,
    MoreVertical,
    Clock,
    FileText,
    History
} from 'lucide-react';
import axios from 'axios';
import { useNotification } from '../../context/NotificationContext';
import { useTranslation } from 'react-i18next';
import CustomDatePicker from '../../components/CustomDatePicker';

const AbsenceRegistry = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const groupFilter = queryParams.get('group');

    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';
    const { addNotification } = useNotification();
    const navigate = useNavigate();
    const [registry, setRegistry] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [filterJustified, setFilterJustified] = useState('ALL');

    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [isJustifOpen, setIsJustifOpen] = useState(false);

    const [availableGroups, setAvailableGroups] = useState([]);
    const [availableFilieres, setAvailableFilieres] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(groupFilter || 'all');
    const [selectedDate, setSelectedDate] = useState('');

    const statusOptions = [
        { value: 'ALL', label: t('absence_registry.filter_status') },
        { value: 'ABSENT', label: t('absence_registry.filter_absences') },
        { value: 'LATE', label: t('absence_registry.filter_lates') },
        { value: 'PRESENT', label: t('absence_registry.filter_presences') }
    ];

    const justifOptions = [
        { value: 'ALL', label: t('absence_registry.filter_all_justif') },
        { value: 'JUSTIFIED', label: t('absence_registry.filter_justified') },
        { value: 'PENDING', label: t('absence_registry.filter_not_justified') },
        { value: 'ABSENCE', label: t('absence_registry.filter_pending') }
    ];

    const fetchRegistry = async () => {
        try {
            const token = localStorage.getItem('token');
            const [registryRes, groupsRes, filieresRes] = await Promise.all([
                axios.get('/api/admin/absence-registry', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('/api/admin/groups', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('/api/admin/filieres', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setRegistry(registryRes.data.registry || []);
            setAvailableGroups(groupsRes.data.groups || []);
            setAvailableFilieres(filieresRes.data.filieres || []);
        } catch (err) {
            console.error("FETCH REGISTRY ERROR:", err);
            addNotification(t('absence_registry.sync_error'), "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRegistry();
    }, []);

    useEffect(() => {
        if (groupFilter) setSelectedGroup(groupFilter);
    }, [groupFilter]);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = () => {
            setIsStatusOpen(false);
            setIsJustifOpen(false);
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleJustify = async (recordId, currentJustification) => {
        try {
            const token = localStorage.getItem('token');
            const newJustified = currentJustification === 'JUSTIFIÉ' ? 'ABSENCE' : 'JUSTIFIÉ';
            await axios.post('/api/admin/justify-absence', { recordId, justified: newJustified === 'JUSTIFIÉ' }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRegistry(prev => prev.map(r => r.record_id === recordId ? { ...r, justified: newJustified } : r));
            addNotification(newJustified === 'JUSTIFIÉ' ? t('absence_registry.justif_success') : t('absence_registry.justif_removed'), "success");
        } catch (err) {
            addNotification(t('absence_registry.justif_error'), "error");
        }
    };


    const filteredRegistry = registry.filter(item => {
        const matchesSearch = item.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.student_id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'ALL' || item.status === filterStatus;
        const matchesJustified = filterJustified === 'ALL' || 
                                (filterJustified === 'JUSTIFIED' && item.justified === 'JUSTIFIÉ') || 
                                (filterJustified === 'PENDING' && item.justified === 'NON JUSTIFIÉ') ||
                                (filterJustified === 'ABSENCE' && item.justified === 'ABSENCE');
        const matchesGroup = selectedGroup === 'all' || item.class_id === selectedGroup;
        
        let itemDateStr = '';
        if (item.session_date) {
            const d = new Date(item.session_date);
            if (!isNaN(d.getTime())) {
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                itemDateStr = `${year}-${month}-${day}`;
            }
        }
        const matchesDate = !selectedDate || itemDateStr === selectedDate;
        
        return matchesSearch && matchesStatus && matchesJustified && matchesGroup && matchesDate;
    });

    const statusBadge = (status) => {
        switch(status) {
            case 'ABSENT': return <span className="px-3 py-1 bg-red-50 text-red-500 text-[9px] font-black rounded-full border border-red-100 uppercase tracking-widest">{t('absence_registry.status_absence')}</span>;
            case 'LATE': return <span className="px-3 py-1 bg-amber-50 text-amber-500 text-[9px] font-black rounded-full border border-amber-100 uppercase tracking-widest">{t('absence_registry.status_late')}</span>;
            case 'PRESENT': return <span className="px-3 py-1 bg-green-50 text-green-500 text-[9px] font-black rounded-full border border-green-100 uppercase tracking-widest">{t('absence_registry.status_present')}</span>;
            default: return null;
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-[50vh] animate-pulse uppercase tracking-[0.5em] font-black italic text-slate-400">{t('absence_registry.sync')}</div>;
    }

    return (
        <div className="space-y-12 fade-up max-w-[1600px] mx-auto">
            {/* Header section */}
            <div className={`flex flex-col md:flex-row md:items-center justify-between gap-8 transition-all duration-500 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <div className="space-y-2">
                    <h1 className={`text-5xl md:text-[64px] font-black tracking-tighter text-[var(--secondary)] uppercase italic leading-none ${isRtl ? 'text-right' : ''}`}>
                        {t('absence_registry.title')}
                    </h1>
                    <p className={`text-[10px] text-slate-400 font-bold tracking-[0.3em] uppercase ${isRtl ? 'text-right' : ''}`}>
                        {t('absence_registry.subtitle')}
                    </p>
                </div>

                <div className={`flex items-center gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <CustomDatePicker
                        selectedDate={selectedDate}
                        onChange={setSelectedDate}
                        placeholder={t('absence_registry.filter_date') || 'FILTRER PAR DATE'}
                    />

                    <div className="flex items-center bg-white border border-slate-200 rounded-2xl px-5 py-3 hover:border-slate-300 transition-all shadow-sm">
                        <Search className="w-4 h-4 text-slate-400 mr-3" />
                        <input
                            type="text"
                            placeholder={t('absence_registry.search')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none text-[10px] font-bold tracking-widest focus:ring-0 text-[var(--secondary)] placeholder-slate-300 p-0 uppercase"
                        />
                    </div>

                    {/* Status Dropdown */}
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button 
                            onClick={() => { setIsStatusOpen(!isStatusOpen); setIsJustifOpen(false); }}
                            className={`flex items-center gap-4 bg-white border border-slate-200 rounded-xl px-5 py-2.5 text-[9px] font-black tracking-widest text-[var(--secondary)] uppercase transition-all shadow-sm hover:border-[var(--primary)] ${isStatusOpen ? 'border-[var(--primary)] ring-2 ring-[var(--primary)]/10' : ''}`}
                        >
                            <span>{statusOptions.find(o => o.value === filterStatus)?.label}</span>
                            <ChevronDown className={`w-3 h-3 text-[var(--primary)] transition-transform duration-300 ${isStatusOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isStatusOpen && (
                            <div className="absolute top-full right-0 mt-2 bg-white border border-slate-100 rounded-xl z-50 shadow-2xl min-w-[180px] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                {statusOptions.map(opt => (
                                    <div 
                                        key={opt.value}
                                        onClick={() => { setFilterStatus(opt.value); setIsStatusOpen(false); }}
                                        className={`px-5 py-3 cursor-pointer text-[9px] font-black tracking-widest uppercase transition-colors ${filterStatus === opt.value ? 'bg-[var(--primary)] text-white' : 'text-slate-400 hover:bg-slate-50 hover:text-[var(--primary)]'}`}
                                    >
                                        {opt.label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Justification Dropdown */}
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button 
                            onClick={() => { setIsJustifOpen(!isJustifOpen); setIsStatusOpen(false); }}
                            className={`flex items-center gap-4 bg-white border border-slate-200 rounded-xl px-5 py-2.5 text-[9px] font-black tracking-widest text-[var(--secondary)] uppercase transition-all shadow-sm hover:border-[var(--primary)] ${isJustifOpen ? 'border-[var(--primary)] ring-2 ring-[var(--primary)]/10' : ''}`}
                        >
                            <span>{justifOptions.find(o => o.value === filterJustified)?.label}</span>
                            <ChevronDown className={`w-3 h-3 text-[var(--primary)] transition-transform duration-300 ${isJustifOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isJustifOpen && (
                            <div className="absolute top-full right-0 mt-2 bg-white border border-slate-100 rounded-xl z-50 shadow-2xl min-w-[180px] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                {justifOptions.map(opt => (
                                    <div 
                                        key={opt.value}
                                        onClick={() => { setFilterJustified(opt.value); setIsJustifOpen(false); }}
                                        className={`px-5 py-3 cursor-pointer text-[9px] font-black tracking-widest uppercase transition-colors ${filterJustified === opt.value ? 'bg-[var(--primary)] text-white' : 'text-slate-400 hover:bg-slate-50 hover:text-[var(--primary)]'}`}
                                    >
                                        {opt.label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Class Cards */}
            <div className={`flex gap-6 overflow-x-auto pb-6 ista-scrollbar ${isRtl ? 'flex-row-reverse' : ''}`}>
                <div
                    onClick={() => setSelectedGroup('all')}
                    className={`min-w-[320px] p-8 rounded-[24px] cursor-pointer transition-all duration-300 border ${
                        selectedGroup === 'all' 
                            ? 'bg-white border-[var(--primary)] shadow-lg shadow-[var(--primary)]/5' 
                            : 'bg-white border-slate-100 hover:border-slate-300 opacity-60 hover:opacity-100'
                    }`}
                >
                    <div className={`flex justify-between items-center mb-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
                        <span className={`text-[12px] font-black uppercase tracking-widest truncate-text flex-1 ${
                            selectedGroup === 'all' ? 'text-[var(--primary)]' : 'text-[var(--secondary)]'
                        } ${isRtl ? 'text-right' : ''}`}>
                            {t('reports.all_groups')}
                        </span>
                        <div className={`w-2.5 h-2.5 rounded-full outline outline-4 outline-offset-2 ${
                            selectedGroup === 'all' ? 'bg-[var(--primary)] outline-[var(--primary)]/20' : 'bg-slate-200 outline-slate-100'
                        }`}></div>
                    </div>
                    <h3 className={`text-2xl font-black italic text-[var(--secondary)] uppercase tracking-tight mb-8 truncate-text ${isRtl ? 'text-right' : ''}`}>
                        {t('reports.all_groups')}
                    </h3>
                    <p className={`text-[9px] font-bold text-slate-400 uppercase tracking-widest ${isRtl ? 'text-right' : ''}`}>
                        {t('absence_registry.title')}: <span className="text-[var(--secondary)] ml-1 truncate-text inline-block align-bottom max-w-[150px]">
                            {registry.length} {t('absence_registry.filter_absences')}
                        </span>
                    </p>
                </div>

                {availableGroups.length > 0 ? (
                    availableGroups.map((grp) => {
                            const grpAbsenceCount = registry.filter(item => item.class_id === grp.id).length;
                            return (
                                <div
                                    key={grp.id}
                                    onClick={() => setSelectedGroup(grp.id)}
                                    className={`min-w-[320px] p-8 rounded-[24px] cursor-pointer transition-all duration-300 border ${
                                        selectedGroup === grp.id 
                                            ? 'bg-white border-[var(--primary)] shadow-lg shadow-[var(--primary)]/5' 
                                            : 'bg-white border-slate-100 hover:border-slate-300 opacity-60 hover:opacity-100'
                                    }`}
                                >
                                    <div className={`flex justify-between items-center mb-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                        <span className={`text-[12px] font-black uppercase tracking-widest truncate-text flex-1 ${
                                            selectedGroup === grp.id ? 'text-[var(--primary)]' : 'text-[var(--secondary)]'
                                        } ${isRtl ? 'text-right' : ''}`}>
                                            {(grp.id || '').split('-')[0].trim()}
                                        </span>
                                        <div className={`w-2.5 h-2.5 rounded-full outline outline-4 outline-offset-2 ${
                                            selectedGroup === grp.id ? 'bg-[var(--primary)] outline-[var(--primary)]/20' : 'bg-slate-200 outline-slate-100'
                                        }`}></div>
                                    </div>
                                    <h3 className={`text-2xl font-black italic text-[var(--secondary)] uppercase tracking-tight mb-8 truncate-text ${isRtl ? 'text-right' : ''}`}>
                                        {grp.id}
                                    </h3>
                                    <p className={`text-[9px] font-bold text-slate-400 uppercase tracking-widest ${isRtl ? 'text-right' : ''}`}>
                                        {t('accounts.col_filiere')}: <span className="text-[var(--secondary)] ml-1 truncate-text inline-block align-bottom max-w-[150px]">
                                            {grp.filiere || 'GESTION DES ENTREPRISES'}
                                        </span>
                                        <span className="mx-2">•</span>
                                        <span className="text-red-500 font-black">{grpAbsenceCount}</span>
                                    </p>
                                </div>
                            );
                        })
                ) : (
                    <div className="min-w-[320px] p-8 rounded-[24px] bg-white border border-slate-100 opacity-60 flex items-center justify-center">
                        <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">{t('accounts.no_groups_available')}</p>
                    </div>
                )}
            </div>

            {/* Registry Table */}
            <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm">
                <div className="overflow-x-auto ista-scrollbar">
                    <table className={`w-full text-left border-collapse ${isRtl ? 'text-right' : ''}`}>
                        <thead>
                            <tr className="border-b border-slate-50 bg-slate-50/30">
                                <th className="p-8 text-[9px] font-black text-slate-300 uppercase tracking-widest">{t('absence_registry.col_student')}</th>
                                <th className="p-8 text-[9px] font-black text-slate-300 uppercase tracking-widest text-center">{t('absence_registry.col_session')}</th>
                                <th className="p-8 text-[9px] font-black text-slate-300 uppercase tracking-widest text-center">{t('absence_registry.col_status')}</th>
                                <th className="p-8 text-[9px] font-black text-slate-300 uppercase tracking-widest text-center">{t('absence_registry.col_reported_by')}</th>
                                <th className={`p-8 text-[9px] font-black text-slate-300 uppercase tracking-widest ${isRtl ? 'text-left' : 'text-right'}`}>{t('absence_registry.col_actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredRegistry.map((item) => (
                                <tr key={item.record_id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="p-8">
                                        <div className={`flex items-center gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                            <div className="w-12 h-12 bg-[var(--primary)]/10 text-[var(--primary)] rounded-xl flex items-center justify-center text-[11px] font-black italic">
                                                {item.student_name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div className="flex flex-col">
                                                <Link to={`/admin/student/${item.student_id}`} className="text-sm font-black italic text-[var(--secondary)] uppercase tracking-tight hover:text-[var(--primary)] transition-colors">{item.student_name}</Link>
                                                <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">ID: {item.student_id} / GROUP: {item.class_id}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8 text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="text-xs font-black text-[var(--secondary)] uppercase italic">{item.subject}</span>
                                            <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 tracking-widest">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(item.session_date).toLocaleDateString('fr-FR')} 
                                                <span className="mx-1">•</span>
                                                <Clock className="w-3 h-3" />
                                                {item.session_time}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            {item.justified === 'JUSTIFIÉ' ? (
                                                <span className="px-3 py-1 bg-green-50 text-[var(--primary)] text-[9px] font-black rounded-full border border-green-100 uppercase tracking-widest shadow-sm">
                                                    {t('absence_registry.status_justified')}
                                                </span>
                                            ) : item.justified === 'NON JUSTIFIÉ' ? (
                                                <span className="px-3 py-1 bg-red-100 text-red-600 text-[9px] font-black rounded-full border border-red-200 uppercase tracking-widest shadow-sm">
                                                    {t('absence_registry.status_not_justified')}
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 bg-red-50 text-red-500 text-[9px] font-black rounded-full border border-red-100 uppercase tracking-widest shadow-sm">
                                                    {t('absence_registry.status_absence')}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-8 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className="text-[10px] font-black text-[var(--secondary)] uppercase italic leading-none">{item.formateur_name}</span>
                                            <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest mt-1">FORMATEUR</span>
                                        </div>
                                    </td>
                                    <td className={`p-8 ${isRtl ? 'text-left' : 'text-right'}`}>
                                        {item.status !== 'PRESENT' && (
                                            <div className={`flex items-center justify-end gap-2 transition-opacity ${isRtl ? 'flex-row-reverse' : ''}`}>
                                                <button 
                                                    onClick={() => handleJustify(item.record_id, item.justified)}
                                                    className={`px-4 py-2 border rounded-xl text-[9px] font-black tracking-widest uppercase transition-all shadow-sm ${item.justified === 'JUSTIFIÉ' 
                                                        ? 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100' 
                                                        : 'bg-green-50 text-[var(--primary)] border-green-100 hover:bg-[var(--primary)] hover:text-white'}`}
                                                >
                                                    {item.justified === 'JUSTIFIÉ' ? t('absence_registry.btn_cancel_justif') : t('absence_registry.btn_justify')}
                                                </button>
                                                <button 
                                                    onClick={() => navigate('/admin/penalty-decision', { state: { student: item } })}
                                                    className="px-4 py-2 bg-red-50 text-red-500 border border-red-100 rounded-xl text-[9px] font-black tracking-widest uppercase hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                >
                                                    {t('absence_registry.btn_sanction')}
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            
            <style>{`.ista-scrollbar::-webkit-scrollbar { width: 4px; } .ista-scrollbar::-webkit-scrollbar-track { background: transparent; } .ista-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }`}</style>
        </div>
    );
};

export default AbsenceRegistry;
