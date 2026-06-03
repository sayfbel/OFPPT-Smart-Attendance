import React, { useState, useEffect } from 'react';
import { Search, Filter, FileText, Download, Calendar, AlertTriangle, ChevronDown, CheckSquare, Square, X } from 'lucide-react';
import axios from 'axios';
import CustomDatePicker from '../../components/CustomDatePicker';
import RapportModal from '../../components/RapportModal';
import { useTranslation } from 'react-i18next';
import { getSignatureDataURI } from '../../utils/signatureHelper';

const Rapports = () => {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';
    const [selectedDate, setSelectedDate] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [availableGroups, setAvailableGroups] = useState([]);
    const [groupFilter, setGroupFilter] = useState('ALL');
    const [selectedRecords, setSelectedRecords] = useState([]);
    const [selectedRapport, setSelectedRapport] = useState(null);
    const [isExporting, setIsExporting] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [allReports, setAllReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get('/api/admin/groups', config);
                setAvailableGroups(res.data.groups || []);
            } catch (error) {
                console.error('Error fetching groups', error);
            }
        };
        fetchGroups();

        const fetchReports = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get('/api/admin/reports', config);
                const mappedReports = (res.data.reports || []).map(r => {
                    let formattedDate = r.date;
                    if (r.date) {
                        const d = new Date(r.date);
                        if (!isNaN(d.getTime())) {
                            const year = d.getFullYear();
                            const month = String(d.getMonth() + 1).padStart(2, '0');
                            const day = String(d.getDate()).padStart(2, '0');
                            formattedDate = `${year}-${month}-${day}`;
                        }
                    }
                    return {
                        ...r,
                        date: formattedDate,
                        id: r.report_code,
                        db_id: r.id,
                        formateur: r.formateur_name,
                        salle: r.salle_name
                    };
                });
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
        const matchesGroup = groupFilter === 'ALL' || record.group_id === groupFilter;
        const matchesSearch = !searchQuery ||
            (record.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                record.studentId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                record.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                record.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                record.formateur?.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesDate && matchesSearch && matchesGroup;
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

    const handleExportPDF = () => {
        if (selectedRecords.length === 0) return;
        setIsExporting(true);
        if (!window.html2pdf) {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
            script.onload = () => {
                executeExportPDF();
            };
            document.body.appendChild(script);
        } else {
            executeExportPDF();
        }
    };

    const executeExportPDF = async () => {
        for (const recordId of selectedRecords) {
            const element = document.getElementById(`pdf-export-${recordId}`);
            if (element) {
                element.style.display = 'flex';
                const opt = {
                    margin: 0,
                    filename: `Rapport_ISTA_${recordId}.pdf`,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 1.5, useCORS: true, backgroundColor: '#ffffff' },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                };
                await window.html2pdf().set(opt).from(element).save();
                element.style.display = 'none';
            }
        }
        setIsExporting(false);
        setSelectedRecords([]);
    };

    const handleExportExcel = () => {
        if (selectedRecords.length === 0) return;
        setIsExporting(true);
        if (!window.XLSX || !window.XLSX.utils.book_new) {
            const script = document.createElement('script');
            // Use xlsx-js-style to support cell styling (borders, background colors)
            script.src = 'https://cdn.jsdelivr.net/npm/xlsx-js-style@1.2.0/dist/xlsx.bundle.js';
            script.onload = () => {
                executeExportExcel();
            };
            document.body.appendChild(script);
        } else {
            executeExportExcel();
        }
    };

    const executeExportExcel = () => {
        try {
            for (const recordId of selectedRecords) {
                const rapport = displayedAbsences.find(r => r.id === recordId);
                if (!rapport) continue;

                const absents = (rapport.stagiaires || []).filter(s => s.status === 'ABSENT');
                const total = (rapport.stagiaires || []).length;
                const taux = total > 0 ? Math.round((absents.length / total) * 100) : 0;

                const ws_data = [
                    ["RAPPORT D'ABSENCE"],
                    ["Modèle professionnel (version modernisée)"],
                    [],
                    ["Groupe", rapport.group_id],
                    ["Salle", rapport.salle || 'N/A'],
                    ["Date", rapport.date],
                    ["Horaire", rapport.heure || 'N/A'],
                    ["Formateur", rapport.formateur],
                    [],
                    ["Nombre total", total],
                    ["Absents", absents.length],
                    ["Taux d'absence", `${taux}%`],
                    [],
                    ["N°", "Nom du stagiaire", "Matricule", "Statut"],
                    ...absents.map((s, i) => [i + 1, s.name, s.id, 'Absent'])
                ];

                const ws = window.XLSX.utils.aoa_to_sheet(ws_data);
                
                // Apply styles to all cells
                for (let i in ws) {
                    if (i[0] === '!') continue;
                    
                    const col = i.replace(/[0-9]/g, '');
                    const row = parseInt(i.replace(/[A-Z]/g, ''), 10);
                    
                    let cellStyle = {
                        border: {
                            top: { style: "thin", color: { auto: 1 } },
                            bottom: { style: "thin", color: { auto: 1 } },
                            left: { style: "thin", color: { auto: 1 } },
                            right: { style: "thin", color: { auto: 1 } }
                        },
                        font: { name: "Arial", sz: 10 }
                    };

                    // Title
                    if (row === 1 || row === 2) {
                        cellStyle.border = {}; // No border for title
                        if (row === 1) cellStyle.font = { name: "Arial", sz: 14, bold: true };
                    }
                    
                    // Table Headers (Row 14) or Summary Headers (Left col of summary tables)
                    if (row === 14 || (col === 'A' && ((row >= 4 && row <= 8) || (row >= 10 && row <= 12)))) {
                        cellStyle.fill = { fgColor: { rgb: "E5E7EB" } }; // gray-200 background
                        cellStyle.font = { name: "Arial", sz: 10, bold: true };
                    }

                    ws[i].s = cellStyle;
                }

                // Add column widths to make it look professional like the PDF
                ws['!cols'] = [
                    { wch: 15 }, // A: N° / Labels
                    { wch: 30 }, // B: Nom du stagiaire / Values
                    { wch: 20 }, // C: Matricule
                    { wch: 15 }  // D: Statut
                ];

                const wb = window.XLSX.utils.book_new();
                window.XLSX.utils.book_append_sheet(wb, ws, "Rapport");
                window.XLSX.writeFile(wb, `Rapport_ISTA_${recordId}.xlsx`);
            }
        } catch (error) {
            console.error("Export Excel error", error);
        }
        setIsExporting(false);
        setSelectedRecords([]);
    };

    return (
        <div className="space-y-12 fade-up transition-all duration-500">
            {/* Header */}
            <div className={`flex flex-col md:flex-row items-start md:items-end justify-between border-b border-slate-100 pb-8 lg:pb-12 gap-6 lg:gap-8 ${isRtl ? 'text-right' : ''}`}>
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-[var(--secondary)] uppercase italic leading-[0.9]">
                        {t('reports.title')}
                    </h1>
                    <p className="text-[var(--text-muted)] text-[10px] lg:text-xs tracking-[0.4em] uppercase font-black">
                        {t('reports.subtitle')}
                    </p>
                </div>
                <div className="flex flex-wrap gap-4 justify-end">
                    {/* Button moved to filters bar */}
                </div>
            </div>

            {/* Class Cards */}
            <div className={`flex gap-6 overflow-x-auto pb-6 ista-scrollbar ${isRtl ? 'flex-row-reverse' : ''}`}>
                <div
                    onClick={() => setGroupFilter('ALL')}
                    className={`min-w-[320px] p-8 rounded-[24px] cursor-pointer transition-all duration-300 border ${
                        groupFilter === 'ALL' 
                            ? 'bg-white border-[var(--primary)] shadow-lg shadow-[var(--primary)]/5' 
                            : 'bg-white border-slate-100 hover:border-slate-300 opacity-60 hover:opacity-100'
                    }`}
                >
                    <div className={`flex justify-between items-center mb-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
                        <span className={`text-[12px] font-black uppercase tracking-widest truncate-text flex-1 ${
                            groupFilter === 'ALL' ? 'text-[var(--primary)]' : 'text-[var(--secondary)]'
                        } ${isRtl ? 'text-right' : ''}`}>
                            {t('reports.all_groups')}
                        </span>
                        <div className={`w-2.5 h-2.5 rounded-full outline outline-4 outline-offset-2 ${
                            groupFilter === 'ALL' ? 'bg-[var(--primary)] outline-[var(--primary)]/20' : 'bg-slate-200 outline-slate-100'
                        }`}></div>
                    </div>
                    <h3 className={`text-2xl font-black italic text-[var(--secondary)] uppercase tracking-tight mb-8 truncate-text ${isRtl ? 'text-right' : ''}`}>
                        {t('reports.all_groups')}
                    </h3>
                    <p className={`text-[9px] font-bold text-slate-400 uppercase tracking-widest ${isRtl ? 'text-right' : ''}`}>
                        {t('reports.title')}: <span className="text-[var(--secondary)] ml-1 truncate-text inline-block align-bottom max-w-[150px]">
                            {allReports.length} {t('reports.export_button')}s
                        </span>
                    </p>
                </div>

                {availableGroups.length > 0 ? (
                    availableGroups.map((grp) => {
                        const grpReportsCount = allReports.filter(r => r.group_id === grp.id).length;
                        return (
                            <div
                                key={grp.id}
                                onClick={() => setGroupFilter(grp.id)}
                                className={`min-w-[320px] p-8 rounded-[24px] cursor-pointer transition-all duration-300 border ${
                                    groupFilter === grp.id 
                                        ? 'bg-white border-[var(--primary)] shadow-lg shadow-[var(--primary)]/5' 
                                        : 'bg-white border-slate-100 hover:border-slate-300 opacity-60 hover:opacity-100'
                                }`}
                            >
                                <div className={`flex justify-between items-center mb-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                    <span className={`text-[12px] font-black uppercase tracking-widest truncate-text flex-1 ${
                                        groupFilter === grp.id ? 'text-[var(--primary)]' : 'text-[var(--secondary)]'
                                    } ${isRtl ? 'text-right' : ''}`}>
                                        {(grp.id || '').split('-')[0].trim()}
                                    </span>
                                    <div className={`w-2.5 h-2.5 rounded-full outline outline-4 outline-offset-2 ${
                                        groupFilter === grp.id ? 'bg-[var(--primary)] outline-[var(--primary)]/20' : 'bg-slate-200 outline-slate-100'
                                    }`}></div>
                                </div>
                                <h3 className={`text-2xl font-black italic text-[var(--secondary)] uppercase tracking-tight mb-8 truncate-text ${isRtl ? 'text-right' : ''}`}>
                                    {grp.id}
                                </h3>
                                <p className={`text-[9px] font-bold text-slate-400 uppercase tracking-widest ${isRtl ? 'text-right' : ''}`}>
                                    {t('accounts.col_filiere')}: <span className="text-[var(--secondary)] ml-1 truncate-text inline-block align-bottom max-w-[150px]">
                                        {grp.filiere || 'GESTION DES ENTREPRISES'}
                                    </span>
                                    <span className="mx-2">•</span>
                                    <span className="text-[var(--primary)] font-black">{grpReportsCount}</span>
                                </p>
                            </div>
                        );
                    })
                ) : (
                    <div className="min-w-[320px] p-8 rounded-[24px] bg-white border border-slate-100 opacity-60 flex items-center justify-center">
                        <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">{t('accounts.no_groups_available')}</p>
                    </div>
                )}
            </div>

            {/* Filters bar */}
            <div className={`flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm ${isRtl ? 'md:flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-6 w-full md:w-auto ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-400">{t('reports.list_title')}</h3>
                    <div className="h-4 w-px bg-slate-100 hidden md:block"></div>
                    <div className={`flex items-center bg-slate-50 border border-slate-100 rounded-2xl w-full md:w-64 group focus-within:border-[var(--primary)] transition-all px-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                        <Search className="w-4 h-4 text-slate-300 group-focus-within:text-[var(--primary)] transition-colors" />
                        <input
                            type="text"
                            placeholder={t('reports.search')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`bg-transparent border-none text-[11px] font-bold py-3 px-3 w-full tracking-widest focus:ring-0 text-[var(--secondary)] placeholder-slate-300 uppercase ${isRtl ? 'text-right' : ''}`}
                        />
                    </div>
                </div>
                <div className={`flex items-center gap-4 w-full md:w-auto ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <CustomDatePicker
                        selectedDate={selectedDate}
                        onChange={setSelectedDate}
                        placeholder={t('reports.filter_date')}
                    />
                    
                    <div className="relative">
                        <button
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            disabled={isExporting || selectedRecords.length === 0}
                            className={`btn-ista px-6 py-3 flex items-center gap-2 transition-all ${selectedRecords.length === 0 ? 'opacity-50 cursor-not-allowed scale-95 shadow-none' : 'shadow-lg hover:scale-[1.02] active:scale-[0.98]'}`}
                        >
                            <Download className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
                            <span className="text-[10px] uppercase font-bold tracking-widest">
                                {isExporting 
                                    ? t('reports.exporting') 
                                    : (selectedRecords.length > 0 
                                        ? `EXPORTER (${selectedRecords.length})` 
                                        : 'EXPORTER')}
                            </span>
                            <ChevronDown className="w-3 h-3 ml-1" />
                        </button>

                        {showExportMenu && selectedRecords.length > 0 && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden">
                                <button 
                                    onClick={() => { setShowExportMenu(false); handleExportPDF(); }}
                                    className="w-full text-left px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors border-b border-slate-50"
                                >
                                    Format PDF
                                </button>
                                <button 
                                    onClick={() => { setShowExportMenu(false); handleExportExcel(); }}
                                    className="w-full text-left px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                                >
                                    Format EXCEL
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Table or Empty State */}
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="py-24 flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 border-4 border-slate-100 border-t-[var(--primary)] rounded-full animate-spin mb-6"></div>
                        <span className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-400">{t('reports.loading')}</span>
                    </div>
                ) : displayedAbsences.length === 0 ? (
                    <div className="py-24 flex flex-col items-center justify-center text-center opacity-50">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                            <AlertTriangle className="w-8 h-8 text-slate-200" />
                        </div>
                        <span className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-400">{t('reports.not_found')}</span>
                        <p className="text-[9px] font-bold tracking-widest text-slate-300 uppercase mt-2">{t('reports.adjust_filters')}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto ista-scrollbar">
                        <table className={`w-full text-left border-collapse min-w-[900px] ${isRtl ? 'text-right' : ''}`}>
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
                                    <th className="py-6 px-4">{t('reports.col_date')}</th>
                                    <th className="py-6 px-4">{t('reports.col_formateur')}</th>
                                    <th className="py-6 px-4">{t('reports.col_subject')}</th>
                                    <th className="py-6 px-4">{t('reports.col_group')}</th>
                                    <th className="py-6 px-4">{t('reports.col_absent_rate')}</th>
                                    <th className={`py-6 px-8 ${isRtl ? 'text-left' : 'text-right'}`}>{t('reports.col_actions')}</th>
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
                                                {record.group_id}
                                            </span>
                                        </td>
                                        <td className="py-6 px-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black italic text-[var(--primary)] uppercase">
                                                    {(record.stagiaires || []).filter(s => s.status === 'ABSENT').length} / {(record.stagiaires || []).length}
                                                </span>
                                                <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">{t('reports.absent_label')}</span>
                                            </div>
                                        </td>
                                        <td className={`py-6 px-8 ${isRtl ? 'text-left' : 'text-right'}`}>
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
                {displayedAbsences.map(rapport => {
                    const absents = (rapport.stagiaires || []).filter(s => s.status === 'ABSENT');
                    const total = (rapport.stagiaires || []).length;
                    const taux = total > 0 ? Math.round((absents.length / total) * 100) : 0;

                    return (
                    <div
                        key={`export-${rapport.id}`}
                        id={`pdf-export-${rapport.id}`}
                        dir={isRtl ? 'rtl' : 'ltr'}
                        style={{ display: 'none', width: '210mm', backgroundColor: '#ffffff', color: '#000000', fontFamily: 'Helvetica, Arial, sans-serif' }}
                        className="px-8 py-8 relative"
                    >
                        <div className="w-full flex flex-col bg-white">
                            {/* Title */}
                            <h1 className="text-xl font-bold text-center mb-4 uppercase text-black">RAPPORT D'ABSENCE</h1>
                            <h2 className="text-sm font-bold mb-4 text-black">Modèle professionnel (version modernisée)</h2>

                            {/* Summary Tables Container */}
                            <div className="w-full flex flex-col items-center mb-4 space-y-4">
                                {/* Table 1 */}
                                <table className="w-[80%] border-collapse border border-black text-xs">
                                    <tbody>
                                        <tr>
                                            <td className="border border-black bg-gray-200 p-1 font-bold w-1/3">Groupe</td>
                                            <td className="border border-black p-1">{rapport.group_id}</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-black bg-gray-200 p-1 font-bold">Salle</td>
                                            <td className="border border-black p-1">{rapport.salle || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-black bg-gray-200 p-1 font-bold">Date</td>
                                            <td className="border border-black p-1">{rapport.date}</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-black bg-gray-200 p-1 font-bold">Horaire</td>
                                            <td className="border border-black p-1">{rapport.heure || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-black bg-gray-200 p-1 font-bold">Formateur</td>
                                            <td className="border border-black p-1">{rapport.formateur}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                {/* Table 2 */}
                                <table className="w-[60%] border-collapse border border-black text-xs">
                                    <tbody>
                                        <tr>
                                            <td className="border border-black bg-gray-200 p-1 font-bold w-1/2">Nombre total</td>
                                            <td className="border border-black p-1">{total}</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-black bg-gray-200 p-1 font-bold">Absents</td>
                                            <td className="border border-black p-1">{absents.length}</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-black bg-gray-200 p-1 font-bold">Taux d'absence</td>
                                            <td className="border border-black p-1">{taux}%</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Main Table */}
                            <div className="w-full flex justify-center mb-6">
                                <table className="w-[90%] border-collapse border border-black text-[10px]">
                                    <thead className="bg-gray-200">
                                        <tr>
                                            <th className="border border-black px-1 py-0.5 text-left w-8 text-black">N°</th>
                                            <th className="border border-black px-1 py-0.5 text-left text-black">Nom du stagiaire</th>
                                            <th className="border border-black px-1 py-0.5 text-left w-40 text-black">Matricule</th>
                                            <th className="border border-black px-1 py-0.5 text-left w-24 text-black">Statut</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {absents.map((stagiaire, idx) => (
                                            <tr key={idx}>
                                                <td className="border border-black px-1 py-0.5 text-black">{idx + 1}</td>
                                                <td className="border border-black px-1 py-0.5 text-black">{stagiaire.name}</td>
                                                <td className="border border-black px-1 py-0.5 text-black">{stagiaire.id}</td>
                                                <td className="border border-black px-1 py-0.5 text-black">Absent</td>
                                            </tr>
                                        ))}
                                        {absents.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="border border-black px-1 py-0.5 text-center italic text-black">Aucune absence signalée.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Signature */}
                            <div className="w-full mt-auto pt-2">
                                <h3 className="text-sm font-bold italic mb-2">Signature du formateur</h3>
                                {rapport.signature ? (
                                    <div className="h-16 flex items-start mt-2">
                                        <img 
                                            src={getSignatureDataURI(rapport.signature)} 
                                            alt="Signature" 
                                            className="max-h-16 object-contain grayscale contrast-200 mix-blend-multiply"
                                        />
                                    </div>
                                ) : (
                                    <div className="border-b border-black w-48 mt-10"></div>
                                )}
                            </div>
                        </div>
                    </div>
                )})}
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
