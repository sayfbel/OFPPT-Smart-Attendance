import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const CustomDatePicker = ({ selectedDate, onChange, placeholder = "SELECT DATE..." }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(selectedDate ? new Date(selectedDate) : new Date());
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const daysInMonth = new Date(currentDate.getFullYear(), currentMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentMonth(), 1).getDay();

    function currentMonth() {
        return currentDate.getMonth();
    }

    const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

    const handlePrevMonth = (e) => {
        e.stopPropagation();
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = (e) => {
        e.stopPropagation();
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleDateClick = (day) => {
        // Adjust month to be 1-indexed and pad with 0s
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const formattedDay = String(day).padStart(2, '0');
        const formattedDate = `${currentDate.getFullYear()}-${month}-${formattedDay}`;

        onChange(formattedDate);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <div
                className="flex items-center border-b border-[var(--border)] w-48 group cursor-pointer hover:border-[var(--primary)] transition-colors duration-500 py-3"
                onClick={() => setIsOpen(!isOpen)}
            >
                <CalendarIcon className={`w-3 h-3 text-[var(--text-muted)] group-hover:text-[var(--primary)] transition-colors duration-500 mr-4 ${isOpen ? 'text-[var(--primary)]' : ''}`} />
                <span className="text-[10px] tracking-widest uppercase flex-1 font-bold truncate">
                    {selectedDate ? <span className="text-[var(--primary)]">{selectedDate}</span> : <span className="text-[var(--text-muted)]">{placeholder}</span>}
                </span>
                <ChevronDown className={`w-3 h-3 text-[var(--text-muted)] transition-transform duration-300 ${isOpen ? 'rotate-180 text-[var(--primary)]' : ''}`} />
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 bg-[var(--background)] border border-[var(--border-strong)] z-50 shadow-2xl p-6 min-w-[300px] fade-up">
                    <div className="flex justify-between items-center mb-6">
                        <button onClick={handlePrevMonth} className="p-1 hover:text-[var(--primary)] transition-colors text-[var(--text-muted)] focus:outline-none">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-[10px] font-black tracking-widest text-[var(--primary)] uppercase">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </span>
                        <button onClick={handleNextMonth} className="p-1 hover:text-[var(--primary)] transition-colors text-[var(--text-muted)] focus:outline-none">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center mb-2 border-b border-[var(--border-strong)] pb-2">
                        {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map(day => (
                            <div key={day} className="text-[8px] font-black tracking-widest text-[var(--text-muted)] uppercase">{day}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1 pt-2">
                        {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
                            <div key={`empty-${idx}`} className="p-2"></div>
                        ))}
                        {Array.from({ length: daysInMonth }).map((_, idx) => {
                            const day = idx + 1;
                            const currentLoopDateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                            const isSelected = selectedDate === currentLoopDateStr;

                            return (
                                <div
                                    key={day}
                                    onClick={() => handleDateClick(day)}
                                    className={`
                                        cursor-pointer text-center text-[10px] font-bold py-2 transition-colors duration-300
                                        hover:bg-[var(--surface-hover)] hover:text-[var(--primary)]
                                        ${isSelected ? 'bg-[var(--primary)] text-[var(--background)] hover:bg-[var(--primary)] hover:text-[var(--background)]' : 'text-[var(--text-muted)]'}
                                    `}
                                >
                                    {day}
                                </div>
                            );
                        })}
                    </div>

                    {selectedDate && (
                        <div className="mt-4 pt-4 border-t border-[var(--border-strong)] text-center">
                            <button
                                onClick={(e) => { e.stopPropagation(); onChange(''); setIsOpen(false); }}
                                className="text-[8px] font-black tracking-[0.2em] text-[var(--text-muted)] hover:text-red-500 transition-colors uppercase"
                            >
                                CLEAR SELECTION
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CustomDatePicker;
