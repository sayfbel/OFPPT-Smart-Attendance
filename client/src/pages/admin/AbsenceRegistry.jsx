import React, { useState, useEffect } from 'react';
import {
    ClipboardCheck,
    Search,
    Filter,
    Calendar,
    User,
    CheckCircle2,
    AlertCircle,
    Watch,
    Gavel,
    ChevronDown,
    MoreVertical,
    Clock,
    FileText,
    History
} from 'lucide-react';
import axios from 'axios';
import { useNotification } from '../../context/NotificationContext';
import { useTranslation } from 'react-i18next';
import PenaltyModal from '../../components/PenaltyModal';

const AbsenceRegistry = () => {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';
    const { addNotification } = useNotification();
    const [registry, setRegistry] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isPenaltyModalOpen, setIsPenaltyModalOpen] = useState(false);
    const [penaltyData, setPenaltyData] = useState({
        penalty: 'Blâme 1',
        reason: ''
    });

    const fetchRegistry = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/admin/absence-registry', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRegistry(res.data.registry || []);
        } catch (err) {
            console.error("FETCH REGISTRY ERROR:", err);
            addNotification("Erreur lors de la récupération du registre", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRegistry();
    }, []);

    const handleJustify = async (recordId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/admin/justify-absence', { recordId, justified: true }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRegistry(prev => prev.filter(r => r.record_id !== recordId));
            addNotification("Absence justifiée avec succès", "success");
        } catch (err) {
            addNotification("Erreur lors de la justification", "error");
        }
    };

    const handleAddPenalty = async (data) => {
        try {
            const token = localStorage.getItem('token');
            setLoading(true);
            await axios.post('/api/admin/discipline', {
                stagiaireId: selectedStudent.student_id,
                penalty: data.penalty,
                reason: data.reason
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsPenaltyModalOpen(false);
            addNotification("Sanction attribuée avec succès", "success");
        } catch (err) {
            addNotification("Erreur lors de l'attribution de la sanction", "error");
        } finally {
            setLoading(false);
        }
    };

    const filteredRegistry = registry.filter(item => {
        const matchesSearch = item.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.student_id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'ALL' || item.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const statusBadge = (status) => {
        switch(status) {
            case 'ABSENT': return <span className="px-3 py-1 bg-red-50 text-red-500 text-[9px] font-black rounded-full border border-red-100 uppercase tracking-widest">ABSENCE</span>;
            case 'LATE': return <span className="px-3 py-1 bg-amber-50 text-amber-500 text-[9px] font-black rounded-full border border-amber-100 uppercase tracking-widest">RETARD</span>;
            default: return null;
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-[50vh] animate-pulse uppercase tracking-[0.5em] font-black italic text-slate-400">Synchronisation du Registre...</div>;
    }

    return (
        <div className="space-y-12 fade-up max-w-[1600px] mx-auto">
            {/* Header section */}
            <div className={`flex flex-col md:flex-row md:items-center justify-between gap-8 transition-all duration-500 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <div className="space-y-2">
                    <h1 className={`text-5xl md:text-[64px] font-black tracking-tighter text-[var(--secondary)] uppercase italic leading-none ${isRtl ? 'text-right' : ''}`}>
                        REGISTRE <span className="text-[var(--primary)] shrink-0">D'ABSENCES</span>
                    </h1>
                    <p className={`text-[10px] text-slate-400 font-bold tracking-[0.3em] uppercase ${isRtl ? 'text-right' : ''}`}>
                        GESTION DISCIPLINAIRE ET JUSTIFICATIONS
                    </p>
                </div>

                <div className={`flex items-center gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <div className="flex items-center bg-white border border-slate-200 rounded-2xl px-5 py-3 hover:border-slate-300 transition-all shadow-sm">
                        <Search className="w-4 h-4 text-slate-400 mr-3" />
                        <input
                            type="text"
                            placeholder="RECHERCHER..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none text-[10px] font-bold tracking-widest focus:ring-0 text-[var(--secondary)] placeholder-slate-300 p-0 uppercase"
                        />
                    </div>

                    <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-white border border-slate-200 rounded-2xl px-6 py-4 text-[10px] font-black tracking-widest text-[var(--secondary)] uppercase outline-none focus:border-[var(--primary)] shadow-sm cursor-pointer"
                    >
                        <option value="ALL">TOUS LES ÉTATS</option>
                        <option value="ABSENT">ABSENCES</option>
                        <option value="LATE">RETARDS</option>
                    </select>
                </div>
            </div>

            {/* Registry Table */}
            <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm">
                <div className="overflow-x-auto ista-scrollbar">
                    <table className={`w-full text-left border-collapse ${isRtl ? 'text-right' : ''}`}>
                        <thead>
                            <tr className="border-b border-slate-50 bg-slate-50/30">
                                <th className="p-8 text-[9px] font-black text-slate-300 uppercase tracking-widest">STAGIAIRE</th>
                                <th className="p-8 text-[9px] font-black text-slate-300 uppercase tracking-widest text-center">SESSION / DATE</th>
                                <th className="p-8 text-[9px] font-black text-slate-300 uppercase tracking-widest text-center">ÉTAT</th>
                                <th className="p-8 text-[9px] font-black text-slate-300 uppercase tracking-widest text-center">SIGNALÉ PAR</th>
                                <th className={`p-8 text-[9px] font-black text-slate-300 uppercase tracking-widest ${isRtl ? 'text-left' : 'text-right'}`}>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredRegistry.map((item) => (
                                <tr key={item.record_id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="p-8">
                                        <div className={`flex items-center gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                            <div className="w-12 h-12 bg-[var(--primary)]/10 text-[var(--primary)] rounded-xl flex items-center justify-center text-[11px] font-black italic">
                                                {item.student_name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black italic text-[var(--secondary)] uppercase tracking-tight">{item.student_name}</span>
                                                <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">ID: {item.student_id} / GROUP: {item.class_id}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8 text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="text-xs font-black text-[var(--secondary)] uppercase italic">{item.subject}</span>
                                            <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 tracking-widest">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(item.session_date).toLocaleDateString('fr-FR')} 
                                                <span className="mx-1">•</span>
                                                <Clock className="w-3 h-3" />
                                                {item.session_time}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8 text-center">
                                        {statusBadge(item.status)}
                                    </td>
                                    <td className="p-8 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className="text-[10px] font-black text-[var(--secondary)] uppercase italic leading-none">{item.formateur_name}</span>
                                            <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest mt-1">FORMATEUR</span>
                                        </div>
                                    </td>
                                    <td className={`p-8 ${isRtl ? 'text-left' : 'text-right'}`}>
                                        <div className={`flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity ${isRtl ? 'flex-row-reverse' : ''}`}>
                                            <button 
                                                onClick={() => handleJustify(item.record_id)}
                                                className="px-4 py-2 bg-green-50 text-[var(--primary)] border border-green-100 rounded-xl text-[9px] font-black tracking-widest uppercase hover:bg-[var(--primary)] hover:text-white transition-all shadow-sm"
                                            >
                                                JUSTIFIER
                                            </button>
                                            <button 
                                                onClick={() => { setSelectedStudent(item); setIsPenaltyModalOpen(true); }}
                                                className="px-4 py-2 bg-red-50 text-red-500 border border-red-100 rounded-xl text-[9px] font-black tracking-widest uppercase hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                            >
                                                SANCTIONNER
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <PenaltyModal
                isOpen={isPenaltyModalOpen}
                onClose={() => setIsPenaltyModalOpen(false)}
                student={selectedStudent}
                onConfirm={handleAddPenalty}
                submitting={loading && isPenaltyModalOpen}
            />
            
            <style>{`.ista-scrollbar::-webkit-scrollbar { width: 4px; } .ista-scrollbar::-webkit-scrollbar-track { background: transparent; } .ista-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }`}</style>
        </div>
    );
};

export default AbsenceRegistry;
