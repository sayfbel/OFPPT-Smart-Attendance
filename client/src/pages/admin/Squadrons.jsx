import React, { useState, useEffect } from 'react';
import {
    Layers,
    Search,
    Plus,
    X,
    Trash2,
    Users,
    GraduationCap,
    Calendar,
    ChevronRight,
    LayoutDashboard,
    Clock,
    Activity,
    Pencil
} from 'lucide-react';
import axios from 'axios';
import { useNotification } from '../../context/NotificationContext';
import GroupModal from '../../components/GroupModal';
import ConfirmationModal from '../../components/ConfirmationModal';
import { useTranslation } from 'react-i18next';

const Squadrons = () => {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';
    const { addNotification } = useNotification();
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [classToDelete, setClassToDelete] = useState(null);
    const [newClass, setNewClass] = useState({
        id: '',
        title: '',
        stream: '',
        lead: ''
    });

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/admin/classes', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setClasses(res.data.classes || []);
            } catch (err) {
                console.error('Error fetching classes:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchClasses();
    }, []);

    const handleAddClass = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('/api/admin/classes', newClass, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setClasses([...classes, res.data.class]);
            setIsModalOpen(false);
            addNotification(t('groups.create_success'), 'success');
            setNewClass({ id: '', title: '', stream: '', lead: '' });
        } catch (err) {
            addNotification(err.response?.data?.message || 'Error adding class', 'error');
        }
    };

    const handleUpdateClass = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`/api/admin/classes/${newClass.id}`, newClass, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setClasses(classes.map(c => c.id === res.data.class.id ? res.data.class : c));
            setIsModalOpen(false);
            setIsEditing(false);
            addNotification(t('groups.update_success'), 'success');
        } catch (err) {
            addNotification(err.response?.data?.message || 'Error updating class', 'error');
        }
    };

    const handleDeleteClass = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/admin/classes/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setClasses(classes.filter(c => c.id !== id));
            setIsConfirmOpen(false);
            addNotification(t('groups.delete_success'), 'success');
        } catch (err) {
            addNotification('Error deleting class', 'error');
        }
    };

    const filteredClasses = classes.filter(cls =>
        cls.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.stream?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={`space-y-12 animate-in fade-in duration-700 ${isRtl ? 'text-right' : ''}`}>
            {/* Header section */}
            <div className={`flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-[var(--border)] pb-12 ${isRtl ? 'md:flex-row-reverse' : ''}`}>
                <div className="space-y-4">
                    <h1 className="text-4xl lg:text-7xl font-black tracking-tight text-[var(--secondary)] uppercase italic leading-[0.9]">
                        {t('groups.title')}
                    </h1>
                    <p className="text-[var(--text-muted)] text-[11px] font-bold tracking-[0.4em] uppercase opacity-60">
                        {t('groups.subtitle')}
                    </p>
                </div>

                <div className={`flex flex-col sm:flex-row items-center gap-4 ${isRtl ? 'sm:flex-row-reverse w-full md:w-auto' : ''}`}>
                    <div className={`flex items-center bg-white border border-[var(--border)] rounded-2xl w-full md:w-80 px-5 group focus-within:border-[var(--primary)] transition-all shadow-sm ${isRtl ? 'flex-row-reverse' : ''}`}>
                        <Search className="w-4 h-4 text-slate-300 group-focus-within:text-[var(--primary)] transition-colors" />
                        <input
                            type="text"
                            placeholder={t('groups.search_placeholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`bg-transparent border-none text-[11px] font-bold py-4 px-4 w-full tracking-widest focus:ring-0 text-[var(--secondary)] placeholder-slate-300 uppercase ${isRtl ? 'text-right' : ''}`}
                        />
                    </div>

                    <button
                        onClick={() => { setIsEditing(false); setIsModalOpen(true); }}
                        className="w-full sm:w-auto btn-ista px-8 py-4 flex items-center justify-center gap-3 shadow-xl"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="text-[10px] uppercase font-black tracking-widest">{t('groups.create_button')}</span>
                    </button>
                </div>
            </div>

            {/* Content Section */}
            <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 ${isRtl ? 'direction-rtl' : ''}`}>

                {/* Main list */}
                <div className={`lg:col-span-8 space-y-8 ${isRtl ? 'order-1 lg:order-2' : ''}`}>
                    <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                        <div className="w-1.5 h-6 bg-[var(--primary)] rounded-full"></div>
                        <h3 className="text-xs font-black tracking-widest uppercase text-[var(--secondary)]">{t('groups.list_title')}</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredClasses.length > 0 ? (
                            filteredClasses.map((cls) => (
                                <div key={cls.id} className="ista-panel p-8 bg-white shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 group relative overflow-hidden">
                                    <div className={`absolute top-0 w-24 h-24 bg-[var(--primary)] opacity-[0.02] rounded-bl-full group-hover:opacity-[0.05] transition-opacity ${isRtl ? 'left-0 rounded-br-full' : 'right-0 rounded-bl-full'}`}></div>

                                    <div className={`flex justify-between items-start mb-8 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                        <div className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-black text-[var(--primary)] uppercase tracking-widest group-hover:bg-[var(--primary)] group-hover:text-white transition-all">
                                            {cls.id}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setNewClass(cls);
                                                    setIsEditing(true);
                                                    setIsModalOpen(true);
                                                }}
                                                className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-300 hover:text-[var(--primary)] transition-all"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setClassToDelete(cls.id);
                                                    setIsConfirmOpen(true);
                                                }}
                                                className="p-2.5 rounded-xl hover:bg-red-50 text-slate-300 hover:text-red-500 transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className={`space-y-4 ${isRtl ? 'text-right' : ''}`}>
                                        <h4 className="text-2xl font-black italic tracking-tighter text-[var(--secondary)] leading-none uppercase group-hover:text-[var(--primary)] transition-colors">
                                            {cls.title}
                                        </h4>
                                        <div className={`flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest ${isRtl ? 'flex-row-reverse' : ''}`}>
                                            <GraduationCap className="w-3 h-3 text-[var(--primary)]" />
                                            <span>{cls.stream}</span>
                                        </div>
                                    </div>

                                    <div className={`mt-8 pt-8 border-t border-slate-50 flex items-center justify-between ${isRtl ? 'flex-row-reverse' : ''}`}>
                                        <div className={`flex items-center gap-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                            <div className="flex flex-col">
                                                <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">{t('groups.effectif')}</span>
                                                <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                                    <Users className="w-3 h-3 text-[var(--secondary)]" />
                                                    <span className="text-sm font-black text-[var(--secondary)]">--</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">{t('groups.formateur')}</span>
                                                <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                                    <Clock className="w-3 h-3 text-[var(--secondary)]" />
                                                    <span className="text-[10px] font-black text-[var(--secondary)] uppercase truncate max-w-[100px]">{cls.lead || 'NA'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <ChevronRight className={`w-4 h-4 text-slate-200 group-hover:translate-x-1 transition-transform ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="md:col-span-2 ista-panel p-24 bg-white/50 border-2 border-dashed flex flex-col items-center justify-center opacity-40">
                                <Activity className="w-12 h-12 text-slate-300 animate-pulse mb-4" />
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] italic text-slate-400">{t('groups.no_groups')}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right side stats */}
                <div className={`lg:col-span-4 space-y-10 ${isRtl ? 'order-2 lg:order-1' : ''}`}>
                    <div className="ista-panel p-10 bg-[var(--secondary)] text-white relative overflow-hidden group">
                        <div className={`absolute top-0 p-8 text-white/5 group-hover:rotate-12 transition-transform duration-700 ${isRtl ? 'left-0' : 'right-0'}`}>
                            <Layers className="w-40 h-40" />
                        </div>
                        <div className="relative z-10 space-y-12">
                            <div className={`space-y-4 ${isRtl ? 'text-right' : ''}`}>
                                <h3 className="text-3xl font-black italic tracking-tighter leading-none">{t('groups.sidebar_overview')}</h3>
                                <p className="text-[9px] font-bold text-white/40 tracking-[0.2em] uppercase">SYSTÈME DE CLASSIFICATION</p>
                            </div>

                            <div className="space-y-6">
                                <div className={`p-6 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm flex items-center justify-between group/card hover:bg-[var(--primary)] transition-all ${isRtl ? 'flex-row-reverse' : ''}`}>
                                    <div className={`flex items-center gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-[var(--primary)] group-hover/card:bg-white transition-all shadow-sm">
                                            <Users className="w-6 h-6" />
                                        </div>
                                        <div className={isRtl ? 'text-right' : ''}>
                                            <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">{t('dashboard.total_classes')}</p>
                                            <p className="text-xl font-black">{classes.length}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className={`p-6 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm flex items-center justify-between group/card hover:bg-royalblue transition-all ${isRtl ? 'flex-row-reverse' : ''}`}>
                                    <div className={`flex items-center gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-royalblue group-hover/card:bg-white transition-all shadow-sm">
                                            <GraduationCap className="w-6 h-6" />
                                        </div>
                                        <div className={isRtl ? 'text-right' : ''}>
                                            <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">{t('groups.active_streams')}</p>
                                            <p className="text-xl font-black">{[...new Set(classes.map(c => c.stream))].length}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="ista-panel p-10 bg-white shadow-xl relative overflow-hidden group">
                        <div className={`absolute bottom-0 right-0 p-6 opacity-[0.03] group-hover:scale-110 transition-transform duration-700 ${isRtl ? 'left-0 right-auto' : 'right-0'}`}>
                            <Calendar className="w-32 h-32" />
                        </div>
                        <div className={`space-y-6 relative z-10 ${isRtl ? 'text-right' : ''}`}>
                            <h4 className="text-xs font-black tracking-widest text-[var(--secondary)] uppercase">{t('groups.recent_activities')}</h4>
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className={`flex gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-slate-100 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] mt-2"></div>
                                        <div>
                                            <p className="text-[10px] font-black text-[var(--secondary)] uppercase tracking-tight">AJOUT DE GROUPE {i}</p>
                                            <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase">IL Y A 2 HEURES</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <GroupModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                newClass={newClass}
                setNewClass={setNewClass}
                handleAddClass={handleAddClass}
                handleUpdateClass={handleUpdateClass}
                isEditing={isEditing}
            />

            <ConfirmationModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={() => handleDeleteClass(classToDelete)}
                title={t('groups.delete_confirm_title')}
                message={t('groups.delete_confirm_msg', { id: classToDelete })}
            />
        </div>
    );
};

export default Squadrons;
