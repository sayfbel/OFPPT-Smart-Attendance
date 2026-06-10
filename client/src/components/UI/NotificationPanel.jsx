import React from 'react';
import { X, Bell, User, Calendar, MessageSquare, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './NotificationPanel.css';

const NotificationPanel = ({ isOpen, onClose, notifications = [], onMarkRead, onMarkAllRead }) => {
    const { t } = useTranslation();
    if (!isOpen) return null;

    const getIcon = (type) => {
        switch (type) {
            case 'request': return <Calendar className="icon-amber" />;
            case 'message': return <MessageSquare className="icon-blue" />;
            case 'success': return <CheckCircle className="icon-emerald" />;
            case 'alert': return <AlertCircle className="icon-rose" />;
            default: return <Bell className="icon-slate" />;
        }
    };

    return (
        <div className="notif-panel-container">
            {/* Header */}
            <div className="notif-header">
                <div>
                    <h3 className="notif-title">{t('notifications.title')}</h3>
                    <p className="notif-subtitle">{t('notifications.subtitle')}</p>
                </div>
                <button onClick={onMarkAllRead} className="notif-mark-read-btn">
                    {t('notifications.mark_all_read')}
                </button>
            </div>

            {/* List */}
            <div className="notif-list ista-scrollbar">
                {notifications.length === 0 ? (
                    <div className="notif-empty">
                        <div className="notif-empty-icon-wrap">
                            <Bell className="notif-empty-icon" />
                        </div>
                        <span className="notif-empty-text">{t('notifications.no_notifications')}</span>
                    </div>
                ) : (
                    <div className="notif-items">
                        {notifications.map((notif) => (
                            <div
                                key={notif.id}
                                onClick={() => onMarkRead(notif.id)}
                                className={`notif-item ${notif.read ? 'notif-item-read' : 'notif-item-unread'}`}
                            >
                                <div className="notif-item-icon-wrap">
                                    {getIcon(notif.type)}
                                </div>
                                <div className="notif-item-content">
                                    <div className="notif-item-header">
                                        <span className="notif-item-category">{notif.category}</span>
                                        <div className="notif-item-time">
                                            <Clock className="notif-clock-icon" />
                                            {notif.time}
                                        </div>
                                    </div>
                                    <h4 className="notif-item-title" title={notif.title}>{notif.title}</h4>
                                    <p className="notif-item-message">{notif.message}</p>

                                    {!notif.read && (
                                        <div className="notif-item-dot-wrap">
                                            <div className="notif-item-dot"></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="notif-footer">
                <button onClick={onClose} className="notif-close-btn">
                    {t('notifications.close')}
                </button>
            </div>
        </div>
    );
};

export default NotificationPanel;
