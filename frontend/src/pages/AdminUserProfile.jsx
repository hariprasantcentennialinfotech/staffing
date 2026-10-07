import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import {
    User, Mail, Phone, MapPin, Building, GraduationCap,
    Calendar, ArrowLeft, Loader2, Award, Briefcase, Linkedin, Globe, FileText, Users
} from 'lucide-react';
import { motion } from 'framer-motion';

const ProfileInfoField = ({ label, icon: Icon, value, placeholder }) => (
    <div className="space-y-2">
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{label}</label>
        <div className="flex items-center gap-4 bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 px-6 group transition-colors hover:border-primary-100">
            <div className="text-slate-300 group-hover:text-primary-600 transition-colors">
                {Icon && <Icon className="w-4 h-4" />}
            </div>
            <p className="font-bold text-slate-700">{value || placeholder || 'Not Specified'}</p>
        </div>
    </div>
);

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
    <div className="flex items-center space-x-4 mb-8 text-left">
        <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 shadow-sm">
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none">{title}</h2>
            <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest">{subtitle}</p>
        </div>
    </div>
);

const AdminUserProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const { data } = await api.get(`/auth/user/${id}`);
                setUser(data);
            } catch (err) {
                console.error('Failed to fetch user profile', err);
            } finally {
                setLoading(false);
            }
        };
        fetchUserProfile();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
                <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
                <p className="mt-4 font-black text-slate-400 uppercase tracking-widest text-xs">Fetching Intelligence File...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-center px-4">
                <div className="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mb-6">
                    <User className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-2">Subject Not Found</h2>
                <p className="text-slate-500 font-bold mb-8">The requested intelligence dossier could not be located.</p>
                <button onClick={() => navigate(-1)} className="btn-premium btn-premium-primary !px-10">Return to Base</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-24 px-4 bg-slate-50 relative overflow-hidden">
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary-200/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent-blue/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Navigation */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-8 flex items-center gap-2 text-slate-400 hover:text-primary-600 font-black uppercase tracking-widest text-xs transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Applicants
                </button>

                {/* Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-[3rem] p-8 md:p-12 mb-12 shadow-premium flex flex-col md:flex-row items-center gap-10 border border-white/50 text-left"
                >
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-primary-600 to-accent-blue rounded-[2.5rem] flex items-center justify-center text-white text-5xl md:text-6xl font-black shadow-glow">
                        {user.first_name?.[0]}{user.last_name?.[0]}
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-primary-50 rounded-full text-primary-700 text-[10px] font-black uppercase tracking-widest mb-4">
                            <span className="flex h-2 w-2 rounded-full bg-primary-500"></span>
                            <span>Applicant Dossier: {user._id.substring(0, 8)}</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-3">
                            {user.first_name} <span className="text-primary-600">{user.last_name}</span>
                        </h1>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-400 font-bold text-sm">
                            <div className="flex items-center"><Mail className="w-4 h-4 mr-2" /> {user.email}</div>
                            <div className="hidden md:block w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
                            <div className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> {user.location_city || 'Not Specified'}</div>
                        </div>
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Skills & Metrics Sidebar */}
                    <div className="lg:col-span-1 space-y-12 text-left">
                        <div className="glass rounded-[2.5rem] p-10 shadow-premium border border-white/50">
                            <SectionHeader icon={Award} title="Core Intelligence" subtitle="Acquired Skills" />
                            <div className="flex flex-wrap gap-2.5">
                                {user.skills && user.skills.length > 0 ? (
                                    user.skills.map((skill, idx) => (
                                        <span key={idx} className="px-4 py-2 bg-white border border-slate-100 text-slate-700 rounded-2xl text-xs font-black shadow-sm">
                                            {skill.skill_name || skill}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-slate-400 italic font-bold">No skills listed</p>
                                )}
                            </div>
                        </div>

                        {user.linkedin_url && (
                            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
                                <h3 className="text-xl font-black mb-6 relative z-10">External Network</h3>
                                <a
                                    href={user.linkedin_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="relative z-10 btn-premium btn-premium-primary !bg-white !text-slate-900 !py-3 flex items-center justify-center gap-2 group"
                                >
                                    <Linkedin className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    <span>View LinkedIn</span>
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Main Content Details */}
                    <div className="lg:col-span-2 space-y-12">
                        <div className="glass rounded-[3rem] p-10 md:p-14 shadow-premium border border-white/50 space-y-16 text-left">
                            <section>
                                <SectionHeader icon={Users} title="Personnel Profile" subtitle="Identity Context" />
                                <div className="grid md:grid-cols-2 gap-8">
                                    <ProfileInfoField label="First Name" value={user.first_name} />
                                    <ProfileInfoField label="Last Name" value={user.last_name} />
                                    <ProfileInfoField label="Phone Contact" icon={Phone} value={user.phone} />
                                    <ProfileInfoField label="Current Registry" icon={MapPin} value={user.location_city} />
                                </div>
                            </section>

                            <section>
                                <SectionHeader icon={GraduationCap} title="Academic Foundation" subtitle="Institutional Logic" />
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="md:col-span-2">
                                        <ProfileInfoField label="Primary Institution" icon={Building} value={user.university} />
                                    </div>
                                    <ProfileInfoField label="Degree Attained" value={user.degree} />
                                    <ProfileInfoField label="Functional Branch" value={user.branch} />
                                    <ProfileInfoField label="Specialization" value={user.specialization} />
                                    <ProfileInfoField label="Passout Cycle" icon={Calendar} value={user.graduation_year} />
                                </div>
                            </section>

                            <section>
                                <SectionHeader icon={Briefcase} title="Professional Trajectory" subtitle="Work History & Compensation" />
                                <div className="grid md:grid-cols-2 gap-8">
                                    <ProfileInfoField label="Industry Tenure (Years)" value={user.experience_years} />
                                    <ProfileInfoField label="Current Organization" icon={Building} value={user.current_company} />
                                    <ProfileInfoField label="Current CTC" value={user.current_salary ? `₹${user.current_salary.toLocaleString()}` : 'Not Shared'} />
                                    <ProfileInfoField label="Expected CTC" value={user.expected_salary ? `₹${user.expected_salary.toLocaleString()}` : 'Not Shared'} />
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUserProfile;
