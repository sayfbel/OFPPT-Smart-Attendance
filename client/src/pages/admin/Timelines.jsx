import React, { useState, useEffect } from 'react';
import { Calendar as CalIcon, Clock, Filter, ChevronRight, X, ChevronDown, BookOpen, MapPin, User, Plus, Trash2, Activity } from 'lucide-react';
import axios from 'axios';
import ConfirmationModal from '../../components/ConfirmationModal';
import { useNotification } from '../../context/NotificationContext';
import { useTranslation } from 'react-i18next';

const Timelines = () => {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';
    const { addNotification } = useNotification();
    const [timetable, setTimetable] = useState([]);
    const [classes, setClasses] = useState([]);
    const [formateurs, setFormateurs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDay, setSelectedDay] = useState('all');
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [sessionToDelete, setSessionToDelete] = useState(null);

    const [newSession, setNewSession] = useState({
        class_id: '',
        formateur_id: '',
        day_of_week: 'LUNDI',
        start_time: '08:30',
        end_time: '12:30',
        room: ''
    });

    const days = [
        { id: 'all', label: t('reports.all_groups') }, // Using reports.all_groups for "All" or similar
        { id: 'LUNDI', label: t('timetable.days.monday') },
        { id: 'MARDI', label: t('timetable.days.tuesday') },
        { id: 'MERCREDI', label: t('timetable.days.wednesday') },
        { id: 'JEUDI', label: t('timetable.days.thursday') },
        { id: 'VENDREDI', label: t('timetable.days.friday') },
        { id: 'SAMEDI', label: t('timetable.days.saturday') }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [timeRes, classRes, formRes] = await Promise.all([
                    axios.get('/api/admin/timetable', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('/api/admin/classes', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('/api/admin/formateurs', { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setTimetable(timeRes.data.timetable || []);
                setClasses(classRes.data.classes || []);
                setFormateurs(formRes.data.formateurs || []);
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleAddSession = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('/api/admin/timetable', newSession, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTimetable([...timetable, res.data.session]);
            addNotification(t('timetable.create_success'), 'success');
            setNewSession({ ...newSession, class_id: '', formateur_id: '', room: '' });
        } catch (err) {
            addNotification(err.response?.data?.message || 'Error adding session', 'error');
        }
    };

    const handleDeleteSession = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/admin/timetable/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTimetable(timetable.filter(s => s.id !== id));
            setIsConfirmOpen(false);
            addNotification(t('timetable.delete_success'), 'success');
        } catch (err) {
            addNotification('Error deleting session', 'error');
        }
    };

    const filteredTimetable = timetable.filter(session =>
        selectedDay === 'all' || session.day_of_week === selectedDay
    );

    return (
        <div className={`space-y-12 animate-in fade-in duration-700 ${isRtl ? 'text-right' : ''}`}>
            {/* Header section */}
            <div className={`flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-[var(--border)] pb-12 transition-all duration-500 ${isRtl ? 'md:flex-row-reverse' : ''}`}>
                <div className="space-y-4">
                    <h1 className="text-4xl lg:text-7xl font-black tracking-tight text-[var(--secondary)] uppercase italic leading-[0.9]">
                        {t('timetable.title')}
                    </h1>
                    <p className="text-[var(--text-muted)] text-[11px] font-bold tracking-[0.4em] uppercase opacity-60">
                        {t('timetable.subtitle')}
                    </p>
                </div>

                <div className={`flex bg-white border border-[var(--border)] rounded-2xl p-1.5 shadow-sm overflow-x-auto ista-scrollbar max-w-full ${isRtl ? 'flex-row-reverse' : ''}`}>
                    {days.map((day) => (
                        <button
                            key={day.id}
                            onClick={() => setSelectedDay(day.id)}
                            className={`px-6 py-3 rounded-xl text-[9px] font-black tracking-widest uppercase transition-all whitespace-nowrap ${selectedDay === day.id
                                ? 'bg-[var(--secondary)] text-white shadow-lg'
                                : 'text-[var(--text-muted)] hover:bg-slate-50'
                                }`}
                        >
                            {day.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 ${isRtl ? 'direction-rtl' : ''}`}>
                {/* Session Creation Form */}
                <div className={`lg:col-span-4 space-y-8 ${isRtl ? 'order-1 lg:order-2' : ''}`}>
                    <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                        <div className="w-1.5 h-6 bg-[var(--primary)] rounded-full"></div>
                        <h3 className="text-xs font-black tracking-widest uppercase text-[var(--secondary)]">{t('timetable.add_session')}</h3>
                    </div>

                    <form onSubmit={handleAddSession} className="ista-panel p-8 bg-white shadow-xl space-y-6">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black tracking-widest text-slate-400 uppercase">{t('timetable.class_select')}</label>
                            <select
                                value={newSession.class_id}
                                onChange={(e) => setNewSession({ ...newSession, class_id: e.target.value })}
                                className={`w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-[11px] font-bold uppercase outline-none focus:border-[var(--primary)] transition-all ${isRtl ? 'text-right' : ''}`}
                                required
                            >
                                <option value="">{t('timetable.select_group_placeholder')}</option>
                                {classes.map(c => <option key={c.id} value={c.id}>{c.id} - {c.title}</option>)}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] font-black tracking-widest text-slate-400 uppercase">{t('timetable.formateur_select')}</label>
                            <select
                                value={newSession.formateur_id}
                                onChange={(e) => setNewSession({ ...newSession, formateur_id: e.target.value })}
                                className={`w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-[11px] font-bold uppercase outline-none focus:border-[var(--primary)] transition-all ${isRtl ? 'text-right' : ''}`}
                                required
                            >
                                <option value="">{t('timetable.select_formateur_placeholder')}</option>
                                {formateurs.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black tracking-widest text-slate-400 uppercase">{t('timetable.day_select')}</label>
                                <select
                                    value={newSession.day_of_week}
                                    onChange={(e) => setNewSession({ ...newSession, day_of_week: e.target.value })}
                                    className={`w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-[11px] font-bold uppercase outline-none focus:border-[var(--primary)] transition-all ${isRtl ? 'text-right' : ''}`}
                                    required
                                >
                                    {days.filter(d => d.id !== 'all').map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black tracking-widest text-slate-400 uppercase">{t('timetable.start_time')}</label>
                                    <input
                                        type="time"
                                        value={newSession.start_time}
                                        onChange={(e) => setNewSession({ ...newSession, start_time: e.target.value })}
                                        className={`w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-[11px] font-bold outline-none focus:border-[var(--primary)] transition-all ${isRtl ? 'text-right' : ''}`}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black tracking-widest text-slate-400 uppercase">{t('timetable.end_time')}</label>
                                    <input
                                        type="time"
                                        value={newSession.end_time}
                                        onChange={(e) => setNewSession({ ...newSession, end_time: e.target.value })}
                                        className={`w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-[11px] font-bold outline-none focus:border-[var(--primary)] transition-all ${isRtl ? 'text-right' : ''}`}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] font-black tracking-widest text-slate-400 uppercase">{t('timetable.room_label')}</label>
                            <input
                                type="text"
                                placeholder={t('timetable.room_placeholder')}
                                value={newSession.room}
                                onChange={(e) => setNewSession({ ...newSession, room: e.target.value })}
                                className={`w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-[11px] font-bold uppercase outline-none focus:border-[var(--primary)] transition-all ${isRtl ? 'text-right' : ''}`}
                                required
                            />
                        </div>

                        <button type="submit" className="w-full btn-ista py-4 flex items-center justify-center gap-3 shadow-xl">
                            <Plus className="w-4 h-4" />
                            <span className="text-[10px] uppercase font-black tracking-widest">{t('timetable.add_button')}</span>
                        </button>
                    </form>
                </div>

                {/* Timetable List */}
                <div className={`lg:col-span-8 space-y-8 ${isRtl ? 'order-2 lg:order-1' : ''}`}>
                    <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                        <div className="w-1.5 h-6 bg-[var(--primary)] rounded-full"></div>
                        <h3 className="text-xs font-black tracking-widest uppercase text-[var(--secondary)]">{t('timetable.list_title')}</h3>
                    </div>

                    <div className="ista-panel bg-white shadow-sm overflow-hidden">
                        <div className="overflow-x-auto ista-scrollbar">
                            <table className={`w-full text-left border-collapse min-w-[700px] ${isRtl ? 'text-right' : ''}`}>
                                <thead>
                                    <tr className="bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-widest border-b border-slate-100">
                                        <th className="p-6">{t('timetable.col_session')}</th>
                                        <th className="p-6">{t('timetable.col_time')}</th>
                                        <th className="p-6">{t('timetable.col_formateur')}</th>
                                        <th className={`p-6 ${isRtl ? 'text-left' : 'text-right'}`}>{t('timetable.col_actions')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredTimetable.length > 0 ? (
                                        filteredTimetable.map((session) => (
                                            <tr key={session.id} className="hover:bg-slate-50 transition-colors group">
                                                <td className="p-6">
                                                    <div className={`flex items-center gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-black text-[var(--primary)] uppercase transition-colors group-hover:bg-[var(--primary)] group-hover:text-white">
                                                            {session.room}
                                                        </div>
                                                        <div className={`flex flex-col ${isRtl ? 'text-right' : ''}`}>
                                                            <span className="text-[11px] font-black tracking-tight text-[var(--secondary)] uppercase">{session.class_id}</span>
                                                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1 tracking-[0.2em]">{session.day_of_week}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <div className={`flex items-center gap-2 text-[10px] font-black text-[var(--secondary)] uppercase ${isRtl ? 'flex-row-reverse' : ''}`}>
                                                        <Clock className="w-3 h-3 text-[var(--primary)]" />
                                                        <span>{session.start_time} - {session.end_time}</span>
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <div className={`flex flex-col ${isRtl ? 'text-right' : ''}`}>
                                                        <span className="text-[10px] font-bold text-[var(--secondary)] uppercase">{session.formateur_name}</span>
                                                        <span className="text-[8px] text-slate-300 uppercase tracking-widest mt-0.5">{t('timetable.qualified_formateur')}</span>
                                                    </div>
                                                </td>
                                                <td className={`p-6 ${isRtl ? 'text-left' : 'text-right'}`}>
                                                    <button
                                                        onClick={() => {
                                                            setSessionToDelete(session.id);
                                                            setIsConfirmOpen(true);
                                                        }}
                                                        className="p-3 hover:bg-white rounded-xl text-slate-300 hover:text-red-500 transition-all shadow-sm border border-transparent hover:border-slate-100 opacity-0 group-hover:opacity-100"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="p-24 text-center">
                                                <div className="flex flex-col items-center gap-4 opacity-30">
                                                    <Activity className="w-12 h-12 text-slate-300 animate-pulse" />
                                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] italic text-slate-400">{t('timetable.no_sessions')}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={() => handleDeleteSession(sessionToDelete)}
                title={t('timetable.delete_confirm_title')}
                message={t('timetable.delete_confirm_message')}
            />
            <style>{`
                .ista-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
                .ista-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .ista-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
            `}</style>
        </div >
    );
};

export default Timelines;
