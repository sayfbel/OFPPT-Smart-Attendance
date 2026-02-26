import React, { useState, useEffect } from 'react';
import { Calendar as CalIcon, Clock, Filter, ChevronRight, X, ChevronDown } from 'lucide-react';
import axios from 'axios';
import SeanceDossierModal from '../../components/SeanceDossierModal';
import { useNotification } from '../../context/NotificationContext';

const Timelines = () => {
    const { addNotification } = useNotification();
    const [selectedClass, setSelectedClass] = useState('DEV101');
    const [schedule, setSchedule] = useState([]);
    const [availableClasses, setAvailableClasses] = useState([]);

    const [isSeanceModalOpen, setIsSeanceModalOpen] = useState(false);
    const [targetSeance, setTargetSeance] = useState(null);
    const [streamFilter, setStreamFilter] = useState('ALL');
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
    const [formateurs, setFormateurs] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const config = { headers: { Authorization: `Bearer ${token}` } };

                const [schedRes, formRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/admin/schedule', config),
                    axios.get('http://localhost:5000/api/admin/formateurs', config)
                ]);

                setSchedule(schedRes.data.schedule || []);
                setAvailableClasses(schedRes.data.classes || []);
                setFormateurs(formRes.data.formateurs || []);
            } catch (error) {
                console.error('Error fetching timeline data', error);
            }
        };
        fetchData();
    }, []);

    const handleUpdateSeance = async (updatedData) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`http://localhost:5000/api/admin/schedule/${updatedData.id}`, updatedData, config);

            // Update schedule locally
            setSchedule(prev => prev.map(s => s.id === updatedData.id ? {
                ...s,
                ...updatedData,
                formateur: updatedData.formateur_name,
                class: updatedData.class_id
            } : s));
            setIsSeanceModalOpen(false);
            addNotification('Event log modified successfully.', 'success');
        } catch (error) {
            console.error('Error updating seance', error);
            addNotification(error.response?.data?.message || 'Error updating seance', 'error');
        }
    };

    const handleCreateSeance = async (newData) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.post('http://localhost:5000/api/admin/schedule', newData, config);

            // Add to schedule locally
            const newSeance = {
                ...newData,
                id: res.data.id,
                formateur: newData.formateur_name,
                class: newData.class_id
            };
            setSchedule([...schedule, newSeance]);
            setIsSeanceModalOpen(false);
            addNotification('New identity event initialized in timeline.', 'success');
        } catch (error) {
            console.error('Error creating seance', error);
            addNotification(error.response?.data?.message || 'Error initializing event', 'error');
        }
    };

    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

    // Line of times (Seances)
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

    return (
        <div className="space-y-12 fade-up transition-colors duration-500">
            <div className="flex items-end justify-between border-b border-[var(--border-strong)] pb-12 transition-colors duration-500">
                <div className="space-y-4">
                    <h1 className="text-7xl font-black tracking-tighter text-[var(--primary)] uppercase italic transition-colors duration-500">Timelines</h1>
                    <p className="text-[var(--text-muted)] text-xs tracking-[0.4em] uppercase font-bold transition-colors duration-500">Synchronized Operation Schedules</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <button
                            onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                            className="btn-noir btn-outline px-6 py-3 flex items-center gap-2"
                        >
                            <Filter className="w-3 h-3" />
                            <span className="text-[10px] font-bold tracking-widest uppercase">
                                {streamFilter === 'ALL' ? 'ALL STREAMS' : streamFilter}
                            </span>
                            <ChevronDown className={`w-3 h-3 transition-transform ${isFilterDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isFilterDropdownOpen && (
                            <div className="absolute top-full right-0 mt-2 bg-[var(--background)] border border-[var(--border-strong)] z-50 shadow-2xl min-w-[200px] fade-up">
                                {['ALL', ...new Set(availableClasses.map(c => c.stream).filter(Boolean))].map(stream => (
                                    <div
                                        key={stream}
                                        className={`px-6 py-4 cursor-pointer text-[10px] font-black tracking-widest uppercase transition-colors hover:bg-[var(--surface-hover)] ${streamFilter === stream ? 'bg-[var(--primary)] text-[var(--background)]' : 'text-[var(--text-muted)] hover:text-[var(--primary)]'}`}
                                        onClick={() => {
                                            setStreamFilter(stream);
                                            setIsFilterDropdownOpen(false);
                                        }}
                                    >
                                        {stream === 'ALL' ? 'ALL STREAMS' : stream}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => { setTargetSeance(null); setIsSeanceModalOpen(true); }}
                        className="btn-noir px-8 py-3 flex items-center gap-2"
                    >
                        <span>Master Schedule</span>
                        <CalIcon className="w-4 h-4 ml-2" />
                    </button>
                </div>
            </div>
            <div className="flex gap-6 border-b border-[var(--border-strong)] pb-8 overflow-x-auto no-scrollbar transition-colors duration-500">
                {(streamFilter === 'ALL' ? availableClasses : availableClasses.filter(c => c.stream === streamFilter)).map((cls, index) => (
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
                            <span className={`px-3 py-1 border text-[9px] font-bold tracking-widest uppercase transition-colors duration-500 ${selectedClass === cls.id ? 'bg-[var(--primary)] text-[var(--primary-text)] border-[var(--primary)]' : 'bg-[var(--background)] text-[var(--primary)] border-[var(--border)] group-hover:border-[var(--primary)]'
                                }`}>
                                {selectedClass === cls.id ? 'ACTIVE' : 'STANDBY'}
                            </span>
                        </div>
                        <h3 className="text-2xl font-black italic text-[var(--primary)] tracking-tighter mb-2 transition-colors duration-500 truncate">{cls.title}</h3>
                        <div className="flex flex-col gap-2 text-xs font-bold uppercase tracking-widest mt-6 pt-6 border-t border-[var(--border-strong)] transition-colors duration-500">
                            <span className="text-[var(--text-muted)] group-hover:text-[var(--primary)] transition-colors">STREAM: <span className="text-[var(--primary)]">{cls.stream}</span></span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pt-8 overflow-x-auto no-scrollbar w-full relative">
                <div className="w-full min-w-[1200px] pb-12 relative fade-up">
                    {/* Central Vertical Line (Halfway point for Break) */}
                    <div className="absolute left-[calc(120px+(100%-120px)/2)] top-0 bottom-0 w-px bg-[var(--border-strong)] z-0"></div>

                    {/* Timeline Headers */}
                    <div className="grid grid-cols-[120px_repeat(10,minmax(0,1fr))] gap-0 pb-8 border-b border-[var(--border-strong)] relative z-10">
                        <div></div> {/* Empty space for Day column */}
                        {timeSlots.map((time, idx) => (
                            <div key={idx} className="flex justify-center items-center text-center bg-[var(--background)]">
                                <span className="text-[10px] font-black tracking-[0.3em] text-[var(--text-muted)] whitespace-nowrap">
                                    {time}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Timeline Grid */}
                    <div className="pt-8">
                        {days.map((day) => {
                            const daySchedule = filteredSchedule.filter(slot => slot.day === day);

                            return (
                                <div key={day} className="relative py-16 grid grid-cols-[120px_repeat(10,minmax(0,1fr))] gap-0 items-center group">
                                    {/* Horizontal connection line for the day */}
                                    <div className="absolute left-[120px] right-0 top-1/2 -translate-y-1/2 h-px bg-[var(--border-strong)] z-0"></div>

                                    {/* Central Clock Icon precisely on median */}
                                    <div className="absolute left-[calc(120px+(100%-120px)/2)] top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-[var(--background)] border border-[var(--border-strong)] z-10 text-[var(--text-muted)] group-hover:border-[var(--primary)] group-hover:text-[var(--primary-text)] group-hover:bg-[var(--primary)] transition-all">
                                        <Clock className="w-4 h-4" />
                                    </div>

                                    {/* Day Name (Left Axis) */}
                                    <div className="flex items-center z-10 bg-[var(--background)] w-max pr-8 py-2">
                                        <span className="text-[11px] font-black tracking-[0.4em] text-[var(--text-muted)] uppercase">{day}</span>
                                    </div>

                                    {/* Event Cards */}
                                    {daySchedule.map((slot, index) => {
                                        const gridClasses = getGridSpan(slot.time);
                                        const startHour = parseInt(slot.time.split(/\s*-\s*/)[0].split(':')[0], 10);
                                        const paddingClass = startHour >= 13 ? 'pl-8 pr-0' : 'pl-0 pr-8';
                                        return (
                                            <div key={index} className={`${gridClasses} relative z-20 hover:-translate-y-1 transition-transform ${paddingClass}`}>
                                                <div
                                                    onClick={() => { setTargetSeance(slot); setIsSeanceModalOpen(true); }}
                                                    className="cursor-pointer p-8 border border-[var(--border-strong)] bg-[var(--background)] hover:border-[var(--primary)] transition-colors duration-500 w-full group/card"
                                                >
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
                                                        <span className="text-[var(--text-muted)] truncate shrink-0">LEAD: <span className="text-[var(--text-muted)] group-hover/card:text-[var(--primary)] transition-colors">{slot.formateur}</span></span>
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

            <SeanceDossierModal
                isOpen={isSeanceModalOpen}
                onClose={() => setIsSeanceModalOpen(false)}
                targetSeance={targetSeance}
                handleUpdateSeance={handleUpdateSeance}
                handleCreateSeance={handleCreateSeance}
                availableClasses={availableClasses}
                formateurs={formateurs}
            />
        </div>
    );
};

export default Timelines;
