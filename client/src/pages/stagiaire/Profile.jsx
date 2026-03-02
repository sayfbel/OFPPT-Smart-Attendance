import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Book, Globe, Cpu, Clock, Calendar, ExternalLink, QrCode, Zap } from 'lucide-react';
import axios from 'axios';
import { useNotification } from '../../context/NotificationContext';
import StagiaireIdentityModal from '../../components/StagiaireIdentityModal';

const Profile = () => {
    const { addNotification } = useNotification();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isIdModalOpen, setIsIdModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http') || path.startsWith('data:')) return path;
        return `http://localhost:5000${path}`;
    };

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.get('http://localhost:5000/api/stagiaire/profile', config);
            setProfile(res.data.profile);
        } catch (error) {
            console.error('Error fetching profile', error);
            addNotification('Registry link failure.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [addNotification]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result;
            setUploading(true);
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await axios.put('http://localhost:5000/api/stagiaire/profile', { image: base64String }, config);
                addNotification('Identity asset updated.', 'success');
                fetchProfile();
            } catch (error) {
                console.error('Error updating image', error);
                addNotification('Sync failure.', 'error');
            } finally {
                setUploading(false);
            }
        };
        reader.readAsDataURL(file);
    };

    if (loading) {
        return <div className="flex items-center justify-center h-screen bg-black text-white italic tracking-[0.5em] font-black uppercase">Retrieving Neural Identity...</div>;
    }

    return (
        <div className="space-y-16 fade-up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-[var(--border-strong)] pb-12">
                <div className="space-y-4">
                    <p className="text-[var(--text-muted)] text-[10px] tracking-[0.5em] font-black uppercase">Node Identity Protocol</p>
                    <div className="flex items-center gap-8">
                        <h1 className="text-7xl font-black tracking-tighter text-[var(--primary)] uppercase italic">Profile</h1>
                        <button
                            onClick={() => setIsIdModalOpen(true)}
                            className="p-4 border border-[var(--border-strong)] bg-[var(--surface)] hover:border-[var(--primary)] group transition-all duration-500"
                        >
                            <QrCode className="w-6 h-6 text-[var(--text-muted)] group-hover:text-[var(--primary)] group-hover:rotate-12 transition-all" />
                        </button>
                    </div>
                </div>
            </div>

            <StagiaireIdentityModal
                isOpen={isIdModalOpen}
                onClose={() => setIsIdModalOpen(false)}
                profile={profile}
                onUpdate={fetchProfile}
            />

            {/* NEW: Activation Tasks Section */}
            {(!profile?.image || !profile?.face_id) && (
                <div className="border-2 border-[var(--primary)] bg-[var(--primary)]/5 p-8 relative overflow-hidden fade-up">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Zap className="w-24 h-24 text-[var(--primary)]" />
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-[var(--primary)]"></div>
                                <h2 className="text-xl font-black tracking-widest uppercase italic text-[var(--primary)]">Neural Activation Required</h2>
                            </div>
                            <p className="text-[10px] font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase max-w-2xl leading-relaxed">
                                Your account is currently in a restricted state. To synchronize with the squadron network and enable full operational capabilities, you must complete the following identification protocols.
                            </p>

                            <div className="flex flex-wrap gap-8 pt-4">
                                <div className="flex items-center gap-4">
                                    <div className={`w-4 h-4 border-2 flex items-center justify-center ${profile?.image ? 'border-[var(--primary)] bg-[var(--primary)]' : 'border-[var(--border-strong)]'}`}>
                                        {profile?.image && <div className="w-2 h-2 bg-[var(--background)]"></div>}
                                    </div>
                                    <span className={`text-[10px] font-black tracking-[0.3em] uppercase ${profile?.image ? 'text-[var(--text)]' : 'text-[var(--text-muted)]'}`}>
                                        1. Digital Avatar Sync {profile?.image ? '[COMPLETED]' : '[PENDING]'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className={`w-4 h-4 border-2 flex items-center justify-center ${profile?.face_id ? 'border-[var(--primary)] bg-[var(--primary)]' : 'border-[var(--border-strong)]'}`}>
                                        {profile?.face_id && <div className="w-2 h-2 bg-[var(--background)]"></div>}
                                    </div>
                                    <span className={`text-[10px] font-black tracking-[0.3em] uppercase ${profile?.face_id ? 'text-[var(--text)]' : 'text-[var(--text-muted)]'}`}>
                                        2. Biometric Neural Scan {profile?.face_id ? '[COMPLETED]' : '[PENDING]'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            {!profile?.image && (
                                <button
                                    onClick={() => document.getElementById('avatar-upload').click()}
                                    className="px-8 py-4 bg-[var(--primary)] text-[var(--background)] font-black text-[10px] tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all"
                                >
                                    Sync_Avatar
                                </button>
                            )}
                            {!profile?.face_id && (
                                <button
                                    onClick={() => setIsIdModalOpen(true)}
                                    className="px-8 py-4 bg-transparent border-2 border-[var(--primary)] text-[var(--primary)] font-black text-[10px] tracking-[0.3em] uppercase hover:bg-[var(--primary)] hover:text-[var(--background)] transition-all"
                                >
                                    Initiate_Scan
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Visual ID Card */}
                <div className="lg:col-span-1 border border-[var(--border-strong)] bg-[var(--surface)] p-12 flex flex-col items-center text-center group overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-[var(--primary)] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>

                    <div className="relative group/avatar cursor-pointer mb-8">
                        <input
                            type="file"
                            id="avatar-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploading}
                        />
                        <label
                            htmlFor="avatar-upload"
                            className="w-40 h-40 bg-[var(--background)] border border-[var(--border-strong)] flex items-center justify-center text-5xl font-black text-[var(--primary)] group-hover:border-[var(--primary)] group-hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)] transition-all duration-700 relative z-10 overflow-hidden cursor-pointer block"
                        >
                            {profile?.image ? (
                                <img src={getImageUrl(profile.image)} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                profile?.name?.split(' ').map(n => n[0]).join('')
                            )}

                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-[10px] font-black tracking-widest text-white uppercase italic">
                                    {uploading ? 'SYNCING...' : 'UPDATE_IMAGE'}
                                </span>
                            </div>
                        </label>
                    </div>

                    <h2 className="text-3xl font-black italic text-[var(--text)] uppercase tracking-tighter mb-2 relative z-10">{profile?.name}</h2>
                    <p className="text-[10px] font-black tracking-[0.4em] text-[var(--primary)] uppercase mb-8 relative z-10">{profile?.role}</p>

                    <div className="w-full space-y-4 pt-8 border-t border-[var(--border-strong)] relative z-10">
                        <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black tracking-widest text-[var(--text-muted)] uppercase italic">Status</span>
                            <span className="text-[9px] font-black tracking-widest text-[var(--primary)] uppercase">Active_Signal</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black tracking-widest text-[var(--text-muted)] uppercase italic">Registry_ID</span>
                            <span className="text-[9px] font-black tracking-widest text-[var(--text)] uppercase">#00{profile?.id}</span>
                        </div>
                    </div>
                </div>

                {/* Detailed Records */}
                <div className="lg:col-span-2 space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-8 border border-[var(--border-strong)] bg-[var(--background)] group hover:border-[var(--primary)] transition-colors">
                            <div className="flex items-center gap-6 mb-4">
                                <Mail className="w-4 h-4 text-[var(--primary)]" />
                                <span className="text-[10px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase">Comms Key</span>
                            </div>
                            <p className="text-sm font-bold text-[var(--text)] tracking-widest uppercase truncate">{profile?.email}</p>
                        </div>

                        <div className="p-8 border border-[var(--border-strong)] bg-[var(--background)] group hover:border-[var(--primary)] transition-colors">
                            <div className="flex items-center gap-6 mb-4">
                                <Cpu className="w-4 h-4 text-[var(--primary)]" />
                                <span className="text-[10px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase">Assigned Cluster</span>
                            </div>
                            <p className="text-sm font-bold text-[var(--text)] tracking-widest uppercase italic">{profile?.class_id || 'NONE'}</p>
                        </div>

                        <div className="p-8 border border-[var(--border-strong)] bg-[var(--background)] group hover:border-[var(--primary)] transition-colors">
                            <div className="flex items-center gap-6 mb-4">
                                <Book className="w-4 h-4 text-[var(--primary)]" />
                                <span className="text-[10px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase">Squadron Title</span>
                            </div>
                            <p className="text-sm font-bold text-[var(--text)] tracking-widest uppercase truncate">{profile?.class_name || 'NO_ASSIGNMENT'}</p>
                        </div>

                        <div className="p-8 border border-[var(--border-strong)] bg-[var(--background)] group hover:border-[var(--primary)] transition-colors">
                            <div className="flex items-center gap-6 mb-4">
                                <Globe className="w-4 h-4 text-[var(--primary)]" />
                                <span className="text-[10px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase">Cluster Stream</span>
                            </div>
                            <p className="text-sm font-bold text-[var(--text)] tracking-widest uppercase">{profile?.stream || 'N/A'}</p>
                        </div>
                    </div>

                    {/* Operational Summary */}
                    <div className="p-12 border border-[var(--border-strong)] bg-[var(--surface)] relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xs font-black tracking-[0.5em] text-[var(--text)] uppercase italic">System Logs</h3>
                            <Shield className="w-4 h-4 text-[var(--primary)]" />
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-center gap-8">
                                <div className="p-4 border border-[var(--border-strong)] text-[var(--primary)]">
                                    <Clock className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black tracking-widest text-[var(--text-muted)] uppercase">Last Access Sync</p>
                                    <p className="text-xs font-bold text-[var(--text)] uppercase mt-1 tracking-widest">{new Date().toLocaleDateString()} @ {new Date().toLocaleTimeString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8">
                                <div className="p-4 border border-[var(--border-strong)] text-[var(--primary)]">
                                    <Calendar className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black tracking-widest text-[var(--text-muted)] uppercase">Credential Validity</p>
                                    <p className="text-xs font-bold text-[var(--primary)] uppercase mt-1 tracking-[0.3em]">SECURE_SIGNAL</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
