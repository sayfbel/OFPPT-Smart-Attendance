import React, { useState, useEffect } from 'react';
import { Calendar as CalIcon, Clock, Filter, ChevronRight, X, ChevronDown } from 'lucide-react';
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

                const res = await axios.get('http://localhost:5000/api/formateur/schedule', config);

                setSchedule(res.data.schedule || []);
                setAvailableClasses(res.data.classes || []);

                if (res.data.classes && res.data.classes.length > 0) {
                    setSelectedClass(res.data.classes[0].id);
                }
            } catch (error) {
                console.error('Error fetching formateur schedule', error);
                addNotification('Failed to retrieve personal schedule matrix.', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [addNotification]);

    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
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
        return <div className="flex items-center justify-center h-screen bg-black text-white">INITIALIZING TEMPORAL MATRIX...</div>;
    }

    return (
        <div className="space-y-12 fade-up">
            <div className="flex items-end justify-between border-b border-[var(--border-strong)] pb-12">
                <div className="space-y-4">
                    <p className="text-[var(--text-muted)] text-[10px] tracking-[0.5em] font-black uppercase">Personal Deployment Schedule</p>
                    <h1 className="text-7xl font-black tracking-tighter text-[var(--primary)] uppercase italic">Timelines</h1>
                </div>
            </div>

            {availableClasses.length === 0 ? (
                <div className="border border-[var(--border-strong)] border-dashed py-32 flex flex-col items-center justify-center text-center opacity-50">
                    <span className="text-xs font-black tracking-[0.5em] uppercase text-[var(--primary)] mb-4">NO ACTIVE ASSIGNMENTS</span>
                    <p className="text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase">You are currently not assigned to any operational squadrons.</p>
                </div>
            ) : (
                <>
                    <div className="flex gap-6 border-b border-[var(--border-strong)] pb-8 overflow-x-auto no-scrollbar">
                        {availableClasses.map((cls, index) => (
                            <div
                                key={index}
                                onClick={() => setSelectedClass(cls.id)}
                                className={`min-w-[300px] flex-shrink-0 p-8 border transition-all duration-500 group cursor-pointer ${selectedClass === cls.id
                                    ? 'border-[var(--primary)] bg-[var(--surface-hover)]'
                                    : 'border-[var(--border-strong)] bg-[var(--surface)] hover:border-[var(--primary)]'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[10px] font-black tracking-[0.3em] text-[var(--primary)] uppercase">{cls.id}</span>
                                    <span className={`px-3 py-1 border text-[9px] font-bold tracking-widest uppercase transition-colors duration-500 ${selectedClass === cls.id ? 'bg-[var(--primary)] text-[var(--background)] border-[var(--primary)]' : 'bg-[var(--background)] text-[var(--primary)] border-[var(--border)] group-hover:border-[var(--primary)]'
                                        }`}>
                                        {selectedClass === cls.id ? 'ACTIVE' : 'STANDBY'}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-black italic text-[var(--primary)] tracking-tighter mb-2 truncate">{cls.title}</h3>
                                <div className="flex flex-col gap-2 text-xs font-bold uppercase tracking-widest mt-6 pt-6 border-t border-[var(--border-strong)]">
                                    <span className="text-[var(--text-muted)] group-hover:text-[var(--primary)] transition-colors">STREAM: <span className="text-[var(--primary)]">{cls.stream}</span></span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-8 overflow-x-auto no-scrollbar w-full relative">
                        <div className="w-full min-w-[1200px] pb-12 relative">
                            {/* Central Vertical Line */}
                            <div className="absolute left-[calc(120px+(100%-120px)/2)] top-0 bottom-0 w-px bg-[var(--border-strong)] z-0"></div>

                            {/* Headers */}
                            <div className="grid grid-cols-[120px_repeat(10,minmax(0,1fr))] gap-0 pb-8 border-b border-[var(--border-strong)] relative z-10">
                                <div></div>
                                {timeSlots.map((time, idx) => (
                                    <div key={idx} className="flex justify-center items-center text-center bg-[var(--background)]">
                                        <span className="text-[10px] font-black tracking-[0.3em] text-[var(--text-muted)] whitespace-nowrap">
                                            {time}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Grid */}
                            <div className="pt-8">
                                {days.map((day) => {
                                    const daySchedule = filteredSchedule.filter(slot => slot.day === day);

                                    return (
                                        <div key={day} className="relative py-16 grid grid-cols-[120px_repeat(10,minmax(0,1fr))] gap-0 items-center group">
                                            <div className="absolute left-[120px] right-0 top-1/2 -translate-y-1/2 h-px bg-[var(--border-strong)] z-0"></div>

                                            <div className="absolute left-[calc(120px+(100%-120px)/2)] top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-[var(--background)] border border-[var(--border-strong)] z-10 text-[var(--text-muted)] group-hover:border-[var(--primary)] group-hover:text-[var(--background)] group-hover:bg-[var(--primary)] transition-all">
                                                <Clock className="w-4 h-4" />
                                            </div>

                                            <div className="flex items-center z-10 bg-[var(--background)] w-max pr-8 py-2">
                                                <span className="text-[11px] font-black tracking-[0.4em] text-[var(--text-muted)] uppercase">{day}</span>
                                            </div>

                                            {daySchedule.map((slot, index) => {
                                                const gridClasses = getGridSpan(slot.time);
                                                const startHour = parseInt(slot.time.split(/\s*-\s*/)[0].split(':')[0], 10);
                                                const paddingClass = startHour >= 13 ? 'pl-8 pr-0' : 'pl-0 pr-8';

                                                return (
                                                    <div key={index} className={`${gridClasses} relative z-20 hover:-translate-y-1 transition-transform ${paddingClass}`}>
                                                        <div className="p-8 border border-[var(--border-strong)] bg-[var(--background)] hover:border-[var(--primary)] transition-colors duration-500 w-full group/card">
                                                            <div className="flex items-center justify-between mb-6">
                                                                <span className="text-[10px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase">{slot.time}</span>
                                                                <span className="px-3 py-1.5 bg-[var(--surface)] border border-[var(--border)] text-[9px] font-black tracking-widest text-[var(--primary)] uppercase group-hover/card:border-[var(--primary)] transition-colors">{slot.room}</span>
                                                            </div>
                                                            <h3 className="text-4xl font-black italic text-[var(--primary)] uppercase tracking-tighter mb-4 truncate">
                                                                {slot.subject}
                                                            </h3>
                                                            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest mt-8 pt-6 border-t border-[var(--border-strong)] truncate">
                                                                <span className="text-[var(--text-muted)] shrink-0">SQUADRON: <span className="text-[var(--primary)]">{slot.class}</span></span>
                                                                <span className="text-[var(--border-strong)] shrink-0">|</span>
                                                                <span className="text-[var(--text-muted)] truncate shrink-0">STATUS: <span className="text-[var(--primary)]">ACTIVE</span></span>
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
        </div>
    );
};

export default Timelines;
