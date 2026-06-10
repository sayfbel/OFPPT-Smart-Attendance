import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CustomDatePicker = ({ selectedDate, onChange, placeholder }) => {
    const { t } = useTranslation();
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

    const monthNames = t('datepicker.months', { returnObjects: true });
    const dayAbbreviations = t('datepicker.days', { returnObjects: true });

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
                className={`flex items-center gap-2.5 bg-white border border-slate-100 rounded-lg px-4 py-2 cursor-pointer hover:border-[var(--primary)] hover:shadow-sm transition-all group min-w-[180px] ${isOpen ? 'ring-2 ring-[var(--primary)]/5 border-[var(--primary)]' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <CalendarIcon className={`w-3 h-3 transition-colors duration-300 ${selectedDate || isOpen ? 'text-[var(--primary)]' : 'text-slate-300'}`} />
                <span className="text-[9px] tracking-[0.15em] uppercase flex-1 font-black truncate">
                    {selectedDate ? (
                        <span className="text-[var(--secondary)]">{selectedDate}</span>
                    ) : (
                        <span className="text-slate-300">{placeholder || t('datepicker.placeholder')}</span>
                    )}
                </span>
                <ChevronDown className={`w-2.5 h-2.5 text-slate-300 transition-transform duration-500 ${isOpen ? 'rotate-180 text-[var(--primary)]' : ''}`} />
            </div>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white border border-slate-100 z-50 shadow-[0_15px_40px_rgba(0,0,0,0.08)] rounded-[20px] p-5 min-w-[260px] animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center mb-6">
                        <button onClick={handlePrevMonth} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-50 transition-colors text-slate-400 focus:outline-none">
                            <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[10px] font-black tracking-[0.15em] text-[var(--secondary)] uppercase">
                            {monthNames[currentDate.getMonth()]} <span className="text-[var(--primary)]">{currentDate.getFullYear()}</span>
                        </span>
                        <button onClick={handleNextMonth} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-50 transition-colors text-slate-400 focus:outline-none">
                            <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center mb-3">
                        {dayAbbreviations.map(day => (
                            <div key={day} className="text-[7px] font-black tracking-widest text-slate-300 uppercase">{day}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-0.5">
                        {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
                            <div key={`empty-${idx}`} className="p-1"></div>
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
                                        cursor-pointer text-center text-[9px] font-bold h-7 w-7 flex items-center justify-center rounded-lg transition-all duration-300
                                        ${isSelected 
                                            ? 'bg-[var(--primary)] text-white shadow-md shadow-green-500/10' 
                                            : 'text-slate-400 hover:bg-slate-50 hover:text-[var(--primary)]'}
                                    `}
                                >
                                    {day}
                                </div>
                            );
                        })}
                    </div>

                    {selectedDate && (
                        <div className="mt-4 pt-4 border-t border-slate-50 text-center">
                            <button
                                onClick={(e) => { e.stopPropagation(); onChange(''); setIsOpen(false); }}
                                className="text-[7px] font-black tracking-[0.3em] text-slate-300 hover:text-red-500 transition-colors uppercase"
                            >
                                {t('datepicker.clear')}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CustomDatePicker;
