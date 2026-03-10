import React from 'react';
import { X, Bell, User, Calendar, MessageSquare, CheckCircle, AlertCircle, Clock } from 'lucide-react';

const NotificationPanel = ({ isOpen, onClose, notifications = [], onMarkRead, onMarkAllRead }) => {
    if (!isOpen) return null;

    const getIcon = (type) => {
        switch (type) {
            case 'request': return <Calendar className="w-4 h-4 text-amber-500" />;
            case 'message': return <MessageSquare className="w-4 h-4 text-blue-500" />;
            case 'success': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
            case 'alert': return <AlertCircle className="w-4 h-4 text-rose-500" />;
            default: return <Bell className="w-4 h-4 text-slate-400" />;
        }
    };

    return (
        <div className="absolute top-full right-0 mt-4 w-[380px] bg-white rounded-[32px] border border-slate-100 shadow-2xl z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
            {/* Header */}
            <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-black italic text-[var(--secondary)] uppercase tracking-tight">Notifications</h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Mises à jour et alertes en direct</p>
                </div>
                <button
                    onClick={onMarkAllRead}
                    className="text-[9px] font-black text-[var(--primary)] hover:text-[var(--primary-dark)] uppercase tracking-widest transition-colors"
                >
                    Tout marquer lu
                </button>
            </div>

            {/* List */}
            <div className="max-h-[450px] overflow-y-auto ista-scrollbar p-2">
                {notifications.length === 0 ? (
                    <div className="py-16 flex flex-col items-center justify-center text-center opacity-40">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <Bell className="w-8 h-8 text-slate-200" />
                        </div>
                        <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">Aucune notification</span>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {notifications.map((notif) => (
                            <div
                                key={notif.id}
                                onClick={() => onMarkRead(notif.id)}
                                className={`p-4 rounded-2xl transition-all cursor-pointer group flex gap-4 ${notif.read ? 'opacity-60 grayscale-[0.5]' : 'bg-slate-50/50 hover:bg-slate-100'}`}
                            >
                                <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm ${notif.read ? 'bg-white' : 'bg-white group-hover:scale-110 transition-transform'}`}>
                                    {getIcon(notif.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[9px] font-black text-[var(--primary)] uppercase tracking-widest">{notif.category}</span>
                                        <div className="flex items-center gap-1.5 text-slate-300 font-bold text-[8px] uppercase">
                                            <Clock className="w-2.5 h-2.5" />
                                            {notif.time}
                                        </div>
                                    </div>
                                    <h4 className="text-[11px] font-black italic text-[var(--secondary)] uppercase leading-tight truncate">{notif.title}</h4>
                                    <p className="text-[10px] text-slate-400 font-bold mt-1 line-clamp-2 leading-relaxed">{notif.message}</p>

                                    {!notif.read && (
                                        <div className="flex items-center justify-end mt-2">
                                            <div className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full animate-pulse"></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-50 bg-slate-50/30">
                <button
                    onClick={onClose}
                    className="w-full py-3 text-[9px] font-black text-slate-400 hover:text-[var(--secondary)] uppercase tracking-[0.3em] transition-all text-center"
                >
                    FERMER LE PANNEAU
                </button>
            </div>
        </div>
    );
};

export default NotificationPanel;
