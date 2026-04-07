import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Layers, Plus, Trash2, Edit2, Search, X, Check, AlertTriangle, ArrowRight, Hash, Activity, Filter, ChevronDown } from 'lucide-react';

const Filiere = () => {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';
    const [filieres, setFilieres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFiliere, setEditingFiliere] = useState(null);
    const [formData, setFormData] = useState({ nom: '' });
    const [isDeleting, setIsDeleting] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const fetchFilieres = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/admin/filieres', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFilieres(res.data.filieres);
            setLoading(false);
        } catch (err) {
            console.error("FETCH FILIERES ERROR:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFilieres();
    }, []);

    const handleOpenModal = (filiere = null) => {
        if (filiere) {
            setEditingFiliere(filiere);
            setFormData({ nom: filiere.nom });
        } else {
            setEditingFiliere(null);
            setFormData({ nom: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            if (editingFiliere) {
                await axios.put(`/api/admin/filieres/${editingFiliere.id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post('/api/admin/filieres', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            setIsModalOpen(false);
            fetchFilieres();
        } catch (err) {
            console.error("SUBMIT FILIERE ERROR:", err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/admin/filieres/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsDeleting(null);
            fetchFilieres();
        } catch (err) {
            console.error("DELETE FILIERE ERROR:", err);
        }
    };

    const [flippedCardId, setFlippedCardId] = useState(null);

    const handleFlip = (filiere) => {
        if (flippedCardId === filiere.id) {
            setFlippedCardId(null);
        } else {
            setFlippedCardId(filiere.id);
            setFormData({ nom: filiere.nom });
        }
    };

    const handleUpdate = async (id) => {
        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/admin/filieres/${id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFlippedCardId(null);
            fetchFilieres();
        } catch (err) {
            console.error("UPDATE FILIERE ERROR:", err);
        } finally {
            setSubmitting(false);
        }
    };

    const filteredFilieres = filieres.filter(f => 
        f.nom.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={`space-y-12 fade-up transition-all duration-500 ${isRtl ? 'text-right' : ''}`}>
            
             {/* Header Section like Groups */}
             <div className={`flex flex-col md:flex-row items-start md:items-end justify-between border-b border-[var(--border)] pb-8 lg:pb-12 gap-6 lg:gap-8 ${isRtl ? 'md:flex-row-reverse' : ''}`}>
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-[var(--secondary)] uppercase italic leading-[0.9]">
                        {t('nav.filieres_nav')}
                    </h1>
                    <div className={`flex items-center gap-3 text-[var(--primary)] text-[9px] lg:text-xs tracking-[0.4em] uppercase font-black ${isRtl ? 'flex-row-reverse' : ''}`}>
                        <div className="w-2 h-2 bg-[var(--primary)] rounded-full animate-pulse"></div>
                        ADMINISTRATION DU RÉFÉRENTIEL DES SPÉCIALITÉS ISTA
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 justify-end w-full md:w-auto">
                    <div className="relative flex-1 md:min-w-[350px]">
                        <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 ${isRtl ? 'right-4' : 'left-4'}`} />
                        <input
                            type="text"
                            placeholder="RECHERCHER UNE SPÉCIALITÉ..."
                            className={`w-full bg-white border border-[var(--border)] rounded-xl py-4 text-[10px] font-black tracking-widest focus:ring-0 focus:border-[var(--primary)] transition-all ${isRtl ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4'}`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button onClick={() => handleOpenModal()} className="btn-ista px-8 py-4 flex items-center gap-3">
                        <Plus className="w-5 h-5" />
                        <span>AJOUTER UNE FILIÈRE</span>
                    </button>
                </div>
            </div>

            {/* Grid Layout like Groups */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                
                {/* Initialiser Card */}
                <div
                    onClick={() => handleOpenModal()}
                    className="border-2 border-dashed border-slate-200 bg-white rounded-3xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 hover:border-[var(--primary)]/30 transition-all duration-500 group min-h-[320px]"
                >
                    <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center mb-6 group-hover:bg-[var(--primary)] group-hover:border-[var(--primary)] transition-all duration-500">
                        <Plus className="w-8 h-8 text-slate-300 group-hover:text-white transition-all duration-500" />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-[var(--secondary)] mb-2 group-hover:text-[var(--primary)] transition-all">Nouvelle Unité</h3>
                    <p className="text-[9px] tracking-[0.2em] text-slate-400 uppercase font-black">Enregistrer une spécialité</p>
                </div>

                {loading ? (
                    Array(5).fill(0).map((_, i) => (
                        <div key={i} className="animate-pulse bg-white rounded-3xl border border-slate-100 p-10 h-[320px]">
                            <div className="w-12 h-12 bg-slate-100 rounded-xl mb-8"></div>
                            <div className="h-10 bg-slate-100 rounded-lg w-3/4 mb-4"></div>
                            <div className="h-4 bg-slate-100 rounded-lg w-1/2"></div>
                        </div>
                    ))
                ) : filteredFilieres.length > 0 ? (
                    filteredFilieres.map((filiere) => (
                        <div key={filiere.id} className="perspective-1000 min-h-[320px]">
                            <div className={`card-inner ${flippedCardId === filiere.id ? 'card-flipped' : ''}`}>
                                
                                {/* Front Side */}
                                <div className="card-front rounded-3xl border border-[var(--border)] bg-white p-10 shadow-sm hover:shadow-xl hover:border-[var(--primary)]/30 transition-all duration-500 group relative overflow-hidden flex flex-col h-full">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 opacity-50 rounded-bl-[80px] transform translate-x-12 -translate-y-12 group-hover:bg-green-50 transition-all duration-500"></div>

                                    <div className="flex justify-between items-start mb-8 relative">
                                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-500 border border-slate-100 group-hover:border-[var(--primary)]">
                                            <Layers className="w-5 h-5" />
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleFlip(filiere)}
                                                className="p-3 bg-white rounded-xl border border-[var(--border)] hover:border-blue-500 hover:text-blue-600 text-slate-400 transition-all shadow-sm"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setIsDeleting(filiere.id)}
                                                className="p-3 bg-white rounded-xl border border-[var(--border)] hover:border-red-500 hover:text-red-500 text-slate-400 transition-all shadow-sm"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex-1 flex flex-col justify-end">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Hash className="w-3 h-3 text-[var(--primary)] opacity-40 italic" />
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{filiere.id}</span>
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-black italic text-[var(--secondary)] tracking-tighter leading-none mb-6 uppercase group-hover:text-[var(--primary)] transition-colors line-clamp-2">
                                            {filiere.nom}
                                        </h2>
                                        <div className="flex items-center gap-3 px-4 py-2 bg-slate-50/50 rounded-xl border border-slate-100 w-fit">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/20"></div>
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Formation Active</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Back Side (Form) */}
                                <div className="card-back rounded-3xl border border-[var(--border)] bg-slate-50 p-10 flex flex-col h-full shadow-2xl overflow-hidden relative">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-[10px] font-black tracking-widest text-[var(--secondary)] uppercase">Mise à jour du Réf.</span>
                                        <button onClick={() => setFlippedCardId(null)} className="p-2 hover:bg-white rounded-lg transition-all text-slate-400 hover:text-[var(--secondary)]">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="space-y-4 flex-1">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black tracking-widest text-slate-400 uppercase">Intitulé Filière</label>
                                            <textarea
                                                autoFocus
                                                required
                                                rows={3}
                                                className="w-full bg-white border border-[var(--border)] rounded-xl px-4 py-3 text-[10px] font-bold text-[var(--secondary)] focus:ring-4 focus:ring-green-500/10 focus:border-[var(--primary)] outline-none transition-all placeholder:text-slate-200 italic ista-scrollbar resize-none"
                                                placeholder="Saisissez le nouvel intitulé..."
                                                value={formData.nom}
                                                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleUpdate(filiere.id)}
                                        disabled={submitting}
                                        className="btn-ista w-full py-4 mt-6 flex items-center justify-center gap-3 shadow-lg group"
                                    >
                                        {submitting ? (
                                            <Activity className="w-4 h-4 animate-spin text-white" />
                                        ) : (
                                            <>
                                                <Layers className="w-4 h-4" />
                                                <span>ENREGISTRER</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-24 text-center">
                        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-dashed border-slate-200">
                             <Layers className="w-8 h-8 text-slate-200" />
                        </div>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">AUCUN RÉFÉRENTIEL IDENTIFIÉ</p>
                    </div>
                )}
            </div>

            {/* Modal Edit/Add - Dossier Style */}
            {isModalOpen && ReactDOM.createPortal(
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[10000] flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-[var(--surface)] w-full max-w-2xl rounded-[40px] overflow-hidden shadow-2xl relative flex flex-col animate-in zoom-in-95 duration-300">
                        
                        <div className={`p-10 border-b border-[var(--border)] bg-gradient-to-r from-[var(--secondary)] to-[#003d6b] text-white relative ${isRtl ? 'flex-row-reverse text-right' : ''}`}>
                            <button onClick={() => setIsModalOpen(false)} className={`absolute top-8 p-3 hover:bg-white/10 rounded-full transition-all text-white/50 hover:text-white ${isRtl ? 'left-8' : 'right-8'}`}>
                                <X className="w-6 h-6" />
                            </button>
                            <div className={`flex items-center gap-5 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
                                    <Layers className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black uppercase italic leading-none mb-2">
                                        {editingFiliere ? 'Édition Filière' : 'Nouvelle Filière'}
                                    </h2>
                                    <p className="text-[10px] font-bold text-white/60 tracking-[0.3em] uppercase">
                                        ADMINISTRATION DU RÉFÉRENTIEL
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-10 space-y-8">
                            <div className="space-y-4">
                                <label className={`text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                    <Layers className="w-3 h-3 text-[var(--primary)]" />
                                    INTITULÉ OFFICIEL DE LA FILIÈRE
                                </label>
                                <input
                                    type="text"
                                    required
                                    className={`w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-sm font-black text-[var(--secondary)] italic tracking-tight focus:ring-0 focus:border-[var(--primary)] outline-none transition-all placeholder:text-slate-200 placeholder:italic ${isRtl ? 'text-right' : ''}`}
                                    placeholder="Saissisez le nom de la filière..."
                                    value={formData.nom}
                                    onChange={(e) => setFormData({ nom: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className={`w-full py-6 rounded-2xl text-[11px] font-black tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-4 shadow-2xl relative overflow-hidden group ${submitting ? 'bg-slate-100 text-slate-400' : 'btn-ista hover:scale-[1.01] active:scale-[0.98]'}`}
                            >
                                {submitting ? (
                                    <>
                                        <Activity className="w-5 h-5 animate-spin" />
                                        SYNCHRONISATION...
                                    </>
                                ) : (
                                    <>
                                        {editingFiliere ? 'METTRE À JOUR LE RÉFÉRENTIEL' : 'ENREGISTRER LA FILIÈRE'}
                                        <ArrowRight className={`w-5 h-5 group-hover:translate-x-2 transition-transform ${isRtl ? 'rotate-180 group-hover:-translate-x-2' : ''}`} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="p-6 bg-slate-50/50 border-t border-slate-50">
                            <p className="text-center text-[8px] font-black text-slate-300 tracking-[0.5em] uppercase">SYSTEME DE RÉFÉRENTIEL - OFPPT ISTA</p>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Confirm Delete - Dossier Style */}
            {isDeleting && ReactDOM.createPortal(
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[10000] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[40px] p-10 text-center shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="w-20 h-20 bg-red-50 text-red-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                            <AlertTriangle className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-black italic text-[var(--secondary)] tracking-tight uppercase mb-2">Supression Critique</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-loose mb-10 px-4">
                            Cette action purgera définitivement la filière du référentiel. Les groupes associés perdront leur affiliation.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setIsDeleting(null)}
                                className="flex-1 bg-slate-50 text-slate-400 py-5 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-slate-100 transition-all"
                            >
                                ANNULER
                            </button>
                            <button
                                onClick={() => handleDelete(isDeleting)}
                                className="flex-1 bg-red-600 text-white py-5 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-red-700 transition-all shadow-xl shadow-red-900/20"
                            >
                                CONFIRMER
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default Filiere;
