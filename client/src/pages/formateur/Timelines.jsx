import React, { useState, useEffect } from 'react';
import { Calendar as CalIcon, Clock, Filter, ChevronRight, X, ChevronDown, BookOpen, MapPin, Activity } from 'lucide-react';
import axios from 'axios';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';

const Timelines = () => {
    const { addNotification } = useNotification();
    const { user } = useAuth();
    const [selectedClass, setSelectedClass] = useState(null);
    const [schedule, setSchedule] = useState([]);
    const [availableClasses, setAvailableClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const config = { headers: { Authorization: `Bearer ${token}` } };

                const res = await axios.get('/api/formateur/schedule', config);

                setSchedule(res.data.schedule || []);
                const classes = res.data.classes || [];
                setAvailableClasses(classes);

                if (classes.length > 0) {
                    setSelectedClass(classes[0].id);
                }
            } catch (error) {
                console.error('Error fetching formateur schedule', error);
                addNotification('Échec de la récupération du planning personnel.', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [addNotification]);

    const days = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
    const timeSlots = [
        '08:30 - 09:30', '09:30 - 10:30', '10:30 - 11:30', '11:30 - 12:30', '12:30 - 13:30',
        '13:30 - 14:30', '14:30 - 15:30', '15:30 - 16:30', '16:30 - 17:30', '17:30 - 18:30'
    ];

    const getGridSpan = (timeStr) => {
        const timeMap = {
            '08:30': 2, '09:30': 3, '10:30': 4, '11:30': 5, '12:30': 6,
            '13:30': 7, '14:30': 8, '15:30': 9, '16:30': 10, '17:30': 11, '18:30': 12
        };
        const parts = timeStr.trim().split(/\s*-\s*/);
        const start = parts[0];
        const end = parts[1];

        const stCol = timeMap[start] || 2;
        const endCol = timeMap[end] || (stCol + 1);
        const span = endCol - stCol;

        const startClasses = {
            2: 'col-start-2', 3: 'col-start-3', 4: 'col-start-4', 5: 'col-start-5', 6: 'col-start-6',
            7: 'col-start-7', 8: 'col-start-8', 9: 'col-start-9', 10: 'col-start-10', 11: 'col-start-11'
        };
        const spanClasses = {
            1: 'col-span-1', 2: 'col-span-2', 3: 'col-span-3', 4: 'col-span-4', 5: 'col-span-5'
        };

        return `${startClasses[stCol] || 'col-start-2'} ${spanClasses[span] || 'col-span-1'}`;
    };

    const filteredSchedule = schedule.filter(slot => slot.class === selectedClass);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <div className="w-12 h-12 border-4 border-slate-100 border-t-[var(--primary)] rounded-full animate-spin mb-6"></div>
                <span className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-400">Chargement du Planning...</span>
            </div>
        );
    }

    return (
        <div className="space-y-12 fade-up transition-all duration-500">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between border-b border-slate-100 pb-12 gap-8">
                <div className="space-y-4">
                    <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-[var(--secondary)] uppercase italic leading-none">Emploi du Temps</h1>
                    <p className="text-[var(--text-muted)] text-xs tracking-[0.4em] uppercase font-black">Mon planning de déploiement personnel</p>
                </div>
            </div>

            {availableClasses.length === 0 ? (
                <div className="py-32 flex flex-col items-center justify-center text-center bg-white rounded-[40px] border border-dashed border-slate-200 shadow-inner">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                        <Activity className="w-8 h-8 text-slate-200" />
                    </div>
                    <span className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-400 mb-2">AUCUNE AFFECTATION ACTIVE</span>
                    <p className="text-[9px] font-bold tracking-widest text-slate-300 uppercase italic">Vous n'êtes actuellement assigné à aucun groupe opérationnel.</p>
                </div>
            ) : (
                <>
                    <div className="flex gap-6 border-b border-slate-50 pb-8 overflow-x-auto no-scrollbar pt-4">
                        {availableClasses.map((cls, index) => (
                            <div
                                key={index}
                                onClick={() => setSelectedClass(cls.id)}
                                className={`min-w-[280px] flex-shrink-0 p-8 rounded-3xl border transition-all duration-500 group cursor-pointer ${selectedClass === cls.id
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

                    <div className="pt-8 overflow-x-auto ista-scrollbar w-full relative">
                        <div className="w-full min-w-[1400px] pb-12 relative fade-up">
                            {/* Time Headers */}
                            <div className="grid grid-cols-[150px_repeat(10,minmax(0,1fr))] gap-0 pb-8 border-b border-slate-100 mb-8 sticky top-0 bg-white z-40">
                                <div className="flex items-center px-8">
                                    <CalIcon className="w-5 h-5 text-[var(--primary)]" />
                                    <span className="ml-3 text-[10px] font-black tracking-widest text-[var(--secondary)] uppercase">JOURS</span>
                                </div>
                                {timeSlots.map((time, idx) => (
                                    <div key={idx} className="flex justify-center items-center py-4 border-l border-slate-50">
                                        <span className="text-[10px] font-black tracking-widest text-slate-400 whitespace-nowrap">
                                            {time}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Timeline Grid */}
                            <div className="space-y-4">
                                {days.map((day) => {
                                    const daySchedule = filteredSchedule.filter(slot => slot.day === day);

                                    return (
                                        <div key={day} className="relative py-8 grid grid-cols-[150px_repeat(10,minmax(0,1fr))] gap-0 items-center group transition-colors hover:bg-slate-50/50 rounded-3xl">
                                            {/* Base Line */}
                                            <div className="absolute left-[150px] right-20 top-1/2 -translate-y-1/2 h-0.5 bg-slate-100 z-0"></div>

                                            {/* Day Name */}
                                            <div className="px-8 z-10 relative">
                                                <span className="text-sm font-black italic tracking-tight text-[var(--secondary)] uppercase">{day}</span>
                                            </div>

                                            {/* Event Cards */}
                                            {daySchedule.map((slot, index) => {
                                                const gridClasses = getGridSpan(slot.time);
                                                return (
                                                    <div key={index} className={`${gridClasses} relative z-20 px-4 group/card-wrapper`}>
                                                        <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-[var(--primary)] hover:shadow-xl hover:shadow-green-500/5 transition-all duration-300 group/card relative overflow-hidden">
                                                            <div className="absolute top-0 right-0 w-16 h-16 bg-green-50 rounded-bl-[40px] transform translate-x-8 -translate-y-8 group-hover/card:scale-110 transition-transform"></div>

                                                            <div className="flex items-center justify-between mb-4 relative">
                                                                <div className="flex items-center gap-2">
                                                                    <Clock className="w-3 h-3 text-[var(--primary)]" />
                                                                    <span className="text-[9px] font-black tracking-widest text-[var(--primary)] uppercase">{slot.time}</span>
                                                                </div>
                                                                <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-lg border border-slate-100">
                                                                    <MapPin className="w-2.5 h-2.5 text-slate-400" />
                                                                    <span className="text-[9px] font-black tracking-widest text-slate-500 uppercase">{slot.room}</span>
                                                                </div>
                                                            </div>

                                                            <h3 className="text-xl font-black italic text-[var(--secondary)] uppercase tracking-tight mb-6 truncate leading-tight group-hover/card:text-[var(--primary)] transition-colors">
                                                                {slot.subject}
                                                            </h3>

                                                            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse"></div>
                                                                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">SÉANCE ACTIVE</span>
                                                                </div>
                                                                <span className="text-[9px] font-black text-[var(--primary)] uppercase">{slot.class}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </>
            )}
            <style>{`
                .ista-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
                .ista-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .ista-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default Timelines;
