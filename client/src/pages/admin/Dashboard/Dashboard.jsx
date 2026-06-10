import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Users,
    Activity,
    CheckCircle2,
    XCircle,
    ArrowUpRight,
    TrendingUp,
    FileText,
    RefreshCw,
    Briefcase,
    LayoutDashboard,
    ChevronDown
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useTranslation } from 'react-i18next';
import studentService from '../../../services/studentService';
import reportService from '../../../services/reportService';
import './Dashboard.css';
import '../../../styles/admin-shared.css';

const AdminDashboard = () => {
    const { t } = useTranslation();
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalFormateurs: 0,
        totalGroups: 0,
        totalReports: 0
    });
    const [period, setPeriod] = useState('weekly');
    const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
    const [activeIndex, setActiveIndex] = useState(null);
    const [globalRate, setGlobalRate] = useState(100);
    const [evolutionData, setEvolutionData] = useState([]);
    const [distributionData, setDistributionData] = useState([]);
    const [criticalStudents, setCriticalStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const [usersRes, summaryRes] = await Promise.all([
                studentService.getUsers(),
                reportService.getAdminSummary(period)
            ]);

            const users = usersRes.users || [];
            const summary = summaryRes.summary;

            setStats({
                totalStudents: summary.total_students,
                totalFormateurs: summary.total_formateurs,
                totalGroups: summary.total_groups,
                totalReports: summary.total_reports
            });

            setGlobalRate(summary.global_rate || 100);

            // Process Evolution Data
            if (summary.evolution) {
                setEvolutionData(summary.evolution);
            }

            // Process Distribution Data
            if (summary.distribution) {
                const total = summary.distribution.reduce((acc, curr) => acc + curr.count, 0);
                const colors = {
                    'PRESENT': 'var(--color-secondary-green)',
                    'ABSENT': 'var(--color-error)',
                    'LATE': 'var(--color-warning)'
                };
                const processedDistribution = summary.distribution.map(item => ({
                    name: t(`dashboard.${item.status.toLowerCase()}`) || item.status,
                    value: total > 0 ? Math.round((item.count / total) * 100) : 0,
                    count: item.count,
                    color: colors[item.status] || '#94a3b8'
                }));
                setDistributionData(processedDistribution);
            }

            // Filter critical students (any absences > 0 for visibility)
            const critical = users
                .filter(u => u.role === 'stagiaire' && u.absences > 0)
                .sort((a, b) => b.absences - a.absences)
                .slice(0, 5);
            setCriticalStudents(critical);
        } catch (error) {
            console.error('Error fetching stats', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [period]);

    const chartData = evolutionData.length > 0 ? evolutionData : [
        { name: 'LUN', rate: 0 },
        { name: 'MAR', rate: 0 },
        { name: 'MER', rate: 0 },
        { name: 'JEU', rate: 0 },
        { name: 'VEN', rate: 0 }
    ];

    const pieData = distributionData.length > 0 ? distributionData : [
        { name: t('dashboard.present'), value: 100, color: 'var(--color-secondary-green)' },
        { name: t('dashboard.absent'), value: 0, color: 'var(--color-error)' }
    ];

    const currentAttendanceRate = evolutionData.length > 0 
        ? evolutionData[evolutionData.length - 1].rate 
        : (distributionData.find(d => d.name === t('dashboard.present'))?.value || 0);

    const filteredStudents = criticalStudents.filter(u => u.last_justifier === 'ABSENCE');

    return (
        <div className="dashboard-container">
            {/* Header Section */}
            <div className="dashboard-header-section">
                <div className="dashboard-title-wrapper">
                    <div className="dashboard-hub-tag-wrapper">
                        <span className="dashboard-hub-tag">
                            {t('dashboard.hub_name')}
                        </span>
                        <div className="pulse-dot-small"></div>
                    </div>
                    <h1 className="dashboard-title">
                        {t('dashboard.overview_title')}
                    </h1>
                    <p className="dashboard-subtitle">
                        {t('dashboard.overview_subtitle')}
                    </p>
                </div>

                <button onClick={fetchStats} className="btn-sync group">
                    <RefreshCw className={`sync-icon ${loading ? 'loading' : ''}`} />
                    {t('dashboard.sync_button')}
                </button>
            </div>

            {/* Stats Cards */}
            <div className="dashboard-stats-grid">
                {[
                    { label: t('dashboard.total_students'), value: stats.totalStudents, icon: Users, color: 'var(--primary)', tag: t('dashboard.status_active') },
                    { label: t('dashboard.total_formateurs'), value: stats.totalFormateurs, icon: Briefcase, color: 'royalblue', tag: t('dashboard.status_online') },
                    { label: t('dashboard.total_groups'), value: stats.totalGroups, icon: LayoutDashboard, color: 'var(--secondary)', tag: t('dashboard.status_open') },
                    { label: t('dashboard.total_reports'), value: stats.totalReports, icon: FileText, color: 'orange', tag: t('dashboard.status_archived') }
                ].map((stat, i) => (
                    <div key={i} className="ista-card group">
                        <div className="stat-card-inner">
                            <div className="stat-info-wrapper">
                                <div className="stat-icon-wrapper">
                                    <stat.icon className="stat-icon" style={{ color: stat.color }} />
                                </div>
                                <div>
                                    <h3 className="stat-value">
                                        {loading ? '...' : stat.value.toString().padStart(2, '0')}
                                    </h3>
                                    <p className="stat-label">
                                        {stat.label}
                                    </p>
                                </div>
                            </div>
                            <span className="stat-tag">
                                {stat.tag}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Critical Absences & Surveillance Section */}
            <div className="critical-panel">
                <div className="critical-header">
                    <div className="critical-header-left">
                        <div className={`critical-icon-wrapper ${criticalStudents.length > 0 ? 'danger' : 'safe'}`}>
                            {criticalStudents.length > 0 ? (
                                <XCircle className="critical-icon danger" />
                            ) : (
                                <CheckCircle2 className="critical-icon safe" />
                            )}
                        </div>
                        <div>
                            <h3 className="critical-title">
                                {t('dashboard.critical_absences_title') || 'Surveillance des Absences'}
                            </h3>
                            <p className="critical-subtitle">
                                {criticalStudents.length > 0
                                    ? t('dashboard.critical_absences_subtitle') || 'Stagiaires sous surveillance étroite'
                                    : 'Tous les stagiaires sont en règle avec le règlement de présence.'}
                            </p>
                        </div>
                    </div>
                    {criticalStudents.length > 0 && (
                        <div className="critical-alerts-badge">
                            {criticalStudents.length} {t('dashboard.alerts_active') || 'ALERTE(S) ACTIVE(S)'}
                        </div>
                    )}
                </div>

                {filteredStudents.length > 0 ? (
                    <div className="critical-grid">
                        {filteredStudents.map((stg, i) => (
                            <Link
                                to={`/admin/student/${stg.id}`}
                                key={i}
                                className="critical-student-card"
                            >
                                <div className="critical-student-inner">
                                    <div className="critical-student-header">
                                        <div className={`absences-badge ${stg.absences >= 7 ? 'danger' : 'warning'}`}>
                                            {stg.absences}
                                        </div>
                                        <div className="student-ids">
                                            <span className="student-group-id">{stg.group_id}</span>
                                            <span className="student-id">{stg.id}</span>
                                        </div>
                                    </div>

                                    <div className="student-info">
                                        <h4 className="student-name">
                                            {stg.name}
                                        </h4>
                                        <p className="student-filiere">
                                            {stg.filiere || 'Filière non spécifiée'}
                                        </p>
                                    </div>

                                    <div className="student-footer">
                                        <div className="student-status-wrapper">
                                            <span className="student-status-text">
                                                {stg.absences >= 7 ? 'CRITIQUE' : 'ATTENTION'}
                                            </span>
                                            {stg.last_status === 'ABSENT' && (
                                                <span className="student-recidive-badge">
                                                    RÉCIDIVE
                                                </span>
                                            )}
                                        </div>
                                        <ArrowUpRight className="student-arrow-icon" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="critical-empty">
                        <Activity className="critical-empty-icon" />
                        <p className="critical-empty-text">Aucune anomalie détectée sur ce campus</p>
                    </div>
                )}
            </div>

            <div className="charts-grid">
                {/* Main Graph */}
                <div className="chart-panel-main">
                    <div className="chart-header">
                        <div className="chart-title-wrapper">
                            <div className="chart-title-indicator"></div>
                            <h3 className="chart-title">{t('dashboard.attendance_evolution')}</h3>
                        </div>
                        <div className="chart-actions">
                            <div className="period-dropdown-wrapper">
                                <button 
                                    onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
                                    className="btn-period"
                                >
                                    <svg className="period-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                    </svg>
                                    <span>
                                        {period === 'weekly' ? (t('dashboard.period_weekly') || 'Hebdomadaire') : (t('dashboard.period_monthly') || 'Mensuel')}
                                    </span>
                                    <ChevronDown className={`period-chevron ${showPeriodDropdown ? 'open' : ''}`} />
                                </button>
                                
                                {showPeriodDropdown && (
                                    <div className="period-dropdown-menu">
                                        <button 
                                            onClick={() => { setPeriod('weekly'); setShowPeriodDropdown(false); }}
                                            className={`dropdown-item ${period === 'weekly' ? 'active' : 'inactive'}`}
                                        >
                                            {t('dashboard.period_weekly') || 'Hebdomadaire'}
                                        </button>
                                        <button 
                                            onClick={() => { setPeriod('monthly'); setShowPeriodDropdown(false); }}
                                            className={`dropdown-item ${period === 'monthly' ? 'active' : 'inactive'}`}
                                        >
                                            {t('dashboard.period_monthly') || 'Mensuel'}
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="rate-summary">
                                <span className="rate-value">{globalRate}%</span>
                                <p className="rate-label">{t('dashboard.weekly_rate')}</p>
                            </div>
                        </div>
                    </div>

                    <div className="chart-area">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                                />
                                <YAxis hide domain={[0, 100]} />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: 'none',
                                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                        fontSize: '10px',
                                        fontWeight: '900',
                                        textTransform: 'uppercase'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="rate"
                                    stroke="var(--primary)"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorRate)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                </div>

                {/* Status Distribution */}
                <div className="distribution-panel ista-panel">
                    <div className="chart-title-wrapper mb-10">
                        <div className="chart-title-indicator"></div>
                        <h3 className="chart-title distribution-title">{t('dashboard.distribution_title')}</h3>
                    </div>

                    <div className="pie-chart-wrapper">
                        {/* Hover Information Display at the Top */}
                        {activeIndex !== null && (
                            <div className="pie-hover-info">
                                <div className="pie-hover-inner">
                                    <div className="pie-hover-dot" style={{ backgroundColor: pieData[activeIndex].color }}></div>
                                    <span className="pie-hover-text">{pieData[activeIndex].name}: {pieData[activeIndex].value}%</span>
                                </div>
                            </div>
                        )}

                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                    onMouseEnter={(_, index) => setActiveIndex(index)}
                                    onMouseLeave={() => setActiveIndex(null)}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={entry.color}
                                            opacity={activeIndex === null || activeIndex === index ? 1 : 0.6}
                                            style={{ filter: activeIndex === index ? 'drop-shadow(0 0 8px rgba(255,255,255,0.3))' : 'none', transition: 'all 0.3s ease' }}
                                        />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="pie-center-text">
                            <span className="pie-center-value">{globalRate}%</span>
                            <span className="pie-center-label">{t('dashboard.attendance_rate')}</span>
                        </div>
                    </div>

                    <div className="distribution-list">
                        {pieData.map((item, i) => (
                            <div key={i} className="distribution-item group">
                                <div className="dist-item-left">
                                    <div className="dist-icon-wrapper" style={{ backgroundColor: `${item.color}15` }}>
                                        <div className="dist-icon-dot" style={{ backgroundColor: item.color }}></div>
                                    </div>
                                    <div className="dist-info">
                                        <span className="dist-name">{item.name}</span>
                                        <span className="dist-count">{item.count}</span>
                                    </div>
                                </div>
                                <div className="dist-item-right">
                                    <span className="dist-percentage" style={{ color: item.color }}>{item.value}%</span>
                                    <span className="dist-ratio-label">{t('dashboard.ratio')}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="dashboard-footer">
                <div className="footer-info">
                    <div className="footer-icon-wrapper">
                        <svg className="footer-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    </div>
                    <div className="footer-text-wrapper">
                        <h4 className="footer-title">{t('dashboard.current_week')} : ISTA MIRLEFT</h4>
                        <p className="footer-subtitle">ANALYSE OPÉRATIONNELLE EN TEMPS RÉEL</p>
                    </div>
                </div>

                <button className="btn-ista btn-report">
                    <TrendingUp className="report-icon" />
                    <span className="report-text">{t('dashboard.generate_global_report')}</span>
                </button>
            </div>
        </div>
    );
};

export default AdminDashboard;
