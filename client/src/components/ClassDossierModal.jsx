import React, { useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, CheckCircle2, AlertTriangle, ArrowRight, PenTool, Hash, Users, Activity, XCircle, ShieldCheck } from 'lucide-react';

const ClassDossierModal = ({ isOpen, onClose, activeSession, students, stats, onConfirm, submitting }) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSignature, setHasSignature] = useState(false);

    useEffect(() => {
        if (isOpen && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            // Set internal resolution to match display size for 1:1 mapping
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;

            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
        }
    }, [isOpen]);

    const getCoordinates = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        const clientX = (e.clientX || (e.touches && e.touches[0].clientX));
        const clientY = (e.clientY || (e.touches && e.touches[0].clientY));

        // Calculate scaling if CSS dimensions differ from internal resolution
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    };

    const startDrawing = (e) => {
        setIsDrawing(true);
        const { x, y } = getCoordinates(e);
        const ctx = canvasRef.current.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        setHasSignature(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const { x, y } = getCoordinates(e);
        const ctx = canvasRef.current.getContext('2d');
        ctx.lineTo(x, y);
        ctx.stroke();

        // Prevent scrolling while drawing on touch devices
        if (e.touches) e.preventDefault();
    };

    const clearSignature = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasSignature(false);
    };

    const handleVerify = () => {
        if (!hasSignature) {
            alert("Digital signature required to verify cluster.");
            return;
        }
        const signatureData = canvasRef.current.toDataURL();
        onConfirm(signatureData);
    };

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-xl animate-in fade-in duration-500 overflow-y-auto">
            <div className="bg-[var(--surface)] border border-[var(--border-strong)] w-full max-w-5xl p-8 sm:p-12 space-y-10 relative overflow-hidden group shadow-2xl my-auto min-h-[700px]">

                {/* Tactical Brace Accents */}
                <div className="absolute top-0 left-0 w-12 h-12 border-t border-l border-[var(--primary)] -translate-x-2 -translate-y-2 pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-[var(--primary)] translate-x-2 -translate-y-2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b border-l border-[var(--primary)] -translate-x-2 translate-y-2 pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b border-r border-[var(--primary)] translate-x-2 translate-y-2 pointer-events-none"></div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 z-50 p-3 bg-[var(--surface)] border border-[var(--border-strong)] hover:border-[var(--primary)] transition-all text-[var(--text-muted)] hover:text-[var(--primary)] group"
                >
                    <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                </button>

                {/* Header Information */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 border-b border-[var(--border-strong)] pb-10 relative z-10">
                    <div className="flex items-center gap-8">
                        <div className="w-20 h-20 bg-[var(--primary)]/10 border border-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)] shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)]">
                            <ShieldCheck className="w-10 h-10" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-[var(--primary)] text-[10px] tracking-[0.5em] font-black uppercase flex items-center gap-3">
                                <div className="w-2 h-2 bg-[var(--primary)] animate-pulse"></div>
                                OFFICIAL_CLASSIFIED_DOSSIER
                            </p>
                            <h2 className="text-6xl font-black tracking-tighter text-[var(--text)] uppercase italic leading-none">Class Dossier Modal</h2>
                        </div>
                    </div>
                    <div className="flex flex-col text-right">
                        <span className="text-[9px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase mb-2">NETWORK_SQUADRON_LINK</span>
                        <div className="px-6 py-4 bg-[var(--surface)] border border-[var(--border-strong)]">
                            <span className="text-xl font-black text-[var(--primary)] italic tracking-tighter uppercase whitespace-nowrap">
                                NODE :: {activeSession?.class} // {activeSession?.subject}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">

                    {/* Left Column: Student List Manifest */}
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black tracking-[0.4em] text-[var(--text)] uppercase flex items-center gap-3">
                                <Users className="w-4 h-4 text-[var(--primary)]" /> Squadron Node Manifest
                            </h3>
                            <span className="text-[9px] font-black text-[var(--text-muted)] tracking-widest uppercase px-3 py-1 bg-[var(--surface)] border border-[var(--border-strong)]">
                                {students.length} NODES_ONLINE
                            </span>
                        </div>

                        <div className="max-h-[380px] overflow-y-auto pr-4 custom-scrollbar space-y-3 bg-[var(--surface)]/10 border border-[var(--border-strong)] p-4">
                            {students.length > 0 ? students.map((student) => (
                                <div key={student.id} className="flex justify-between items-center p-4 bg-[var(--background)] border border-[var(--border-strong)] hover:border-[var(--primary)]/40 transition-all group/item">
                                    <div className="flex items-center gap-5">
                                        <div className="w-10 h-10 bg-[var(--surface)] border border-[var(--border-strong)] flex items-center justify-center text-[10px] font-black group-hover/item:bg-[var(--primary)] group-hover/item:text-[var(--primary-text)] transition-colors">
                                            {student.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-black tracking-widest text-[var(--text)] uppercase italic">{student.name}</span>
                                            <span className="text-[9px] text-[var(--text-muted)] uppercase tracking-widest font-bold flex items-center gap-2">
                                                <Hash className="w-2 h-2" /> ID_{student.id.toString().padStart(3, '0')}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={`px-4 py-1.5 text-[9px] font-black tracking-[0.2em] border transition-all ${student.status === 'PRESENT' ? 'border-[var(--primary)] text-[var(--primary)] bg-[var(--primary)]/5' : 'border-red-900 text-red-500 bg-red-950/10'}`}>
                                        {student.status.toUpperCase()}
                                    </div>
                                </div>
                            )) : (
                                <div className="py-20 text-center opacity-30 text-[10px] font-black tracking-[0.4em] uppercase">No Telemetry Detected</div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Digital Signature */}
                    <div className="space-y-8 flex flex-col justify-between">
                        <div>
                            <h3 className="text-[10px] font-black tracking-[0.4em] text-[var(--text)] uppercase flex items-center gap-3 mb-8">
                                <Activity className="w-4 h-4 text-[var(--primary)]" /> Formateur Biometric Signature
                            </h3>

                            <div className="relative bg-[var(--background)] border-2 border-dashed border-[var(--border-strong)] group/sig overflow-hidden h-[300px]">
                                {/* Grid Pattern BG for Canvas */}
                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, var(--primary) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                                <canvas
                                    ref={canvasRef}
                                    className="relative z-10 w-full h-full cursor-crosshair touch-none"
                                    onMouseDown={startDrawing}
                                    onMouseMove={draw}
                                    onMouseUp={stopDrawing}
                                    onMouseOut={stopDrawing}
                                    onTouchStart={startDrawing}
                                    onTouchMove={draw}
                                    onTouchEnd={stopDrawing}
                                />

                                {!hasSignature && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-20 group-hover/sig:opacity-40 transition-opacity">
                                        <PenTool className="w-12 h-12 mb-4" />
                                        <p className="text-[10px] font-black tracking-[0.8em] uppercase">INPUT_SIGNATURE_HERE</p>
                                    </div>
                                )}

                                <button
                                    onClick={clearSignature}
                                    className="absolute bottom-6 right-6 z-20 text-[9px] font-black tracking-widest text-[var(--text-muted)] hover:text-white transition-all uppercase border border-[var(--border-strong)] px-5 py-2.5 bg-black/80 hover:bg-black"
                                >
                                    Reset Matrix
                                </button>
                            </div>
                        </div>

                        <div className="p-8 bg-[var(--primary)]/5 border border-[var(--primary)]/10 space-y-4">
                            <div className="flex items-start gap-6 text-[var(--primary)]">
                                <AlertTriangle className="w-5 h-5 flex-shrink-0 animate-pulse" />
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black tracking-[0.2em] uppercase italic leading-relaxed">
                                        FINAL_ARCHIVE_AUTHORIZATION
                                    </p>
                                    <p className="text-[9px] font-bold text-[var(--text-muted)] tracking-widest uppercase leading-loose italic">
                                        By providing your digital signature, you verify that this session cluster is correctly synced and all attendance data is authenticated.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Action Core */}
                <div className="flex flex-col sm:flex-row gap-6 pt-8 border-t border-[var(--border-strong)] relative z-10 font-black">
                    <button
                        onClick={handleVerify}
                        disabled={submitting || !hasSignature}
                        className={`flex-1 py-7 text-[11px] tracking-[0.5em] uppercase transition-all flex items-center justify-center gap-6 shadow-xl ${!hasSignature ? 'bg-[var(--surface-hover)] text-[var(--text-muted)] cursor-not-allowed' : 'bg-[var(--primary)] text-[var(--primary-text)] hover:scale-[1.02] active:scale-[0.98]'}`}
                    >
                        {submitting ? (
                            <div className="flex items-center gap-4 animate-pulse">
                                <Users className="w-5 h-5 animate-spin" />
                                ARCHIVING_NODES...
                            </div>
                        ) : (
                            <>
                                VERIFY_CLUSTER_AND_SUBMIT
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </div>

                {/* Tactical Footer Tag */}
                <div className="absolute bottom-4 right-10 font-mono text-[9px] text-[var(--border-strong)] opacity-[0.15] hidden md:block select-none font-black uppercase tracking-[0.4em]">
                    DOSSIER_V01 // NODE_SEQ_{Date.now().toString().slice(-6)}
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--primary); }
            `}</style>
        </div>,
        document.body
    );
};

export default ClassDossierModal;
