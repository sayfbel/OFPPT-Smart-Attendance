import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback((message, type = 'info') => {
        const id = Math.random().toString(36).substr(2, 9);
        setNotifications((prev) => [...prev, { id, message, type }]);
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    return (
        <NotificationContext.Provider value={{ addNotification }}>
            {children}
            <div className="fixed bottom-8 right-8 z-[9999] flex flex-col gap-4 pointer-events-none">
                {notifications.map((notif) => (
                    <NotificationCard
                        key={notif.id}
                        notification={notif}
                        onClose={() => removeNotification(notif.id)}
                    />
                ))}
            </div>
        </NotificationContext.Provider>
    );
};

const NotificationCard = ({ notification, onClose }) => {
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, 5000); // Wait 5 seconds before triggering exit, slightly longer for readability
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsLeaving(true);
        setTimeout(() => onClose(), 500); // Wait for the transition out to complete
    };

    const getTypeStyles = () => {
        switch (notification.type) {
            case 'error': return 'border-red-500 text-red-500';
            case 'success': return 'border-green-500 text-green-500';
            default: return 'border-[var(--primary)] text-[var(--primary)]';
        }
    };

    const getIcon = () => {
        switch (notification.type) {
            case 'error': return <AlertTriangle className="w-5 h-5 flex-shrink-0" />;
            case 'success': return <CheckCircle className="w-5 h-5 flex-shrink-0" />;
            default: return <Info className="w-5 h-5 flex-shrink-0" />;
        }
    };

    return (
        <div className={`pointer-events-auto flex items-center gap-4 bg-[var(--background)] border ${getTypeStyles()} p-6 min-w-[320px] max-w-sm shadow-2xl relative overflow-hidden group transition-all duration-500 ${isLeaving ? 'opacity-0 translate-x-12' : 'fade-up'}`}>
            {/* Colored Accent Line */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${notification.type === 'error' ? 'bg-red-500' : notification.type === 'success' ? 'bg-green-500' : 'bg-[var(--primary)]'}`}></div>

            {/* Top-Right and Bottom-Left Decorative Borders */}
            <div className={`absolute top-0 right-0 w-4 h-4 border-t border-r ${getTypeStyles()} opacity-50`}></div>
            <div className={`absolute bottom-0 left-0 w-4 h-4 border-b border-l ${getTypeStyles()} opacity-50`}></div>

            {getIcon()}
            <div className="flex-1">
                <span className="text-[8px] font-black tracking-[0.3em] uppercase opacity-50 block mb-1">
                    {notification.type === 'error' ? 'SYSTEM_WARNING' : notification.type === 'success' ? 'PROTOCOL_SUCCESS' : 'SYSTEM_INFO'}
                </span>
                <p className="text-xs font-black tracking-widest uppercase">{notification.message}</p>
            </div>
            <button onClick={handleClose} className="text-[var(--text-muted)] hover:text-current transition-colors focus:outline-none">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};
