import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { ChevronRight, X, ChevronDown, CheckSquare, Square } from 'lucide-react';

const SeanceDossierModal = ({ isOpen, onClose, targetSeance, handleUpdateSeance, handleCreateSeance, availableClasses = [], formateurs = [] }) => {
    const timeSlots = ['08:30', '09:30', '10:30', '11:30', '12:30', '13:30', '14:30', '15:30', '16:30', '17:30', '18:30'];
    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

    const [isStartDropdownOpen, setIsStartDropdownOpen] = useState(false);
    const [isEndDropdownOpen, setIsEndDropdownOpen] = useState(false);
    const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);
    const [isFormateurDropdownOpen, setIsFormateurDropdownOpen] = useState(false);
    const [isDayDropdownOpen, setIsDayDropdownOpen] = useState(false);

    const [seanceEdit, setSeanceEdit] = useState({
        id: '',
        subject: '',
        room: '',
        formateur_id: '',
        formateur_name: '',
        class_id: '',
        day: 'MONDAY',
        startTime: '08:30',
        endTime: '10:30'
    });

    const isCreation = !targetSeance?.id;

    useEffect(() => {
        if (targetSeance) {
            let start = '08:30';
            let end = '10:30';
            if (targetSeance.time && targetSeance.time.includes('-')) {
                const parts = targetSeance.time.split('-');
                start = parts[0].trim();
                end = parts[1].trim();
            }

            // Find formateur ID by name if it's an update and we only have the name
            const matchingFormateur = formateurs.find(f => f.name === targetSeance.formateur);

            setSeanceEdit({
                id: targetSeance.id || '',
                subject: targetSeance.subject || '',
                room: targetSeance.room || '',
                formateur_id: matchingFormateur?.id || '',
                formateur_name: targetSeance.formateur || '',
                class_id: targetSeance.class || '',
                day: targetSeance.day || 'MONDAY',
                startTime: start,
                endTime: end
            });
        } else {
            setSeanceEdit({
                id: '',
                subject: '',
                room: '',
                formateur_id: '',
                formateur_name: '',
                class_id: '',
                day: 'MONDAY',
                startTime: '08:30',
                endTime: '10:30'
            });
        }
    }, [targetSeance, formateurs]);

    if (!isOpen) return null;

    const onSubmit = (e) => {
        e.preventDefault();
        const payload = {
            ...seanceEdit,
            time: `${seanceEdit.startTime} - ${seanceEdit.endTime}`
        };

        if (isCreation) {
            handleCreateSeance(payload);
        } else {
            handleUpdateSeance(payload);
        }
    };

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] bg-[var(--background)] flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
            <div className="bg-[var(--background)] w-full max-w-7xl flex flex-col md:flex-row relative fade-up my-auto h-[80vh] min-h-[600px]">

                {/* Corner accents (white) */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[var(--primary)] -translate-x-4 -translate-y-4"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[var(--primary)] translate-x-4 -translate-y-4"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[var(--primary)] -translate-x-4 translate-y-4"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[var(--primary)] translate-x-4 translate-y-4"></div>

                {/* Left Column (Info Panel) */}
                <div className="w-full md:w-[400px] border-r border-[var(--border-strong)] p-12 flex flex-col relative">

                    <div className="mb-12">
                        <span className="flex items-center gap-2 text-[10px] font-black tracking-[0.3em] text-[var(--primary)] uppercase mb-4">
                            <div className="w-2 h-2 bg-[var(--primary)]"></div>
                            SEANCE DOSSIER
                        </span>
                        <h2 className="text-6xl font-black italic tracking-tighter text-[var(--primary)] leading-[0.9]">
                            EVENT<br />{isCreation ? 'INIT' : 'EDIT'}
                        </h2>
                    </div>

                    <div className="space-y-8 mt-auto">
                        <div>
                            <label className="block text-[8px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase mb-3 text-left">TARGET_SQUADRON</label>
                            <div className="px-5 py-4 bg-[var(--background)] border border-[var(--border-strong)] flex items-center">
                                <span className="text-xl font-black italic text-[var(--primary)] tracking-tighter">
                                    {seanceEdit.class_id || 'PENDING'}
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-[8px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase mb-3 text-left">TIME_SLOT</label>
                            <div className="px-5 py-4 bg-[var(--background)] border border-[var(--border-strong)]">
                                <span className="text-sm font-black tracking-widest text-[var(--primary)] uppercase">
                                    {seanceEdit.day} • {seanceEdit.startTime} - {seanceEdit.endTime}
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-[8px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase mb-3 text-left">OPERATIONAL_STATUS</label>
                            <div className="px-5 py-4 bg-[var(--background)] border border-[var(--border-strong)] flex items-center gap-3">
                                <div className="w-3 h-3 bg-[var(--primary)] flex items-center justify-center">
                                    <ChevronRight className="w-3 h-3 text-[var(--background)]" />
                                </div>
                                <span className="text-xs font-black tracking-widest text-[var(--primary)] uppercase">
                                    {isCreation ? 'AWAITING_INIT' : 'PENDING_UPDATE'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 pt-8 font-mono text-[8px] text-[var(--text-muted)] tracking-widest uppercase opacity-50 space-y-1 block text-left">
                        <p>EVENT_ID: {isCreation ? 'NEW_ENTRY' : seanceEdit.id}</p>
                        <p>STATUS: {isCreation ? 'CREATION' : 'MODIFICATION'}</p>
                        <p>ORIGIN: D.A.D_HQ_OPS</p>
                    </div>
                </div>

                {/* Right Column (Input Fields) */}
                <div className="flex-1 p-12 flex flex-col relative overflow-y-auto">
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 bg-[var(--surface)] border border-[var(--border-strong)] hover:border-[var(--primary)] transition-colors text-[var(--text-muted)] hover:text-[var(--primary)] z-10"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    <div className="mb-14 max-w-2xl">
                        <h3 className="text-2xl font-black italic tracking-tighter text-[var(--primary)] uppercase mb-2">SEANCE {isCreation ? 'REGISTRATION' : 'UPDATE'} INPUT</h3>
                        <p className="text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase">
                            {isCreation ? 'Initialize new timeline parameters for the selected squadron.' : 'Modify visual and textual parameters for the selected seance.'}
                        </p>
                    </div>

                    <form className="flex flex-col flex-1" onSubmit={onSubmit}>
                        <div className="space-y-10 max-w-2xl">
                            {/* Class Selection (Only if creation) */}
                            <div className="grid grid-cols-2 gap-8">
                                <div className="relative">
                                    <label className="block text-[10px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase mb-2">TARGET CLUSTER (SQUADRON)</label>
                                    <div
                                        className="w-full bg-transparent border-b border-[var(--border-strong)] py-4 flex justify-between items-center cursor-pointer group"
                                        onClick={() => setIsClassDropdownOpen(!isClassDropdownOpen)}
                                    >
                                        <span className={`text-sm font-black tracking-widest uppercase truncate ${seanceEdit.class_id ? 'text-[var(--primary)]' : 'text-[var(--border-strong)]'}`}>
                                            {seanceEdit.class_id || 'SELECT SQUADRON...'}
                                        </span>
                                        <ChevronDown className={`w-4 h-4 text-[var(--primary)] transition-transform duration-300 ${isClassDropdownOpen ? 'rotate-180' : ''}`} />
                                    </div>
                                    {isClassDropdownOpen && (
                                        <div className="absolute top-full left-0 w-full mt-2 bg-[var(--background)] border border-[var(--border-strong)] z-50 shadow-2xl max-h-48 overflow-y-auto custom-scrollbar fade-up">
                                            {availableClasses.map(cls => (
                                                <div
                                                    key={cls.id}
                                                    className={`px-6 py-4 cursor-pointer text-sm font-black tracking-widest uppercase transition-colors hover:bg-[var(--surface-hover)] ${seanceEdit.class_id === cls.id ? 'bg-[var(--primary)] text-[var(--background)]' : 'text-[var(--text-muted)] hover:text-[var(--primary)]'}`}
                                                    onClick={() => { setSeanceEdit({ ...seanceEdit, class_id: cls.id }); setIsClassDropdownOpen(false); }}
                                                >
                                                    {cls.id}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="relative">
                                    <label className="block text-[10px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase mb-2">OPERATIONAL DAY</label>
                                    <div
                                        className="w-full bg-transparent border-b border-[var(--border-strong)] py-4 flex justify-between items-center cursor-pointer group"
                                        onClick={() => setIsDayDropdownOpen(!isDayDropdownOpen)}
                                    >
                                        <span className="text-sm font-black tracking-widest text-[var(--primary)] uppercase">
                                            {seanceEdit.day}
                                        </span>
                                        <ChevronDown className={`w-4 h-4 text-[var(--primary)] transition-transform duration-300 ${isDayDropdownOpen ? 'rotate-180' : ''}`} />
                                    </div>
                                    {isDayDropdownOpen && (
                                        <div className="absolute top-full left-0 w-full mt-2 bg-[var(--background)] border border-[var(--border-strong)] z-50 shadow-2xl max-h-48 overflow-y-auto custom-scrollbar fade-up">
                                            {days.map(day => (
                                                <div
                                                    key={day}
                                                    className={`px-6 py-4 cursor-pointer text-sm font-black tracking-widest uppercase transition-colors hover:bg-[var(--surface-hover)] ${seanceEdit.day === day ? 'bg-[var(--primary)] text-[var(--background)]' : 'text-[var(--text-muted)] hover:text-[var(--primary)]'}`}
                                                    onClick={() => { setSeanceEdit({ ...seanceEdit, day }); setIsDayDropdownOpen(false); }}
                                                >
                                                    {day}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase mb-2">SUBJECT MODULE</label>
                                <input
                                    type="text"
                                    required
                                    value={seanceEdit.subject}
                                    onChange={e => setSeanceEdit({ ...seanceEdit, subject: e.target.value })}
                                    placeholder="ENTER SUBJECT..."
                                    className="w-full bg-transparent border-b border-[var(--border-strong)] py-4 text-sm font-black tracking-widest text-[var(--primary)] uppercase placeholder:text-[var(--border-strong)] focus:border-[var(--primary)] focus:outline-none transition-colors"
                                />
                            </div>

                            <div className="relative">
                                <label className="block text-[10px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase mb-2">FORMATEUR LEAD</label>
                                <div
                                    className="w-full bg-transparent border-b border-[var(--border-strong)] py-4 flex justify-between items-center cursor-pointer group"
                                    onClick={() => setIsFormateurDropdownOpen(!isFormateurDropdownOpen)}
                                >
                                    <span className={`text-sm font-black tracking-widest uppercase truncate ${seanceEdit.formateur_id ? 'text-[var(--primary)]' : 'text-[var(--border-strong)]'}`}>
                                        {seanceEdit.formateur_name || 'SELECT LEAD FORMATEUR...'}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 text-[var(--primary)] transition-transform duration-300 ${isFormateurDropdownOpen ? 'rotate-180' : ''}`} />
                                </div>
                                {isFormateurDropdownOpen && (
                                    <div className="absolute top-full left-0 w-full mt-2 bg-[var(--background)] border border-[var(--border-strong)] z-50 shadow-2xl max-h-48 overflow-y-auto custom-scrollbar fade-up">
                                        {formateurs.map(f => (
                                            <div
                                                key={f.id}
                                                className={`px-6 py-4 cursor-pointer text-sm font-black tracking-widest uppercase transition-colors hover:bg-[var(--surface-hover)] ${seanceEdit.formateur_id === f.id ? 'bg-[var(--primary)] text-[var(--background)]' : 'text-[var(--text-muted)] hover:text-[var(--primary)]'}`}
                                                onClick={() => {
                                                    setSeanceEdit({ ...seanceEdit, formateur_id: f.id, formateur_name: f.name });
                                                    setIsFormateurDropdownOpen(false);
                                                }}
                                            >
                                                {f.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-[10px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase mb-2">ROOM DESIGNATION</label>
                                <input
                                    type="text"
                                    required
                                    value={seanceEdit.room}
                                    onChange={e => setSeanceEdit({ ...seanceEdit, room: e.target.value.toUpperCase() })}
                                    placeholder="ENTER ROOM..."
                                    className="w-full bg-transparent border-b border-[var(--border-strong)] py-4 text-sm font-black tracking-widest text-[var(--primary)] uppercase placeholder:text-[var(--border-strong)] focus:border-[var(--primary)] focus:outline-none transition-colors"
                                />
                            </div>

                            <div className="flex gap-8">
                                <div className="flex-1 relative">
                                    <label className="block text-[10px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase mb-2">START TIME</label>
                                    <div
                                        className="w-full bg-[var(--background)] border-b border-[var(--border-strong)] py-4 flex justify-between items-center cursor-pointer group"
                                        onClick={() => { setIsStartDropdownOpen(!isStartDropdownOpen); setIsEndDropdownOpen(false); }}
                                    >
                                        <span className="text-sm font-black tracking-widest text-[var(--primary)] uppercase">
                                            {seanceEdit.startTime}
                                        </span>
                                        <ChevronDown className={`w-4 h-4 text-[var(--primary)] transition-transform duration-300 ${isStartDropdownOpen ? 'rotate-180' : ''}`} />
                                    </div>

                                    {isStartDropdownOpen && (
                                        <div className="absolute top-full left-0 w-full mt-2 bg-[var(--background)] border border-[var(--border-strong)] z-50 shadow-2xl max-h-48 overflow-y-auto custom-scrollbar fade-up">
                                            {timeSlots.map((time) => (
                                                <div
                                                    key={time}
                                                    className={`px-6 py-4 cursor-pointer text-sm font-black tracking-widest uppercase transition-colors hover:bg-[var(--surface-hover)] ${seanceEdit.startTime === time ? 'bg-[var(--primary)] text-[var(--background)] hover:bg-[var(--primary)]' : 'text-[var(--text-muted)] hover:text-[var(--primary)]'}`}
                                                    onClick={() => {
                                                        setSeanceEdit({ ...seanceEdit, startTime: time });
                                                        setIsStartDropdownOpen(false);
                                                    }}
                                                >
                                                    {time}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 relative">
                                    <label className="block text-[10px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase mb-2">END TIME</label>
                                    <div
                                        className="w-full bg-[var(--background)] border-b border-[var(--border-strong)] py-4 flex justify-between items-center cursor-pointer group"
                                        onClick={() => { setIsEndDropdownOpen(!isEndDropdownOpen); setIsStartDropdownOpen(false); }}
                                    >
                                        <span className="text-sm font-black tracking-widest text-[var(--primary)] uppercase">
                                            {seanceEdit.endTime}
                                        </span>
                                        <ChevronDown className={`w-4 h-4 text-[var(--primary)] transition-transform duration-300 ${isEndDropdownOpen ? 'rotate-180' : ''}`} />
                                    </div>

                                    {isEndDropdownOpen && (
                                        <div className="absolute top-full left-0 w-full mt-2 bg-[var(--background)] border border-[var(--border-strong)] z-50 shadow-2xl max-h-48 overflow-y-auto custom-scrollbar fade-up">
                                            {timeSlots.map((time) => (
                                                <div
                                                    key={time}
                                                    className={`px-6 py-4 cursor-pointer text-sm font-black tracking-widest uppercase transition-colors hover:bg-[var(--surface-hover)] ${seanceEdit.endTime === time ? 'bg-[var(--primary)] text-[var(--background)] hover:bg-[var(--primary)]' : 'text-[var(--text-muted)] hover:text-[var(--primary)]'}`}
                                                    onClick={() => {
                                                        setSeanceEdit({ ...seanceEdit, endTime: time });
                                                        setIsEndDropdownOpen(false);
                                                    }}
                                                >
                                                    {time}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto flex justify-end pt-12 max-w-2xl">
                            <button
                                type="submit"
                                className="w-full md:w-auto bg-[var(--primary)] text-[var(--background)] px-12 py-5 font-black tracking-[0.3em] text-[11px] hover:bg-[var(--surface-hover)] hover:text-[var(--primary)] transition-colors border border-[var(--primary)]"
                            >
                                {isCreation ? 'INITIALIZE EVENT' : 'UPDATE SEANCE'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default SeanceDossierModal;
