import React, { useEffect, useState, useRef } from 'react';
import { Shield, X, Check, AlertCircle, CheckCircle, Smartphone } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useNotification } from '../../hooks/useNotification';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useTranslation } from 'react-i18next';
import attendanceService from '../../services/attendanceService';
import studentService from '../../services/studentService';
import './Scanner.css';

const Scanner = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { addNotification } = useNotification();
    const [searchParams] = useSearchParams();
    const groupId = searchParams.get('groupId');
    const subject = searchParams.get('subject');
    const room = searchParams.get('room');
    const sessionTime = searchParams.get('time');

    const [activeStudents, setActiveStudents] = useState([]);
    const [checkedInIds, setCheckedInIds] = useState([]);
    const [lastScan, setLastScan] = useState(null);
    const [error, setError] = useState(null);
    const [submitting] = useState(false);

    const prevCheckinsRef = useRef([]);
    const isFirstSyncRef = useRef(true);

    // 1. Sync Checkins
    useEffect(() => {
        if (!groupId) return;

        const syncCheckins = async () => {
            try {
                const checkinRes = await attendanceService.getActiveCheckins(groupId);
                
                // The API returns [{ student_id, status }]. We need an array of string IDs for 'PRESENT' students.
                const currentIds = (checkinRes.checkins || [])
                    .filter(c => c.status === 'PRESENT' || c.status === undefined)
                    .map(c => c.student_id !== undefined ? c.student_id : c);

                if (isFirstSyncRef.current) {
                    isFirstSyncRef.current = false;
                } else if (currentIds.length > prevCheckinsRef.current.length) {
                    const newId = currentIds.find(id => !prevCheckinsRef.current.includes(id));
                    const student = activeStudents.find(s => s.id === newId);

                    if (student) {
                        setLastScan({
                            name: student.name,
                            alreadyScanned: false,
                            time: new Date().toLocaleTimeString(),
                            success: true
                        });
                        setTimeout(() => setLastScan(null), 3500);
                    }
                }

                setCheckedInIds(currentIds);
                prevCheckinsRef.current = currentIds;
            } catch (err) {
                console.error("Signal Sync Failure:", err);
            }
        };

        // Run immediately on mount to establish baseline without triggering popup
        syncCheckins();
        
        const interval = setInterval(syncCheckins, 1500);
        return () => clearInterval(interval);
    }, [groupId, activeStudents]);

    const lastScanTimeRef = useRef(0);

    // 2. Start HTML5 QR Scanner
    useEffect(() => {
        let scanner = null;
        let isInstanceMounted = true;
        let initTimeout = null;

        if (groupId) {
            initTimeout = setTimeout(() => {
                scanner = new Html5QrcodeScanner(
                    "qr-reader",
                    { fps: 10, qrbox: { width: 250, height: 250 } },
                    /* verbose= */ false
                );

                scanner.render(async (decodedText) => {
                    // Check if 5 seconds have passed since last scan
                    const now = Date.now();
                    if (now - lastScanTimeRef.current < 5000) {
                        return; // Ignore scan
                    }
                    lastScanTimeRef.current = now;

                    // on scan success
                    if (submitting) return; // Ignore scans while submitting report
                    
                    try {
                        const res = await attendanceService.processCheckinQR(decodedText, groupId);

                        if (isInstanceMounted) {
                            setLastScan({
                                name: res.name || decodedText,
                                alreadyScanned: res.alreadyScanned || false,
                                time: new Date().toLocaleTimeString(),
                                success: true
                            });
                            setTimeout(() => setLastScan(null), 3500);
                            
                            if (res.alreadyScanned) {
                                addNotification(t('scanner.already_scanned', 'Ce stagiaire est déjà présent'), 'warning');
                            } else {
                                addNotification(t('scanner.success_msg', 'QR Code scanné avec succès'), 'success');
                            }
                        }
                    } catch (err) {
                        if (err.response?.status === 403 || err.response?.status === 404) {
                            addNotification(err.response?.data?.message || 'Erreur lors du scan', 'error');
                        }
                    }
                }, () => {
                    // Ignore general scan errors (happens every frame when no QR is visible)
                });
            }, 100);
        }

        return () => {
            isInstanceMounted = false;
            if (initTimeout) {
                clearTimeout(initTimeout);
            }
            if (scanner) {
                scanner.clear().catch(error => {
                    console.error("Failed to clear html5QrcodeScanner. ", error);
                });
            }
        };
    }, [groupId, submitting, addNotification, t]);

    // 3. Initial Data
    useEffect(() => {
        const fetchMainData = async () => {
            try {
                const res = await studentService.getFormateurUsersByGroup(groupId);
                setActiveStudents(res.users || []);
            } catch (err) {
                console.error("Manifest Load Error:", err);
            }
        };
        if (groupId) fetchMainData();
    }, [groupId]);

    const handleExit = async () => {
        try {
            if (groupId) {
                await attendanceService.clearCheckins(groupId);
            }
        } catch (err) {
            console.error("Failed to clear checkins on exit:", err);
        } finally {
            navigate('/formateur');
        }
    };

    const handleConfirm = () => {
        if (submitting) return;
        
        const activeSession = {
            group: groupId,
            subject: decodeURIComponent(subject || 'COURS'),
            room: room || 'ROOM',
            time: sessionTime || new Date().toLocaleTimeString()
        };

        const studentsWithStatus = activeStudents.map(s => ({
            ...s,
            status: checkedInIds.includes(s.id) ? 'PRESENT' : 'ABSENT'
        }));

        const stats = {
            total: activeStudents.length,
            present: checkedInIds.length,
            absent: activeStudents.length - checkedInIds.length,
            late: 0
        };

        navigate('/formateur/dossier', { 
            state: { 
                activeSession, 
                students: studentsWithStatus, 
                stats 
            } 
        });
    };

    const toggleManualStatus = async (studentId, currentStatus) => {
        try {
            const newStatus = currentStatus === 'PRESENT' ? 'ABSENT' : 'PRESENT';
            await attendanceService.updateCheckinStatus(studentId, groupId, newStatus);

            // Optimistically update
            if (newStatus === 'PRESENT') {
                setCheckedInIds(prev => {
                    if (!prev.includes(studentId)) return [...prev, studentId];
                    return prev;
                });
            } else {
                setCheckedInIds(prev => prev.filter(id => id !== studentId));
            }
        } catch (err) {
            console.error("Manual toggle failed:", err);
            addNotification("Erreur lors de la mise à jour", "error");
        }
    };

    const checkedInStudents = activeStudents.filter(s => checkedInIds.includes(s.id));

    return (
        <div className="scn-wrapper fade-up">
            <div className="scn-container">
                <div className="scn-card">

                    {/* Header Bar */}
                    <div className="scn-header">
                        <div className="scn-header-left">
                            <div className="scn-header-icon-wrapper">
                                <Shield className="scn-header-icon" />
                            </div>
                            <div className="scn-header-titles">
                                <h2 className="scn-header-subtitle">{t('scanner.digital_tag')}</h2>
                                <h1 className="scn-header-title">{t('scanner.title')}</h1>
                            </div>
                        </div>
                        <div className="scn-header-right">
                            <button
                                onClick={handleExit}
                                className="scn-btn-exit"
                                title={t('scanner.exit_tooltip')}
                            >
                                <X className="scn-icon-small" />
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={submitting}
                                className="scn-btn-finish"
                            >
                                <Check className="scn-icon-small" />
                                <span>{submitting ? t('scanner.validating') : t('scanner.finish_button')}</span>
                            </button>
                        </div>
                    </div>

                    {/* Info Bar */}
                    <div className="scn-info-bar">
                        <div className="scn-info-col border-right">
                            <span className="scn-info-label">{t('scanner.group_label')}</span>
                            <span className="scn-info-val-sec">{groupId || '---'}</span>
                        </div>
                        <div className="scn-info-col border-right">
                            <span className="scn-info-label">{t('scanner.session_label')}</span>
                            <span className="scn-info-val-pri">{decodeURIComponent(subject || 'COURS')}</span>
                        </div>
                        <div className="scn-info-col border-right">
                            <span className="scn-info-label">{t('scanner.attendance_label')}</span>
                            <span className="scn-info-val-sec">{checkedInIds.length} / {activeStudents.length}</span>
                        </div>
                        <div className="scn-info-col">
                            <span className="scn-info-label">STATUT</span>
                            <div className="scn-status-indicator">
                                <div className="scn-pulse-dot"></div>
                                <span className="scn-info-val-pri">{t('dashboard.status_active')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Viewport Area */}
                    <div className="scn-viewport">
                        {error ? (
                            <div className="scn-error-state">
                                <AlertCircle className="scn-error-icon" />
                                <span className="scn-error-text">{t('scanner.offline')}</span>
                            </div>
                        ) : (
                            <>
                                <div id="qr-reader" className="scn-qr-reader"></div>

                                {/* Result Overlay */}
                                {lastScan && (
                                    <div className={`scn-scan-result ${!lastScan.success ? 'error' : lastScan.alreadyScanned ? 'warning' : 'success'}`}>
                                        <div className="scn-scan-result-icon">
                                            {!lastScan.success ? (
                                                <AlertCircle className="text-red" />
                                            ) : lastScan.alreadyScanned ? (
                                                <AlertCircle className="text-amber" />
                                            ) : (
                                                <CheckCircle className="text-green" />
                                            )}
                                        </div>

                                        <div className="scn-scan-result-content">
                                            <span className="scn-scan-result-title">
                                                {!lastScan.success ? t('scanner.error_label') : lastScan.alreadyScanned ? t('scanner.already_scanned') : t('dashboard.present')}
                                            </span>
                                            <span className="scn-scan-result-name">
                                                {lastScan.name}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Detailed Students Table */}
                    <div className="scn-table-section">
                        <div className="scn-table-header">
                            <h3 className="scn-table-title">Liste des Stagiaires ({checkedInStudents.length} / {activeStudents.length} Présents)</h3>
                        </div>
                        <div className="scn-table-wrapper ista-scrollbar">
                            {activeStudents.length === 0 ? (
                                <div className="scn-table-empty">{t('scanner.no_scans', 'Aucun étudiant trouvé...')}</div>
                            ) : (
                                <table className="scn-table">
                                    <thead className="scn-thead">
                                        <tr>
                                            <th className="scn-th">NOM</th>
                                            <th className="scn-th">Email / ID</th>
                                            <th className="scn-th text-center">État</th>
                                            <th className="scn-th text-center">ACTIONS MANUELLES</th>
                                        </tr>
                                    </thead>
                                    <tbody className="scn-tbody">
                                        {activeStudents.map(student => {
                                            const isPresent = checkedInIds.includes(student.id);
                                            return (
                                                <tr key={student.id} className="scn-tr">
                                                    <td className="scn-td font-bold">{student.name}</td>
                                                    <td className="scn-td text-muted">{student.id}</td>
                                                    <td className="scn-td text-center">
                                                        <span className={`scn-status-badge ${isPresent ? 'present' : 'absent'}`}>
                                                            {isPresent ? 'PRÉSENT' : 'ABSENT'}
                                                        </span>
                                                    </td>
                                                    <td className="scn-td text-center">
                                                        <button 
                                                            onClick={() => toggleManualStatus(student.id, isPresent ? 'PRESENT' : 'ABSENT')}
                                                            disabled={submitting}
                                                            className={`scn-manual-btn ${isPresent ? 'absent' : 'present'}`}
                                                        >
                                                            {isPresent ? 'Marquer Absent' : 'Marquer Présent'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    {/* Status Bar */}
                    <div className="scn-footer">
                        <div className="scn-footer-left">
                            <div className="scn-footer-item">
                                <div className="scn-pulse-dot-green"></div>
                                <span className="scn-footer-label">{t('scanner.server_status')}</span>
                            </div>
                            <div className="scn-footer-item border-left hidden-mobile">
                                <Smartphone className="scn-footer-icon" />
                                <span className="scn-footer-label">{t('scanner.interface_tag')}</span>
                            </div>
                        </div>
                        <div className="scn-footer-brand">{t('scanner.campus')}</div>
                    </div>
                </div>

                <div className="scn-brand-watermark">
                    <p className="scn-brand-text">
                        {t('scanner.automated')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Scanner;
