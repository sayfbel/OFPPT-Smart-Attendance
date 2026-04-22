import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    User, 
    Calendar, 
    AlertTriangle, 
    CheckCircle, 
    FileText, 
    ArrowLeft, 
    Clock, 
    ShieldAlert,
    TrendingDown,
    Award,
    Activity
} from 'lucide-react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const StudentProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({ student: null, absences: [], discipline: [] });

    useEffect(() => {
        const fetchStudentDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get(`/api/admin/students/${id}`, config);
                setData(res.data);
            } catch (error) {
                console.error('Error fetching student details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudentDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const { student, absences, discipline } = data;

    if (!student) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-2xl font-black text-slate-400 uppercase tracking-widest">Stagiaire non trouvé</h2>
                <button onClick={() => navigate(-1)} className="mt-4 text-[var(--primary)] font-bold uppercase tracking-widest text-[10px]">Retour</button>
            </div>
        );
    }

    const totalAbsences = absences.length;
    const justifiedAbsences = absences.filter(a => a.Justifier === 'JUSTIFIÉ').length;
    const unjustifiedAbsences = totalAbsences - justifiedAbsences;

    return (
        <div className={`space-y-8 fade-up max-w-[1400px] mx-auto pb-20 ${isRtl ? 'direction-rtl' : ''}`}>
            {/* Header / Navigation */}
            <div className="flex items-center justify-between mb-10">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-400 hover:text-[var(--secondary)] transition-all group"
                >
                    <ArrowLeft className={`w-4 h-4 group-hover:-translate-x-1 transition-transform ${isRtl ? 'rotate-180' : ''}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Retourner à la liste</span>
                </button>
                <div className="flex items-center gap-4">
                    <span className="px-4 py-2 bg-slate-100 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        ID: {student.NumInscription}
                    </span>
                </div>
            </div>

            {/* Profile Overview Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-3 ista-panel p-10 bg-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 opacity-50 rounded-bl-[200px] transform translate-x-16 -translate-y-16 group-hover:bg-green-50 transition-all duration-700"></div>
                    
                    <div className="flex flex-col md:flex-row items-center gap-10 relative">
                        <div className="w-40 h-40 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-200 group-hover:bg-white group-hover:border-[var(--primary)] transition-all duration-500 shadow-sm group-hover:shadow-xl">
                            <User className="w-20 h-20 text-slate-200 group-hover:text-[var(--primary)] transition-all" />
                        </div>
                        
                        <div className="space-y-4 text-center md:text-left flex-1">
                            <div>
                                <h1 className="text-4xl md:text-6xl font-black italic text-[var(--secondary)] tracking-tighter leading-none uppercase">
                                    {student.name}
                                </h1>
                                <p className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-[0.4em] mt-2">
                                    {student.filiere_name || 'DÉVELOPPEMENT DIGITAL'}
                                </p>
                            </div>
                            
                            <div className="flex flex-wrap gap-4 pt-4">
                                <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Groupe</p>
                                    <p className="text-xs font-black text-[var(--secondary)] uppercase">{student.group_id}</p>
                                </div>
                                <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Email</p>
                                    <p className="text-xs font-black text-[var(--secondary)] lowercase">{student.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Main Content Info */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Absence History Table */}
                <div className="ista-panel p-10 bg-white shadow-xl">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-slate-50 rounded-2xl">
                                <Calendar className="w-6 h-6 text-[var(--secondary)]" />
                            </div>
                            <h3 className="text-xl font-black text-[var(--secondary)] uppercase tracking-tighter italic">Historique des Absences</h3>
                        </div>
                        <div className="px-4 py-2 bg-slate-100 rounded-full text-[9px] font-black text-slate-500">
                            {absences.length} ENTRÉES
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="pb-6 text-[9px] font-black text-slate-300 uppercase tracking-widest">Date & Séance</th>
                                    <th className="pb-6 text-[9px] font-black text-slate-300 uppercase tracking-widest">Statut</th>
                                    <th className="pb-6 text-[9px] font-black text-slate-300 uppercase tracking-widest text-right">Justification</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {absences.length > 0 ? (
                                    absences.map((abs, i) => (
                                        <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-[var(--secondary)] transition-all">
                                                        <Clock className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-[var(--secondary)] uppercase italic tracking-tight">
                                                            {new Date(abs.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                                                        </p>
                                                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                                                            {abs.subject} - {abs.heure || 'Période indéfinie'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-6">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${abs.Justifier === 'JUSTIFIÉ' ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></div>
                                                    <span className={`text-[9px] font-black uppercase tracking-widest ${abs.Justifier === 'JUSTIFIÉ' ? 'text-green-500' : 'text-red-500'}`}>
                                                        {abs.Justifier === 'JUSTIFIÉ' ? 'Justifiée' : 'Absent(e)'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-6 text-right">
                                                {abs.Justifier === 'JUSTIFIÉ' ? (
                                                    <div className="flex flex-col items-end">
                                                        <div className="flex items-center gap-2 text-green-600">
                                                            <CheckCircle className="w-3 h-3" />
                                                            <span className="text-[10px] font-black uppercase italic tracking-tighter">Validée</span>
                                                        </div>
                                                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                                            MOTIF: {abs.justification_reason || 'Certificat Médical'}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-[9px] font-black text-slate-300 uppercase italic tracking-widest">Aucune pièce jointe</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                          <td colSpan="3" className="py-12 text-center text-slate-300 italic text-[10px] font-black uppercase tracking-widest">Aucune absence enregistrée</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Discipline Section */}
                <div className="ista-panel p-10 bg-white shadow-xl relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-50 rounded-2xl">
                                <ShieldAlert className="w-6 h-6 text-red-500" />
                            </div>
                            <h3 className="text-xl font-black text-[var(--secondary)] uppercase tracking-tighter italic">Suivi Disciplinaire</h3>
                        </div>
                    </div>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto ista-scrollbar pr-2">
                        {discipline.length > 0 ? (
                            discipline.map((d, i) => (
                                <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-red-200 transition-all">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-red-500 text-white rounded-lg">
                                                <Award className="w-4 h-4" />
                                            </div>
                                            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">
                                                {d.penalty_type || 'Avertissement'}
                                            </span>
                                        </div>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                            {new Date(d.date).toLocaleDateString('fr-FR')}
                                        </span>
                                    </div>
                                    <p className="text-xs font-bold text-[var(--secondary)] uppercase italic leading-relaxed">
                                        {d.reason || "Non-respect du règlement intérieur de l'établissement."}
                                    </p>
                                    <div className="mt-4 pt-4 border-t border-slate-200/50 flex items-center justify-between">
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic">Signalé par Admin</span>
                                        <button className="text-[var(--primary)] text-[9px] font-black uppercase hover:underline">Détails</button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/50">
                                <Award className="w-12 h-12 text-slate-100 mb-4" />
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Excellence disciplinaire</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .ista-scrollbar::-webkit-scrollbar { width: 4px; }
                .ista-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .ista-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default StudentProfile;
