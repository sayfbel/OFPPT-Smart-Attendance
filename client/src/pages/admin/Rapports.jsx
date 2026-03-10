import React, { useState, useEffect } from 'react';
import { Search, Filter, FileText, Download, Calendar, AlertTriangle, ChevronDown, CheckSquare, Square, X } from 'lucide-react';
import axios from 'axios';
import CustomDatePicker from '../../components/CustomDatePicker';
import RapportModal from '../../components/RapportModal';

const Rapports = () => {
    const [selectedDate, setSelectedDate] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [availableClasses, setAvailableClasses] = useState([]);
    const [classFilter, setClassFilter] = useState('ALL');
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
    const [selectedRecords, setSelectedRecords] = useState([]);
    const [selectedRapport, setSelectedRapport] = useState(null);
    const [isExporting, setIsExporting] = useState(false);
    const [allReports, setAllReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get('/api/admin/schedule', config);
                setAvailableClasses(res.data.classes || []);
            } catch (error) {
                console.error('Error fetching classes', error);
            }
        };
        fetchClasses();

        const fetchReports = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get('/api/admin/reports', config);
                const mappedReports = (res.data.reports || []).map(r => ({
                    ...r,
                    id: r.report_code,
                    db_id: r.id,
                    formateur: r.formateur_name
                }));
                setAllReports(mappedReports);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching reports', error);
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    const displayedAbsences = allReports.filter(record => {
        const matchesDate = !selectedDate || record.date === selectedDate;
        const matchesClass = classFilter === 'ALL' || record.class_id === classFilter;
        const matchesSearch = !searchQuery ||
            (record.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                record.studentId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                record.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                record.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                record.formateur?.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesDate && matchesSearch && matchesClass;
    });

    const toggleSelectAll = () => {
        if (selectedRecords.length === displayedAbsences.length && displayedAbsences.length > 0) {
            setSelectedRecords([]);
        } else {
            setSelectedRecords(displayedAbsences.map(r => r.id));
        }
    };

    const toggleSelectRecord = (id) => {
        if (selectedRecords.includes(id)) {
            setSelectedRecords(selectedRecords.filter(rId => rId !== id));
        } else {
            setSelectedRecords([...selectedRecords, id]);
        }
    };

    const handleExportData = () => {
        if (selectedRecords.length === 0) return;
        setIsExporting(true);
        if (!window.html2pdf) {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
            script.onload = () => {
                executeExport();
            };
            document.body.appendChild(script);
        } else {
            executeExport();
        }
    };

    const executeExport = async () => {
        for (const recordId of selectedRecords) {
            const element = document.getElementById(`pdf-export-${recordId}`);
            if (element) {
                element.style.display = 'flex';
                const opt = {
                    margin: 0,
                    filename: `Rapport_ISTA_${recordId}.pdf`,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 1.5, useCORS: true, backgroundColor: '#ffffff' },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
                };
                await window.html2pdf().set(opt).from(element).save();
                element.style.display = 'none';
            }
        }
        setIsExporting(false);
        setSelectedRecords([]);
    };

    return (
        <div className="space-y-12 fade-up transition-all duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between border-b border-slate-100 pb-8 lg:pb-12 gap-6 lg:gap-8">
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-[var(--secondary)] uppercase italic leading-[0.9]">Rapports</h1>
                    <p className="text-[var(--text-muted)] text-[10px] lg:text-xs tracking-[0.4em] uppercase font-black">Gestion des Présences et Statistiques</p>
                </div>
                <div className="flex flex-wrap gap-4 justify-end">
                    <div className="relative">
                        <button
                            onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                            className="bg-white border border-[var(--border)] px-6 py-4 rounded-xl flex items-center gap-4 hover:border-[var(--primary)] transition-all shadow-sm"
                        >
                            <Filter className="w-4 h-4 text-[var(--primary)]" />
                            <span className="text-[10px] font-black tracking-widest uppercase text-[var(--secondary)]">
                                {classFilter === 'ALL' ? 'TOUS LES GROUPES' : classFilter}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-[var(--primary)] transition-transform ${isFilterDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isFilterDropdownOpen && (
                            <div className="absolute top-full left-0 mt-3 bg-white border border-[var(--border)] rounded-2xl z-50 shadow-2xl min-w-[240px] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                <div
                                    className={`px-6 py-4 cursor-pointer text-[10px] font-black tracking-widest uppercase transition-colors ${classFilter === 'ALL' ? 'bg-[var(--primary)] text-white' : 'text-[var(--secondary)] hover:bg-slate-50'}`}
                                    onClick={() => { setClassFilter('ALL'); setIsFilterDropdownOpen(false); }}
                                >
                                    TOUS LES GROUPES
                                </div>
                                {availableClasses.map(cls => (
                                    <div
                                        key={cls.id}
                                        className={`px-6 py-4 cursor-pointer text-[10px] font-black tracking-widest uppercase transition-colors ${classFilter === cls.id ? 'bg-[var(--primary)] text-white' : 'text-[var(--secondary)] hover:bg-slate-50'}`}
                                        onClick={() => {
                                            setClassFilter(cls.id);
                                            setIsFilterDropdownOpen(false);
                                        }}
                                    >
                                        {cls.id}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleExportData}
                        disabled={isExporting || selectedRecords.length === 0}
                        className={`btn-ista px-8 py-4 flex items-center gap-3 transition-all ${selectedRecords.length === 0 ? 'opacity-50 cursor-not-allowed scale-95 shadow-none' : 'shadow-lg hover:scale-[1.02] active:scale-[0.98]'}`}
                    >
                        <Download className={`w-5 h-5 ${isExporting ? 'animate-bounce' : ''}`} />
                        <span>{isExporting ? 'EXPORTATION...' : 'EXPORTER'}</span>
                    </button>
                </div>
            </div>

            {/* Filters bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-6 w-full md:w-auto">
                    <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-400">Liste des Rapports</h3>
                    <div className="h-4 w-px bg-slate-100 hidden md:block"></div>
                    <div className="flex items-center bg-slate-50 border border-slate-100 rounded-2xl w-full md:w-64 group focus-within:border-[var(--primary)] transition-all px-4">
                        <Search className="w-4 h-4 text-slate-300 group-focus-within:text-[var(--primary)] transition-colors" />
                        <input
                            type="text"
                            placeholder="RECHERCHER..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none text-[11px] font-bold py-3 px-3 w-full tracking-widest focus:ring-0 text-[var(--secondary)] placeholder-slate-300 uppercase"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <Calendar className="w-4 h-4 text-[var(--primary)]" />
                    <CustomDatePicker
                        selectedDate={selectedDate}
                        onChange={setSelectedDate}
                        placeholder="FILTRER PAR DATE..."
                    />
                </div>
            </div>

            {/* Table or Empty State */}
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="py-24 flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 border-4 border-slate-100 border-t-[var(--primary)] rounded-full animate-spin mb-6"></div>
                        <span className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-400">CHARGEMENT DES DONNÉES...</span>
                    </div>
                ) : displayedAbsences.length === 0 ? (
                    <div className="py-24 flex flex-col items-center justify-center text-center opacity-50">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                            <AlertTriangle className="w-8 h-8 text-slate-200" />
                        </div>
                        <span className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-400">AUCUN RAPPORT TROUVÉ</span>
                        <p className="text-[9px] font-bold tracking-widest text-slate-300 uppercase mt-2">Veuillez ajuster vos filtres de recherche.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto ista-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[900px]">
                            <thead>
                                <tr className="bg-slate-50/50 text-slate-400 text-[9px] font-black uppercase tracking-widest border-b border-slate-100">
                                    <th className="py-6 px-8 w-16 text-center">
                                        <div onClick={toggleSelectAll} className="cursor-pointer flex justify-center">
                                            {selectedRecords.length === displayedAbsences.length && displayedAbsences.length > 0 ? (
                                                <CheckSquare className="w-5 h-5 text-[var(--primary)]" />
                                            ) : (
                                                <Square className="w-5 h-5 text-slate-200 hover:text-[var(--primary)] transition-colors" />
                                            )}
                                        </div>
                                    </th>
                                    <th className="py-6 px-4">Date</th>
                                    <th className="py-6 px-4">Formateur</th>
                                    <th className="py-6 px-4">Module / Séance</th>
                                    <th className="py-6 px-4">Groupe</th>
                                    <th className="py-6 px-4">Taux d'Absence</th>
                                    <th className="py-6 px-8 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {displayedAbsences.map((record) => (
                                    <tr key={record.id} className="hover:bg-slate-50/30 transition-colors group">
                                        <td className="py-6 px-8 w-16 text-center">
                                            <div onClick={() => toggleSelectRecord(record.id)} className="cursor-pointer flex justify-center">
                                                {selectedRecords.includes(record.id) ? (
                                                    <CheckSquare className="w-5 h-5 text-[var(--primary)]" />
                                                ) : (
                                                    <Square className="w-5 h-5 text-slate-200 group-hover:text-[var(--primary)] transition-colors" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-6 px-4 text-[10px] font-black text-slate-400 font-mono uppercase italic">
                                            {record.date}
                                        </td>
                                        <td className="py-6 px-4">
                                            <span className="text-sm font-black italic text-[var(--secondary)] uppercase group-hover:text-[var(--primary)] transition-colors">{record.formateur}</span>
                                        </td>
                                        <td className="py-6 px-4 text-xs font-bold text-[var(--secondary)] uppercase truncate max-w-[200px]">
                                            {record.subject}
                                        </td>
                                        <td className="py-6 px-4">
                                            <span className="px-3 py-1 bg-slate-50 text-[10px] font-black text-[var(--primary)] border border-green-500/10 rounded-lg">
                                                {record.class_id}
                                            </span>
                                        </td>
                                        <td className="py-6 px-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black italic text-[var(--primary)] uppercase">
                                                    {(record.stagiaires || []).filter(s => s.status === 'ABSENT').length} / {(record.stagiaires || []).length}
                                                </span>
                                                <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">STAGIAIRES ABSENTS</span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-8 text-right">
                                            <button
                                                onClick={() => setSelectedRapport(record)}
                                                className="p-3 bg-white border border-slate-100 hover:border-[var(--primary)] hover:text-[var(--primary)] text-slate-300 transition-all rounded-xl shadow-sm"
                                            >
                                                <FileText className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal for detailed rapport */}
            <RapportModal
                isOpen={!!selectedRapport}
                onClose={() => setSelectedRapport(null)}
                rapport={selectedRapport}
            />

            {/* Hidden export components (REBRANDED FOR ISTA) */}
            <div className="hidden">
                {displayedAbsences.map(rapport => (
                    <div
                        key={`export-${rapport.id}`}
                        id={`pdf-export-${rapport.id}`}
                        style={{ display: 'none', width: '297mm', height: '210mm', backgroundColor: '#ffffff', color: '#005596' }}
                        className="flex items-center justify-center p-12 relative"
                    >
                        <div className="w-full h-full flex flex-col border-[8px] border-[var(--secondary)] p-12 relative">
                            {/* Header Section */}
                            <div className="flex justify-between items-start border-b-4 border-[var(--primary)] pb-12 mb-12">
                                <div>
                                    <h4 className="text-[10px] font-black tracking-[0.4em] text-[var(--primary)] uppercase mb-4">REPUBLIQUE DU MAROC - OFPPT - ISTA</h4>
                                    <h2 className="text-6xl font-black italic tracking-tighter text-[var(--secondary)] leading-none mb-2">RAPPORT DE <br /><span className="text-[var(--primary)]">PRÉSENCE</span></h2>
                                    <p className="text-xs font-bold tracking-widest text-slate-400 uppercase italic">Code de Rapport: {rapport.id}</p>
                                </div>
                                <div className="text-right">
                                    <div className="bg-[var(--primary)] text-white px-8 py-4 mb-4 inline-block rounded-xl">
                                        <span className="text-xl font-black italic uppercase tracking-tight">{rapport.class_id}</span>
                                    </div>
                                    <p className="text-xs font-black tracking-widest text-[var(--secondary)] uppercase">{rapport.date}</p>
                                </div>
                            </div>

                            {/* Info Section */}
                            <div className="grid grid-cols-2 gap-16 mb-16">
                                <div className="space-y-8">
                                    <div>
                                        <label className="block text-[10px] font-black tracking-[0.4em] text-slate-400 uppercase mb-3">MODULE / DISCIPLINE</label>
                                        <p className="text-2xl font-black italic uppercase text-[var(--secondary)] border-b-2 border-slate-100 pb-3">{rapport.subject}</p>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black tracking-[0.4em] text-slate-400 uppercase mb-3">FORMATEUR RESPONSABLE</label>
                                        <p className="text-2xl font-black italic uppercase text-[var(--secondary)] border-b-2 border-slate-100 pb-3">{rapport.formateur}</p>
                                    </div>
                                </div>
                                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                                    <h5 className="text-[10px] font-black tracking-[0.4em] text-slate-400 uppercase mb-6 text-center">STATISTIQUES DE LA SÉANCE</h5>
                                    <div className="flex justify-around items-center h-full">
                                        <div className="text-center">
                                            <p className="text-5xl font-black text-[var(--primary)] mb-2">{(rapport.stagiaires || []).filter(s => s.status === 'PRESENT').length}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">PRÉSENTS</p>
                                        </div>
                                        <div className="w-px h-12 bg-slate-200"></div>
                                        <div className="text-center">
                                            <p className="text-5xl font-black text-red-500 mb-2">{(rapport.stagiaires || []).filter(s => s.status === 'ABSENT').length}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">ABSENTS</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Table Section */}
                            <div className="flex-1 overflow-hidden border border-slate-200 rounded-2xl mb-12">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-50 border-b-2 border-slate-200">
                                        <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            <th className="p-6">NOM DU STAGIAIRE</th>
                                            <th className="p-6">MATRICULE / ID</th>
                                            <th className="p-6 text-right">STATUT</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {(rapport.stagiaires || []).map((stagiaire, idx) => (
                                            <tr key={idx}>
                                                <td className="p-6 text-sm font-black text-[var(--secondary)] uppercase italic">{stagiaire.name}</td>
                                                <td className="p-6 text-xs font-bold text-slate-400 font-mono tracking-widest">{stagiaire.id}</td>
                                                <td className="p-6 text-right">
                                                    <span className={`text-[10px] font-black tracking-widest px-4 py-1.5 rounded-lg border ${stagiaire.status === 'ABSENT' ? 'border-red-500 text-red-500' : 'border-[var(--primary)] text-[var(--primary)]'}`}>
                                                        {stagiaire.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Footer / Signature */}
                            <div className="flex justify-between items-end mt-auto pt-8 border-t-2 border-slate-100">
                                <div className="text-[10px] font-bold text-slate-300 tracking-[0.3em] uppercase">SYSTEME SMART ATTENDANCE ISTA v2.0</div>
                                <div className="flex flex-col items-center">
                                    <label className="text-[9px] font-black tracking-[0.4em] text-[var(--secondary)] uppercase mb-4">SIGNATURE FORMATEUR</label>
                                    <div className="w-64 h-32 bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex items-center justify-center p-4">
                                        {rapport.signature ? (
                                            <img src={rapport.signature} alt="Signature" style={{ maxHeight: '80%' }} />
                                        ) : (
                                            <span className="font-['Brush_Script_MT',cursive] italic text-3xl text-[var(--secondary)] opacity-30">
                                                {rapport.formateur}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <style>{`
                .ista-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
                .ista-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .ista-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default Rapports;
