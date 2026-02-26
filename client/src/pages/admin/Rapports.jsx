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
                const res = await axios.get('http://localhost:5000/api/admin/schedule', config);
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
                const res = await axios.get('http://localhost:5000/api/admin/reports', config);
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
                    filename: `Rapport_Manifest_${recordId}.pdf`,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 1.5, useCORS: true, backgroundColor: '#000000' },
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
        <div className="space-y-12 fade-up transition-colors duration-500">
            {/* Header */}
            <div className="flex items-end justify-between border-b border-[var(--border-strong)] pb-12 transition-colors duration-500">
                <div className="space-y-4">
                    <h1 className="text-7xl font-black tracking-tighter text-[var(--primary)] uppercase italic transition-colors duration-500">Rapports</h1>
                    <p className="text-[var(--text-muted)] text-xs tracking-[0.4em] uppercase font-bold transition-colors duration-500">Absence & Attendance Intelligence</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <button
                            onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                            className="btn-noir btn-outline px-6 py-3 flex items-center gap-2"
                        >
                            <Filter className="w-3 h-3" />
                            <span className="text-[10px] font-bold tracking-widest uppercase">{classFilter === 'ALL' ? 'ALL SQUADRONS' : classFilter}</span>
                            <ChevronDown className={`w-3 h-3 transition-transform ${isFilterDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isFilterDropdownOpen && (
                            <div className="absolute top-full left-0 mt-2 bg-[var(--background)] border border-[var(--border-strong)] z-50 shadow-2xl min-w-[200px] fade-up">
                                <div
                                    className={`px-6 py-4 cursor-pointer text-[10px] font-black tracking-widest uppercase transition-colors hover:bg-[var(--surface-hover)] ${classFilter === 'ALL' ? 'bg-[var(--primary)] text-[var(--background)] hover:bg-[var(--primary)]' : 'text-[var(--text-muted)] hover:text-[var(--primary)]'}`}
                                    onClick={() => { setClassFilter('ALL'); setIsFilterDropdownOpen(false); }}
                                >
                                    ALL SQUADRONS
                                </div>
                                {availableClasses.map(cls => (
                                    <div
                                        key={cls.id}
                                        className={`px-6 py-4 cursor-pointer text-[10px] font-black tracking-widest uppercase transition-colors hover:bg-[var(--surface-hover)] ${classFilter === cls.id ? 'bg-[var(--primary)] text-[var(--background)] hover:bg-[var(--primary)]' : 'text-[var(--text-muted)] hover:text-[var(--primary)]'}`}
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
                        className={`btn-noir px-8 py-3 transition-all duration-300 ${selectedRecords.length === 0 ? 'opacity-50 cursor-not-allowed' : ''} ${isExporting ? 'animate-pulse' : ''}`}
                    >
                        <Download className="w-3 h-3 mr-2 inline-block" />
                        <span>{isExporting ? 'EXPORTING...' : 'Export Data'}</span>
                    </button>
                </div>
            </div>

            {/* Main Section */}
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black tracking-[0.5em] uppercase text-[var(--text-muted)] transition-colors duration-500">Absence Manifest</h3>
                    <div className="flex items-center gap-4">
                        <CustomDatePicker
                            selectedDate={selectedDate}
                            onChange={setSelectedDate}
                            placeholder="FIND DATE..."
                        />
                        <div className="flex items-center border-b border-[var(--border)] w-64 group focus-within:border-[var(--primary)] transition-colors duration-500">
                            <Search className="w-3 h-3 text-[var(--text-muted)] group-focus-within:text-[var(--primary)] transition-colors duration-500" />
                            <input
                                type="text"
                                placeholder="FIND RECORD..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent border-none text-[10px] py-3 px-4 w-full tracking-widest focus:ring-0 text-[var(--primary)] placeholder-[var(--text-muted)]"
                            />
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="border border-[var(--border-strong)] border-dashed py-24 flex flex-col items-center justify-center text-center opacity-50">
                        <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent animate-spin mb-4"></div>
                        <span className="text-xs font-black tracking-[0.5em] uppercase text-[var(--text-muted)] mb-4">INITIALIZING TELEMETRY...</span>
                        <p className="text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase">Syncing with Central Registry.</p>
                    </div>
                ) : displayedAbsences.length === 0 ? (
                    <div className="border border-[var(--border-strong)] border-dashed py-24 flex flex-col items-center justify-center text-center opacity-50">
                        <span className="text-xs font-black tracking-[0.5em] uppercase text-[var(--text-muted)] mb-4">NO RECORDS FOUND</span>
                        <p className="text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase">No absence records match the current filter parameters.</p>
                    </div>
                ) : (
                    <div className="border border-[var(--border-strong)] overflow-hidden bg-[var(--background)] transition-colors duration-500">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[var(--surface)] text-[var(--text-muted)] text-[10px] font-black uppercase tracking-widest transition-colors duration-500">
                                    <th className="p-8 w-16">
                                        <div onClick={toggleSelectAll} className="cursor-pointer">
                                            {selectedRecords.length === displayedAbsences.length && displayedAbsences.length > 0 ? (
                                                <CheckSquare className="w-4 h-4 text-[var(--primary)]" />
                                            ) : (
                                                <Square className="w-4 h-4 text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors" />
                                            )}
                                        </div>
                                    </th>
                                    <th className="p-8">Date</th>
                                    <th className="p-8">Formateur</th>
                                    <th className="p-8">Module Session</th>
                                    <th className="p-8">Absence Rate</th>
                                    <th className="p-8 text-right">Document</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-strong)] transition-colors duration-500">
                                {displayedAbsences.map((record) => (
                                    <tr key={record.id} className="hover:bg-[var(--surface-hover)] transition-colors duration-500 group">
                                        <td className="p-8 w-16">
                                            <div onClick={() => toggleSelectRecord(record.id)} className="cursor-pointer">
                                                {selectedRecords.includes(record.id) ? (
                                                    <CheckSquare className="w-4 h-4 text-[var(--primary)]" />
                                                ) : (
                                                    <Square className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--primary)] transition-colors" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-8 text-[10px] tracking-widest text-[var(--text-muted)] uppercase font-mono">
                                            {record.date}
                                        </td>
                                        <td className="p-8 text-[10px] tracking-widest text-[var(--text-muted)] uppercase">
                                            {record.formateur}
                                        </td>
                                        <td className="p-8 text-[10px] font-bold tracking-widest text-[var(--primary)] uppercase">
                                            {record.subject}
                                        </td>
                                        <td className="p-8">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold tracking-widest text-[var(--primary)] uppercase italic transition-colors duration-500">
                                                    {(record.stagiaires || []).filter(s => s.status === 'ABSENT').length} / {(record.stagiaires || []).length}
                                                </span>
                                                <span className="text-[9px] font-bold tracking-widest text-[var(--text-muted)] uppercase mt-1 transition-colors duration-500">ABSENCES</span>
                                            </div>
                                        </td>
                                        <td className="p-8 text-right">
                                            <button
                                                onClick={() => setSelectedRapport(record)}
                                                className="p-2 border border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)] text-[var(--text-muted)] transition-colors duration-500 rounded-sm"
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

            {/* Hidden export components */}
            <div className="hidden">
                {displayedAbsences.map(rapport => (
                    <div
                        key={`export-${rapport.id}`}
                        id={`pdf-export-${rapport.id}`}
                        style={{ display: 'none', width: '297mm', height: '210mm', backgroundColor: '#000000' }}
                        className="bg-[var(--background)] flex items-center justify-center p-8 relative export-container"
                    >
                        <div className="bg-[var(--background)] w-full h-full flex flex-row relative fade-up my-auto border border-[var(--border-strong)]">
                            {/* Left Column (Info Panel) */}
                            <div className="w-[350px] border-r border-[var(--border-strong)] p-12 flex flex-col relative bg-[var(--surface)] shrink-0">
                                <div className="mb-12">
                                    <span className="flex items-center gap-2 text-[10px] font-black tracking-[0.3em] text-[var(--primary)] uppercase mb-4">
                                        <div className="w-2 h-2 bg-[var(--primary)]"></div>
                                        RAPPORT MANIFEST
                                    </span>
                                    <h2 className="text-5xl font-black italic tracking-tighter text-[var(--primary)] leading-[0.9]">
                                        ABSENCE<br />REPORT
                                    </h2>
                                </div>
                                <div className="space-y-8 mt-auto">
                                    <div>
                                        <label className="block text-[8px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase mb-3 text-left">DOCUMENT ID</label>
                                        <div className="px-5 py-4 bg-[var(--background)] border border-[var(--border-strong)] flex items-center">
                                            <span className="text-xl font-black italic text-[var(--primary)] tracking-tighter">
                                                {rapport.id}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[8px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase mb-3 text-left">STATUS</label>
                                        <div className={`px-5 py-4 bg-[var(--background)] border flex items-center gap-3 ${rapport.status === 'JUSTIFIED' ? 'border-[var(--primary)]' : 'border-red-500'}`}>
                                            <div className={`w-3 h-3 flex items-center justify-center ${rapport.status === 'JUSTIFIED' ? 'bg-[var(--primary)]' : 'bg-red-500'}`}>
                                                <ChevronDown className="w-3 h-3 text-[var(--background)] -rotate-90" />
                                            </div>
                                            <span className={`text-xs font-black tracking-widest uppercase ${rapport.status === 'JUSTIFIED' ? 'text-[var(--primary)]' : 'text-red-500'}`}>
                                                {rapport.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Right Column (Details) */}
                            <div className="flex-1 p-12 flex flex-col relative h-[100%] overflow-hidden text-white">
                                <div className="mb-10 max-w-2xl shrink-0">
                                    <h3 className="text-2xl font-black italic tracking-tighter text-[var(--primary)] uppercase mb-2">INCIDENT DETAILS</h3>
                                    <p className="text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase">Complete telemetry log for the recorded absence.</p>
                                </div>
                                <div className="space-y-8 flex-1 flex flex-col h-[100%]">
                                    <div className="shrink-0">
                                        <label className="block text-[10px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase mb-2">MODULE SESSION</label>
                                        <div className="w-full bg-transparent border-b border-[var(--border-strong)] py-4">
                                            <span className="text-md font-black tracking-widest uppercase">{rapport.subject}</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-8 shrink-0">
                                        <div>
                                            <label className="block text-[10px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase mb-2">FORMATEUR</label>
                                            <div className="w-full bg-transparent border-b border-[var(--border-strong)] py-4">
                                                <span className="text-md font-black tracking-widest uppercase">{rapport.formateur}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase mb-2">DATE UTC</label>
                                            <div className="w-full bg-transparent border-b border-[var(--border-strong)] py-4">
                                                <span className="text-md font-black font-mono tracking-widest uppercase">{rapport.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 flex flex-col pt-4 overflow-hidden min-h-0">
                                        <label className="block text-[10px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase mb-4 shrink-0">STAGIAIRES ROLL CALL</label>
                                        <div className="border border-[var(--border-strong)] bg-[var(--surface)] flex-1 overflow-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead className="bg-[var(--surface)] border-b border-[var(--border-strong)]">
                                                    <tr className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                                                        <th className="p-4">Cadet Alias</th>
                                                        <th className="p-4 text-right">Attendance</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-[var(--border-strong)]">
                                                    {(rapport.stagiaires || []).map((stagiaire, idx) => (
                                                        <tr key={idx}>
                                                            <td className="p-4">
                                                                <div className="flex flex-col">
                                                                    <span className="text-xs font-bold tracking-widest text-[var(--primary)] uppercase">{stagiaire.name}</span>
                                                                    <span className="text-[9px] font-bold tracking-widest text-[var(--text-muted)] uppercase">{stagiaire.id}</span>
                                                                </div>
                                                            </td>
                                                            <td className="p-4 text-right">
                                                                <span className={`text-[9px] font-black tracking-[0.2em] px-3 py-1 border ${stagiaire.status === 'ABSENT' ? 'border-[#ef4444] text-[#ef4444] bg-[#ef4444]/10' : 'border-[#d4af37] text-[#d4af37] bg-[#d4af37]/10'}`}>
                                                                    {stagiaire.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="pt-2 mt-auto flex justify-end shrink-0">
                                        <div className="flex flex-col items-center">
                                            <label className="text-[8px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase mb-2">DIGITAL SIGNATURE</label>
                                            <div className="px-8 py-3 border border-dashed border-[var(--primary)] bg-[var(--primary)]/5">
                                                <span className="font-['Brush_Script_MT',cursive] italic text-2xl text-[var(--primary)] tracking-wider">
                                                    {rapport.formateur}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Rapports;
