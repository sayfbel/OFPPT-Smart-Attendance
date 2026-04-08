import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { MapPin, Plus, Trash2, Edit2, Search, X, Check, AlertTriangle, ArrowRight, Hash, Activity, Filter, ChevronDown, Layers, Users } from 'lucide-react';

const Salles = () => {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';
    const [salles, setSalles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSalle, setEditingSalle] = useState(null);
    const [formData, setFormData] = useState({ nom: '', groupIds: [] });
    const [isDeleting, setIsDeleting] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [groups, setGroups] = useState([]);
    const [isGroupDropdownOpen, setIsGroupDropdownOpen] = useState(false);

    const fetchSalles = async () => {
        try {
            const token = localStorage.getItem('token');
            const [sallesRes, groupsRes] = await Promise.all([
                axios.get('/api/admin/salles', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('/api/admin/groups', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setSalles(sallesRes.data.salles);
            setGroups(groupsRes.data.groups);
            setLoading(false);
        } catch (err) {
            console.error("FETCH DATA ERROR:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSalles();
    }, []);

    const handleOpenModal = (salle = null) => {
        if (salle) {
            setEditingSalle(salle);
            setFormData({ nom: salle.nom, groupIds: salle.groupIds || [] });
        } else {
            setEditingSalle(null);
            setFormData({ nom: '', groupIds: [] });
        }
        setIsModalOpen(true);
        setIsGroupDropdownOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            if (editingSalle) {
                await axios.put(`/api/admin/salles/${editingSalle.id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post('/api/admin/salles', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            setIsModalOpen(false);
            fetchSalles();
        } catch (err) {
            console.error("SUBMIT SALLE ERROR:", err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/admin/salles/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsDeleting(null);
            fetchSalles();
        } catch (err) {
            console.error("DELETE SALLE ERROR:", err);
        }
    };

    const [flippedCardId, setFlippedCardId] = useState(null);

    const handleFlip = (salle) => {
        if (flippedCardId === salle.id) {
            setFlippedCardId(null);
        } else {
            setFlippedCardId(salle.id);
            setFormData({ nom: salle.nom, groupIds: salle.groupIds || [] });
            setIsGroupDropdownOpen(false);
        }
    };

    const handleUpdate = async (id) => {
        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/admin/salles/${id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFlippedCardId(null);
            fetchSalles();
        } catch (err) {
            console.error("UPDATE SALLE ERROR:", err);
        } finally {
            setSubmitting(false);
        }
    };

    const filteredSalles = salles.filter(s => 
        s.nom.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={`space-y-12 fade-up transition-all duration-500 ${isRtl ? 'text-right' : ''}`}>
            
            {/* Header Section like Groups */}
            <div className={`flex flex-col md:flex-row items-start md:items-end justify-between border-b border-[var(--border)] pb-8 lg:pb-12 gap-6 lg:gap-8 ${isRtl ? 'md:flex-row-reverse' : ''}`}>
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-[var(--secondary)] uppercase italic leading-[0.9]">
                        {t('nav.salles_nav')}
                    </h1>
                    <div className={`flex items-center gap-3 text-[var(--primary)] text-[9px] lg:text-xs tracking-[0.4em] uppercase font-black ${isRtl ? 'flex-row-reverse' : ''}`}>
                        <div className="w-2 h-2 bg-[var(--primary)] rounded-full animate-pulse"></div>
                        {t('salles.subtitle')}
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 justify-end w-full md:w-auto">
                    <div className="relative flex-1 md:min-w-[300px]">
                        <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 ${isRtl ? 'right-4' : 'left-4'}`} />
                        <input
                            type="text"
                            placeholder={t('salles.search_placeholder')}
                            className={`w-full bg-white border border-[var(--border)] rounded-xl py-4 text-[10px] font-black tracking-widest focus:ring-0 focus:border-[var(--primary)] transition-all ${isRtl ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4'}`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button onClick={() => handleOpenModal()} className="btn-ista px-8 py-4 flex items-center gap-3">
                        <Plus className="w-5 h-5" />
                        <span>{t('salles.add_button')}</span>
                    </button>
                </div>
            </div>

            {/* Grid Layout like Groups */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                
                {/* Initialiser Card */}
                <div
                    onClick={() => handleOpenModal()}
                    className="border-2 border-dashed border-slate-200 bg-white rounded-3xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 hover:border-[var(--primary)]/30 transition-all duration-500 group min-h-[300px]"
                >
                    <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center mb-6 group-hover:bg-[var(--primary)] group-hover:border-[var(--primary)] transition-all duration-500">
                        <Plus className="w-8 h-8 text-slate-300 group-hover:text-white transition-all duration-500" />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-[var(--secondary)] mb-2 group-hover:text-[var(--primary)] transition-all">{t('salles.new_room')}</h3>
                    <p className="text-[9px] tracking-[0.2em] text-slate-400 uppercase font-black">{t('salles.register_room')}</p>
                </div>

                {loading ? (
                    Array(5).fill(0).map((_, i) => (
                        <div key={i} className="animate-pulse bg-white rounded-3xl border border-slate-100 p-10 h-[300px]">
                            <div className="w-12 h-12 bg-slate-100 rounded-xl mb-8"></div>
                            <div className="h-8 bg-slate-100 rounded-lg w-3/4 mb-4"></div>
                            <div className="h-4 bg-slate-100 rounded-lg w-1/2"></div>
                        </div>
                    ))
                ) : filteredSalles.length > 0 ? (
                    filteredSalles.map((salle) => (
                        <div key={salle.id} className="perspective-1000 min-h-[300px]">
                            <div className={`card-inner ${flippedCardId === salle.id ? 'card-flipped' : ''}`}>
                                
                                {/* Front Side */}
                                <div className="card-front rounded-3xl border border-[var(--border)] bg-white p-10 shadow-sm hover:shadow-xl hover:border-[var(--primary)]/30 transition-all duration-500 group relative overflow-hidden flex flex-col h-full">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 opacity-50 rounded-bl-[80px] transform translate-x-12 -translate-y-12 group-hover:bg-green-50 transition-all duration-500"></div>

                                    <div className="flex justify-between items-start mb-8 relative">
                                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-500 border border-slate-100 group-hover:border-[var(--primary)]">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleFlip(salle)}
                                                className="p-3 bg-white rounded-xl border border-[var(--border)] hover:border-blue-500 hover:text-blue-600 text-slate-400 transition-all shadow-sm"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setIsDeleting(salle.id)}
                                                className="p-3 bg-white rounded-xl border border-[var(--border)] hover:border-red-500 hover:text-red-500 text-slate-400 transition-all shadow-sm"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Hash className="w-3 h-3 text-[var(--primary)] opacity-40 italic" />
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{salle.id}</span>
                                        </div>
                                        <h2 className="text-3xl md:text-4xl font-black italic text-[var(--secondary)] tracking-tighter leading-tight mb-2 uppercase group-hover:text-[var(--primary)] transition-colors">
                                            {salle.nom}
                                        </h2>
                                        <div className="flex flex-col gap-2 mt-4 px-3 py-1.5 bg-green-50/50 rounded-lg border border-green-100 w-fit">
                                            <div className="flex items-center">
                                                <div className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full mr-2"></div>
                                                <span className="text-[8px] font-black text-[var(--primary)] uppercase tracking-widest">{t('salles.available')}</span>
                                            </div>
                                            {salle.groupIds?.length > 0 && (
                                                <>
                                                    <div className="flex flex-col gap-1 border-t border-green-100 pt-2 mt-1">
                                                        {salle.groupIds.map(gId => (
                                                            <div key={gId} className="flex items-center">
                                                                <Users className="w-2.5 h-2.5 text-amber-500 mr-2" />
                                                                <span className="text-[8px] font-black text-amber-600 uppercase tracking-widest">
                                                                    {gId}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {salle.lead_formateurs && (
                                                        <div className="flex items-center gap-1 mt-1">
                                                            <div className="w-1 h-1 bg-amber-400 rounded-full animate-pulse"></div>
                                                            <span className="text-[7px] font-bold text-slate-400 uppercase italic truncate max-w-[120px]">
                                                                {salle.lead_formateurs}
                                                            </span>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Back Side (Form) */}
                                <div className="card-back rounded-3xl border border-[var(--border)] bg-slate-50 p-10 flex flex-col h-full shadow-2xl overflow-hidden relative">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-[10px] font-black tracking-widest text-[var(--secondary)] uppercase">{t('salles.update_room')}</span>
                                        <button onClick={() => setFlippedCardId(null)} className="p-2 hover:bg-white rounded-lg transition-all text-slate-400 hover:text-[var(--secondary)]">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="space-y-4 flex-1 overflow-y-auto ista-scrollbar pr-1">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black tracking-widest text-slate-400 uppercase">{t('salles.label')}</label>
                                            <input
                                                type="text"
                                                autoFocus
                                                required
                                                className="w-full bg-white border border-[var(--border)] rounded-xl px-4 py-3 text-[10px] font-bold text-[var(--secondary)] focus:ring-4 focus:ring-green-500/10 focus:border-[var(--primary)] outline-none transition-all placeholder:text-slate-200 italic"
                                                placeholder={t('salles.placeholder')}
                                                value={formData.nom}
                                                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-2 relative">
                                            <label className="text-[9px] font-black tracking-widest text-slate-400 uppercase">Groupe assigné</label>
                                            <div
                                                onClick={() => setIsGroupDropdownOpen(!isGroupDropdownOpen)}
                                                className="w-full bg-white border border-[var(--border)] rounded-xl px-4 py-3 flex justify-between items-center cursor-pointer hover:border-[var(--primary)] transition-all"
                                            >
                                                <span className="text-[10px] font-bold text-[var(--secondary)] uppercase">
                                                    {formData.groupIds?.length > 0 ? formData.groupIds.join(', ') : 'NON ASSIGNÉ'}
                                                </span>
                                                <ChevronDown className={`w-3 h-3 text-[var(--primary)] transition-transform ${isGroupDropdownOpen ? 'rotate-180' : ''}`} />
                                            </div>
                                            
                                            {isGroupDropdownOpen && (
                                                <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-2xl z-50 max-h-32 overflow-y-auto ista-scrollbar">
                                                    <div 
                                                        className="px-4 py-2 cursor-pointer hover:bg-slate-50 text-[9px] font-bold text-slate-400 uppercase"
                                                        onClick={() => {
                                                            setFormData({ ...formData, groupIds: [] });
                                                        }}
                                                    >
                                                        DÉSÉLECTIONNER TOUT
                                                    </div>
                                                    {groups.map(g => {
                                                        const isSelected = formData.groupIds?.includes(g.id);
                                                        return (
                                                            <div 
                                                                key={g.id}
                                                                className={`px-4 py-2 cursor-pointer hover:bg-slate-50 text-[9px] font-bold uppercase flex items-center justify-between ${isSelected ? 'text-[var(--primary)] bg-green-50' : 'text-[var(--secondary)]'}`}
                                                                onClick={() => {
                                                                    const currentIds = Array.isArray(formData.groupIds) ? formData.groupIds : [];
                                                                    const nextIds = isSelected 
                                                                        ? currentIds.filter(id => id !== g.id)
                                                                        : [...currentIds, g.id];
                                                                    setFormData({ ...formData, groupIds: nextIds });
                                                                }}
                                                            >
                                                                <span>{g.id}</span>
                                                                {isSelected ? <Check className="w-3 h-3 text-[var(--primary)]" /> : <div className="w-3 h-3 border border-slate-200 rounded" />}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleUpdate(salle.id)}
                                        disabled={submitting}
                                        className="btn-ista w-full py-4 mt-6 flex items-center justify-center gap-3 shadow-lg group"
                                    >
                                        {submitting ? (
                                            <Activity className="w-4 h-4 animate-spin text-white" />
                                        ) : (
                                            <>
                                                <Layers className="w-4 h-4" />
                                                <span>{t('salles.save')}</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">{t('salles.no_rooms')}</p>
                    </div>
                )}
            </div>

            {/* Modal Add/Edit - Dossier Style (Ported from previous turn) */}
            {isModalOpen && ReactDOM.createPortal(
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[10000] flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-[var(--surface)] w-full max-w-2xl rounded-[40px] overflow-hidden shadow-2xl relative flex flex-col animate-in zoom-in-95 duration-300">
                        
                        <div className="p-10 border-b border-[var(--border)] bg-gradient-to-r from-[var(--secondary)] to-[#003d6b] text-white relative">
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 p-3 hover:bg-white/10 rounded-full transition-all text-white/50 hover:text-white z-50">
                                <X className="w-6 h-6" />
                            </button>
                            <div className={`flex items-center gap-5 ${isRtl ? 'flex-row-reverse text-right' : ''}`}>
                                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
                                    <MapPin className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black uppercase italic leading-none mb-2">
                                        {editingSalle ? t('salles.modal_edit') : t('salles.modal_new')}
                                    </h2>
                                    <p className="text-[10px] font-bold text-white/60 tracking-[0.3em] uppercase">
                                        {t('salles.modal_admin')}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-10 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className={`text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                        <MapPin className="w-3 h-3 text-[var(--primary)]" />
                                        {t('salles.modal_label')}
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className={`w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-sm font-black text-[var(--secondary)] italic tracking-tight focus:ring-0 focus:border-[var(--primary)] outline-none transition-all placeholder:text-slate-200 placeholder:italic ${isRtl ? 'text-right' : ''}`}
                                        placeholder={t('salles.modal_placeholder')}
                                        value={formData.nom}
                                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-4 relative">
                                    <label className={`text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                        <Users className="w-3 h-3 text-amber-500" />
                                        Assigner un Groupe
                                    </label>
                                    <div
                                        onClick={() => setIsGroupDropdownOpen(!isGroupDropdownOpen)}
                                        className={`w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 flex justify-between items-center cursor-pointer hover:border-amber-500 transition-all ${isRtl ? 'flex-row-reverse' : ''}`}
                                    >
                                        <span className="text-sm font-black text-[var(--secondary)] uppercase tracking-tight">
                                            {formData.groupIds?.length > 0 ? formData.groupIds.join(', ') : 'NON ASSIGNÉ'}
                                        </span>
                                        <ChevronDown className={`w-5 h-5 text-amber-500 transition-transform ${isGroupDropdownOpen ? 'rotate-180' : ''}`} />
                                    </div>

                                    {isGroupDropdownOpen && (
                                        <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-3xl shadow-2xl z-50 max-h-48 overflow-y-auto ista-scrollbar animate-in fade-in zoom-in-95 duration-200">
                                            <div 
                                                className="px-8 py-4 cursor-pointer hover:bg-slate-50 text-[10px] font-black text-slate-300 uppercase tracking-widest border-b border-slate-50"
                                                onClick={() => {
                                                    setFormData({ ...formData, groupIds: [] });
                                                }}
                                            >
                                                DÉSÉLECTIONNER TOUT
                                            </div>
                                            {groups.map(g => {
                                                const isSelected = formData.groupIds?.includes(g.id);
                                                return (
                                                    <div 
                                                        key={g.id}
                                                        className={`px-8 py-4 cursor-pointer hover:bg-slate-50 text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-between ${isSelected ? 'text-[var(--primary)] bg-green-50' : 'text-[var(--secondary)]'}`}
                                                        onClick={() => {
                                                            const currentIds = Array.isArray(formData.groupIds) ? formData.groupIds : [];
                                                            const nextIds = isSelected 
                                                                ? currentIds.filter(id => id !== g.id)
                                                                : [...currentIds, g.id];
                                                            setFormData({ ...formData, groupIds: nextIds });
                                                        }}
                                                    >
                                                        <span>{g.id}</span>
                                                        {isSelected ? <Check className="w-5 h-5 text-[var(--primary)]" /> : <div className="w-5 h-5 border-2 border-slate-100 rounded-md" />}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className={`w-full py-6 rounded-2xl text-[11px] font-black tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-4 shadow-2xl relative overflow-hidden group ${submitting ? 'bg-slate-100 text-slate-400' : 'btn-ista hover:scale-[1.01] active:scale-[0.98]'}`}
                            >
                                {submitting ? (
                                    <>
                                        <Activity className="w-5 h-5 animate-spin" />
                                        {t('filiere.sync')}
                                    </>
                                ) : (
                                    <>
                                        {editingSalle ? t('salles.modal_update') : t('salles.modal_save')}
                                        <ArrowRight className={`w-5 h-5 group-hover:translate-x-2 transition-transform ${isRtl ? 'rotate-180 group-hover:-translate-x-2' : ''}`} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="p-6 bg-slate-50/50 border-t border-slate-50">
                            <p className="text-center text-[8px] font-black text-slate-300 tracking-[0.5em] uppercase">GESTION DES ESPACES - OFPPT ISTA</p>
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
                        <h2 className="text-2xl font-black italic text-[var(--secondary)] tracking-tight uppercase mb-2">{t('filiere.delete_title')}</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-loose mb-10 px-4">
                            {t('filiere.delete_msg')}
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setIsDeleting(null)}
                                className="flex-1 bg-slate-50 text-slate-400 py-5 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-slate-100 transition-all"
                            >
                                {t('confirm.cancel')}
                            </button>
                            <button
                                onClick={() => handleDelete(isDeleting)}
                                className="flex-1 bg-red-600 text-white py-5 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-red-700 transition-all shadow-xl shadow-red-900/20"
                            >
                                {t('confirm.confirm')}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
 
            <style>{`
                .ista-scrollbar::-webkit-scrollbar { width: 4px; }
                .ista-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .ista-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default Salles;
