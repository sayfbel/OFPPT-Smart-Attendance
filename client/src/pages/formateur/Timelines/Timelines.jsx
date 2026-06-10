import React, { useState, useEffect } from 'react';
import { Calendar as CalIcon, Clock, Activity, MapPin } from 'lucide-react';
import { useNotification } from '../../../hooks/useNotification';
import { useAuth } from '../../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import attendanceService from '../../../services/attendanceService';
import './Timelines.css';

const Timelines = () => {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';
    const { addNotification } = useNotification();
    const { user } = useAuth();
    const [selectedClass, setSelectedClass] = useState(null);
    const [schedule, setSchedule] = useState([]);
    const [availableClasses, setAvailableClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resData = await attendanceService.getFormateurSchedule();

                setSchedule(resData.schedule || []);
                const classes = resData.classes || [];
                setAvailableClasses(classes);

                if (classes.length > 0) {
                    setSelectedClass(classes[0].id);
                }
            } catch (error) {
                console.error('Error fetching formateur schedule', error);
                addNotification(t('formateur_timetable.error_fetch'), 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [addNotification, t]);

    const days = [
        t('timetable.days.monday'),
        t('timetable.days.tuesday'),
        t('timetable.days.wednesday'),
        t('timetable.days.thursday'),
        t('timetable.days.friday'),
        t('timetable.days.saturday')
    ];

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

        return { start: stCol, span: span };
    };

    const translatedToOriginalDay = (dayName) => {
        const mapping = {
            [t('timetable.days.monday')]: 'LUNDI',
            [t('timetable.days.tuesday')]: 'MARDI',
            [t('timetable.days.wednesday')]: 'MERCREDI',
            [t('timetable.days.thursday')]: 'JEUDI',
            [t('timetable.days.friday')]: 'VENDREDI',
            [t('timetable.days.saturday')]: 'SAMEDI'
        };
        return mapping[dayName];
    };

    const filteredSchedule = schedule.filter(slot => slot.class === selectedClass);

    if (loading) {
        return (
            <div className={`tl-loading-container ${isRtl ? 'rtl' : ''}`}>
                <div className="tl-loading-spinner"></div>
                <span className="tl-loading-text">{t('formateur_timetable.loading')}</span>
            </div>
        );
    }

    return (
        <div className={`tl-container ${isRtl ? 'rtl' : ''}`}>
            <div className={`tl-header ${isRtl ? 'rtl' : ''}`}>
                <div className="tl-title-wrapper">
                    <h1 className="tl-title">
                        {t('timetable.title')}
                    </h1>
                    <p className="tl-subtitle">
                        {t('formateur_timetable.subtitle')}
                    </p>
                </div>
            </div>

            {availableClasses.length === 0 ? (
                <div className="tl-empty-state">
                    <div className="tl-empty-icon-wrapper">
                        <Activity className="tl-empty-icon" />
                    </div>
                    <span className="tl-empty-text">
                        {t('formateur_timetable.no_assignment')}
                    </span>
                    <p className="tl-empty-subtext">
                        {t('formateur_timetable.no_assignment_msg')}
                    </p>
                </div>
            ) : (
                <>
                    <div className={`tl-classes-scroll ista-scrollbar ${isRtl ? 'rtl' : ''}`}>
                        {availableClasses.map((cls, index) => (
                            <div
                                key={index}
                                onClick={() => setSelectedClass(cls.id)}
                                className={`tl-class-card ${selectedClass === cls.id ? 'selected' : ''}`}
                            >
                                <div className={`tl-class-header ${isRtl ? 'rtl' : ''}`}>
                                    <span className="tl-class-badge">{cls.id}</span>
                                    <div className={`tl-class-dot ${selectedClass === cls.id ? 'selected' : ''}`}></div>
                                </div>
                                <h3 className={`tl-class-title ${isRtl ? 'rtl' : ''}`}>{cls.title}</h3>
                                <p className={`tl-class-stream ${isRtl ? 'rtl' : ''}`}>{cls.stream}</p>
                            </div>
                        ))}
                    </div>

                    <div className="tl-grid-container relative">
                        <div className="tl-grid-wrapper ista-scrollbar">
                            {/* Time Headers */}
                            <div className={`tl-time-headers ${isRtl ? 'rtl' : ''}`}>
                                <div className={`tl-days-header ${isRtl ? 'rtl' : ''}`}>
                                    <CalIcon className="tl-cal-icon" />
                                    <span className="tl-days-title">
                                        {t('timetable.days_header')}
                                    </span>
                                </div>
                                {timeSlots.map((time, idx) => (
                                    <div key={idx} className="tl-time-slot-header">
                                        <span className="tl-time-slot-text">
                                            {time}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Timeline Grid */}
                            <div className={`tl-grid-body ${isRtl ? 'rtl' : ''}`}>
                                {days.map((day) => {
                                    const origDay = translatedToOriginalDay(day);
                                    const daySchedule = filteredSchedule.filter(slot => slot.day === origDay);

                                    return (
                                        <div key={day} className={`tl-day-row ${isRtl ? 'rtl' : ''}`}>
                                            {/* Base Line */}
                                            <div className={`tl-day-line ${isRtl ? 'rtl' : ''}`}></div>

                                            {/* Day Name */}
                                            <div className="tl-day-name-wrapper">
                                                <span className={`tl-day-name ${isRtl ? 'rtl' : ''}`}>{day}</span>
                                            </div>

                                            {/* Event Cards */}
                                            {daySchedule.map((slot, index) => {
                                                const gridPos = getGridSpan(slot.time);
                                                return (
                                                    <div 
                                                        key={index} 
                                                        className="tl-event-wrapper"
                                                        style={{ 
                                                            gridColumnStart: gridPos.start,
                                                            gridColumnEnd: `span ${gridPos.span}`
                                                        }}
                                                    >
                                                        <div className="tl-event-card group">
                                                            <div className={`tl-event-bg-shape ${isRtl ? 'rtl' : ''}`}></div>

                                                            <div className={`tl-event-header ${isRtl ? 'rtl' : ''}`}>
                                                                <div className={`tl-event-time ${isRtl ? 'rtl' : ''}`}>
                                                                    <Clock className="tl-event-time-icon" />
                                                                    <span>{slot.time}</span>
                                                                </div>
                                                                <div className={`tl-event-room ${isRtl ? 'rtl' : ''}`}>
                                                                    <MapPin className="tl-event-room-icon" />
                                                                    <span>{slot.room}</span>
                                                                </div>
                                                            </div>

                                                            <h3 className={`tl-event-subject ${isRtl ? 'rtl' : ''}`}>
                                                                {slot.subject}
                                                            </h3>

                                                            <div className={`tl-event-footer ${isRtl ? 'rtl' : ''}`}>
                                                                <div className={`tl-event-status ${isRtl ? 'rtl' : ''}`}>
                                                                    <div className="tl-event-status-dot"></div>
                                                                    <span>{t('formateur_timetable.active_session')}</span>
                                                                </div>
                                                                <span className="tl-event-class-id">{slot.class}</span>
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
