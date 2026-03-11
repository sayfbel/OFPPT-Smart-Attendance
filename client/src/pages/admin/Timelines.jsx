import React, { useState, useEffect } from 'react';
import { Calendar as CalIcon, Clock, Filter, ChevronRight, X, ChevronDown, BookOpen, MapPin, User, Plus, Edit3 } from 'lucide-react';
import axios from 'axios';
import SeanceDossierModal from '../../components/SeanceDossierModal';
import { useNotification } from '../../context/NotificationContext';

const Timelines = () => {
    const { addNotification } = useNotification();
    const [selectedClass, setSelectedClass] = useState('');
    const [schedule, setSchedule] = useState([]);
    const [availableClasses, setAvailableClasses] = useState([]);

    const [isSeanceModalOpen, setIsSeanceModalOpen] = useState(false);
    const [targetSeance, setTargetSeance] = useState(null);
    const [streamFilter, setStreamFilter] = useState('ALL');
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
    const [formateurs, setFormateurs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const config = { headers: { Authorization: `Bearer ${token}` } };

                const [schedRes, formRes] = await Promise.all([
                    axios.get('/api/admin/schedule', config),
                    axios.get('/api/admin/formateurs', config)
                ]);

                setSchedule(schedRes.data.schedule || []);
                const classes = schedRes.data.classes || [];
                setAvailableClasses(classes);
                if (classes.length > 0 && !selectedClass) {
                    setSelectedClass(classes[0].id);
                }
                setFormateurs(formRes.data.formateurs || []);
            } catch (error) {
                console.error('Error fetching timeline data', error);
                addNotification('Erreur lors du chargement des données.', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [addNotification, selectedClass]);

    const handleUpdateSeance = async (updatedData) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`/api/admin/schedule/${updatedData.id}`, updatedData, config);

            setSchedule(prev => prev.map(s => s.id === updatedData.id ? {
                ...s,
                ...updatedData,
                formateur: updatedData.formateur_name,
                class: updatedData.class_id
            } : s));
            setIsSeanceModalOpen(false);
            addNotification('Séance mise à jour avec succès.', 'success');
        } catch (error) {
            console.error('Error updating seance', error);
            addNotification(error.response?.data?.message || 'Erreur lors de la mise à jour', 'error');
        }
    };

    const handleCreateSeance = async (newData) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.post('/api/admin/schedule', newData, config);

            const newSeance = {
                ...newData,
                id: res.data.id,
                formateur: newData.formateur_name,
                class: newData.class_id
            };
            setSchedule([...schedule, newSeance]);
            setIsSeanceModalOpen(false);
            addNotification('Nouvelle séance ajoutée au planning.', 'success');
        } catch (error) {
            console.error('Error creating seance', error);
            addNotification(error.response?.data?.message || 'Erreur lors de la création', 'error');
        }
    };

    const handleDeleteSeance = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(`/api/admin/schedule/${id}`, config);

            setSchedule(prev => prev.filter(s => s.id !== id));
            setIsSeanceModalOpen(false);
            addNotification('Séance supprimée avec succès.', 'success');
        } catch (error) {
            console.error('Error deleting seance', error);
            addNotification(error.response?.data?.message || 'Erreur lors de la suppression', 'error');
        }
    };

    const days = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];

    const timeSlots = [
        '08:30 - 09:30', '09:30 - 10:30', '10:30 - 11:30', '11:30 - 12:30', '12:30 - 13:30',
        '13:30 - 14:30', '14:30 - 15:30', '15:30 - 16:30', '16:30 - 17:30', '17:30 - 18:30'
    ];

    const filteredSchedule = schedule.filter(slot => slot.class === selectedClass);

    const getSessionForDayAndStart = (day, startTime) => {
        return filteredSchedule.find(s => s.day === day && s.time.startsWith(startTime));
    };

    const getColSpan = (timeStr) => {
        const parts = timeStr.trim().split(/\s*-\s*/);
        const start = parts[0];
        const end = parts[1];
        const startIdx = timeSlots.findIndex(ts => ts.includes(start));
        const endIdx = timeSlots.findIndex(ts => ts.includes(end));
        if (startIdx === -1 || endIdx === -1) return 1;
        return endIdx === startIdx ? 1 : endIdx - startIdx + 1;
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <div className="w-12 h-12 border-4 border-slate-100 border-t-[var(--primary)] rounded-full animate-spin mb-6"></div>
                <span className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-400">INITIALISATION DU PLANNING...</span>
            </div>
        );
    }

    return (
        <div className="space-y-12 fade-up transition-all duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between border-b border-slate-100 pb-8 lg:pb-12 gap-6 lg:gap-8">
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-[var(--secondary)] uppercase italic leading-[0.9]">Emploi du Temps</h1>
                    <p className="text-[var(--text-muted)] text-[10px] lg:text-xs tracking-[0.4em] uppercase font-black">Gestion administrative du planning</p>
                </div>
                <div className="flex flex-wrap gap-4 justify-end">
                    <div className="relative">
                        <button
                            onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                            className="bg-white border border-[var(--border)] px-6 py-4 rounded-xl flex items-center gap-4 hover:border-[var(--primary)] transition-all shadow-sm"
                        >
                            <Filter className="w-4 h-4 text-[var(--primary)]" />
                            <span className="text-[10px] font-black tracking-widest uppercase text-[var(--secondary)]">
                                {streamFilter === 'ALL' ? 'TOUTES LES FILIÈRES' : streamFilter}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-[var(--primary)] transition-transform ${isFilterDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isFilterDropdownOpen && (
                            <div className="absolute top-full right-0 mt-3 bg-white border border-[var(--border)] rounded-2xl z-50 shadow-2xl min-w-[240px] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                {['ALL', ...new Set(availableClasses.map(c => c.stream).filter(Boolean))].map(stream => (
                                    <div
                                        key={stream}
                                        className={`px-6 py-4 cursor-pointer text-[10px] font-black tracking-widest uppercase transition-colors ${streamFilter === stream ? 'bg-[var(--primary)] text-white' : 'text-[var(--secondary)] hover:bg-slate-50'}`}
                                        onClick={() => {
                                            setStreamFilter(stream);
                                            setIsFilterDropdownOpen(false);
                                        }}
                                    >
                                        {stream === 'ALL' ? 'TOUTES LES FILIÈRES' : stream}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => { setTargetSeance(null); setIsSeanceModalOpen(true); }}
                        className="btn-ista px-8 py-4 flex items-center gap-3"
                    >
                        <Plus className="w-5 h-5" />
                        <span>AJOUTER UNE SÉANCE</span>
                    </button>
                </div>
            </div>

            {/* Class Selector Bar */}
            <div className="flex gap-6 border-b border-slate-50 pb-8 overflow-x-auto no-scrollbar pt-4">
                {(streamFilter === 'ALL' ? availableClasses : availableClasses.filter(c => c.stream === streamFilter)).map((cls, index) => (
                    <div
                        key={index}
                        onClick={() => setSelectedClass(cls.id)}
                        className={`min-w-[240px] flex-shrink-0 p-8 rounded-3xl border transition-all duration-500 group cursor-pointer ${selectedClass === cls.id
                            ? 'border-[var(--primary)] bg-green-50/30 ring-4 ring-green-500/5 shadow-xl shadow-green-500/5'
                            : 'border-slate-100 bg-white hover:border-[var(--primary)]/30 hover:shadow-lg'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-black tracking-widest text-[var(--primary)] uppercase">{cls.id}</span>
                            <div className={`w-2 h-2 rounded-full ${selectedClass === cls.id ? 'bg-[var(--primary)] animate-pulse' : 'bg-slate-200'}`}></div>
                        </div>
                        <h3 className="text-xl font-black italic text-[var(--secondary)] tracking-tight mb-2 truncate group-hover:text-[var(--primary)] transition-colors">{cls.title}</h3>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-2 truncate italic">{cls.stream}</p>
                    </div>
                ))}
            </div>

            {/* Table-based Timetable (Explicit scroll-x handling) */}
            <div className="w-full relative overflow-x-auto ista-scrollbar rounded-3xl bg-slate-50/20">
                <table className="w-full border-separate border-spacing-2 min-w-[1600px] table-fixed">
                    <thead>
                        <tr>
                            <th className="sticky left-0 z-50 w-[140px] p-4 bg-white rounded-2xl border border-slate-100 shadow-[2px_0_10px_rgba(0,0,0,0.05)]">
                                <div className="flex items-center justify-center gap-3">
                                    <CalIcon className="w-4 h-4 text-[var(--primary)]" />
                                    <span className="text-[10px] font-black tracking-widest text-[var(--secondary)]">JOURS</span>
                                </div>
                            </th>
                            {timeSlots.map(slot => (
                                <th key={slot} className="p-4 bg-white rounded-2xl border border-slate-100 min-w-[150px] shadow-sm">
                                    <div className="flex flex-col items-center">
                                        <span className="text-[10px] font-black tracking-widest text-[var(--secondary)] uppercase">{slot}</span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {days.map(day => {
                            let skipColumns = 0;
                            return (
                                <tr key={day} className="h-40 group">
                                    <td className="sticky left-0 (Parte Days) z-40 p-4 bg-white rounded-2xl border border-slate-100 font-black italic text-sm text-[var(--secondary)] text-center group-hover:bg-green-50/50 transition-colors shadow-[2px_0_10px_rgba(0,0,0,0.05)]">
                                        {day}
                                    </td>
                                    {timeSlots.map((slot, idx) => {
                                        if (skipColumns > 0) {
                                            skipColumns--;
                                            return null;
                                        }

                                        const session = getSessionForDayAndStart(day, slot.split(' - ')[0]);
                                        if (session) {
                                            const span = getColSpan(session.time);
                                            skipColumns = span - 1;
                                            return (
                                                <td key={idx} colSpan={span} className="p-2">
                                                    <div
                                                        onClick={() => { setTargetSeance(session); setIsSeanceModalOpen(true); }}
                                                        className="h-full bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.03)] hover:shadow-xl hover:border-[var(--primary)]/40 hover:-translate-y-1 transform-all duration-300 cursor-pointer group/cell relative overflow-hidden flex flex-col justify-between"
                                                    >
                                                        <div className="absolute top-0 right-0 w-12 h-12 bg-green-50 rounded-bl-[32px] transform translate-x-4 -translate-y-4 group-hover/cell:scale-110 transition-transform"></div>

                                                        <div className="flex items-center justify-between relative mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="w-3 h-3 text-[var(--primary)]" />
                                                                <span className="text-[9px] font-black tracking-widest text-[var(--primary)]">{session.time}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-lg group-hover/cell:bg-[var(--primary)]/10 transition-colors">
                                                                <MapPin className="w-2.5 h-2.5 text-slate-400" />
                                                                <span className="text-[9px] font-black tracking-widest text-slate-500 uppercase">{session.room}</span>
                                                            </div>
                                                        </div>

                                                        <h4 className="text-lg font-black italic text-[var(--secondary)] uppercase tracking-tight leading-none mb-4 group-hover/cell:text-[var(--primary)] transition-colors">
                                                            {session.subject}
                                                        </h4>

                                                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                                            <div className="flex items-center gap-2 overflow-hidden">
                                                                <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center text-[8px] font-black text-[var(--secondary)] border border-slate-100 group-hover/cell:bg-[var(--primary)] group-hover/cell:text-white transition-colors">
                                                                    {session.formateur?.split(' ').map(n => n[0]).join('')}
                                                                </div>
                                                                <span className="text-[9px] font-bold text-slate-400 uppercase truncate max-w-[80px] group-hover/cell:text-[var(--secondary)]">{session.formateur}</span>
                                                            </div>
                                                            <div className="p-1.5 bg-slate-50 rounded-lg group-hover/cell:bg-[var(--primary)] group-hover/cell:text-white text-slate-300 transition-colors">
                                                                <Edit3 className="w-3.5 h-3.5" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            );
                                        }

                                        return (
                                            <td key={idx} className="p-2 border border-dashed border-slate-100 rounded-3xl hover:bg-white hover:border-slate-200 hover:text-slate-300">
                                                <div className="h-full flex items-center justify-center text-[8px] font-bold text-slate-200 tracking-[0.3em] transition-all">
                                                    LIBRE / VIDE
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <SeanceDossierModal
                isOpen={isSeanceModalOpen}
                onClose={() => setIsSeanceModalOpen(false)}
                targetSeance={targetSeance}
                handleUpdateSeance={handleUpdateSeance}
                handleCreateSeance={handleCreateSeance}
                handleDeleteSeance={handleDeleteSeance}
                availableClasses={availableClasses}
                formateurs={formateurs}
            />
            <style>{`
                /* Rock-solid sticky positioning for Days part */
                .sticky.left-0 {
                    left: 0 !important;
                    background-color: #ffffff !important;
                    position: sticky !important;
                }
            `}</style>
        </div>
    );
};

export default Timelines;
