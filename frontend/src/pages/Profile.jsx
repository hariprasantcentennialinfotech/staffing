import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import {
    User, Mail, Phone, MapPin, Building, GraduationCap,
    Calendar, Save, Loader2, CheckCircle2, Plus, X,
    Briefcase, Award, Linkedin, ExternalLink, ArrowLeft, Edit
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProfileField = ({ label, icon: Icon, name, value, onChange, placeholder, type = "text", disabled = false }) => (
    <div className="space-y-2">
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{label}</label>
        <div className="relative group">
            {Icon && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 group-focus-within:text-primary-600 text-slate-300">
                    <Icon className="w-4 h-4" />
                </div>
            )}
            <input
                name={name}
                type={type}
                value={value || ''}
                onChange={onChange}
                disabled={disabled}
                placeholder={placeholder}
                className={`w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 ${Icon ? 'pl-11' : 'px-6'} pr-4 outline-none focus:border-primary-500 focus:bg-white transition-all duration-300 font-bold text-slate-700 disabled:opacity-50`}
            />
        </div>
    </div>
);

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
    <div className="flex items-center space-x-4 mb-8">
        <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 shadow-sm animate-pulse-slow">
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">{title}</h2>
            <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest">{subtitle}</p>
        </div>
    </div>
);

const Profile = () => {
    const [profile, setProfile] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        location_city: '',
        degree: '',
        branch: '',
        specialization: '',
        university: '',
        graduation_year: '',
        experience_years: 0,
        current_company: '',
        current_salary: '',
        expected_salary: '',
        linkedin_url: '',
        skills: []
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [notification, setNotification] = useState(null);
    const [newSkill, setNewSkill] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get('/auth/user/profile');
                setProfile(data);
            } catch (err) {
                console.error('Failed to fetch profile', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setNotification(null);
        try {
            await api.put('/auth/user/profile', profile);
            setNotification({ type: 'success', text: 'Profile updated successfully!' });
            setIsEditing(false);
            setTimeout(() => setNotification(null), 4000);
        } catch (err) {
            setNotification({ type: 'error', text: err.response?.data?.message || 'Synchronization failed' });
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/auth/user/profile');
            setProfile(data);
            setIsEditing(false);
        } catch (err) {
            console.error('Failed to reset profile', err);
        } finally {
            setLoading(false);
        }
    };

    const addSkill = () => {
        if (newSkill && !profile.skills.includes(newSkill)) {
            setProfile(prev => ({ ...prev, skills: [...(prev.skills || []), newSkill] }));
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setProfile(prev => ({
            ...prev,
            skills: (prev.skills || []).filter(s => s !== skillToRemove)
        }));
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
                <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
                <p className="mt-4 font-black text-slate-400 uppercase tracking-widest text-xs">Calibrating Experience...</p>
            </div>
        );
    }

    const joinedDate = profile.createdAt 
        ? new Date(profile.createdAt).toLocaleDateString('en-US') 
        : '8/19/2026';

    return (
        <div className="min-h-screen pt-32 pb-24 px-4 bg-slate-50 relative overflow-hidden">
            {/* Background Decor */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary-200/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent-blue/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
                <AnimatePresence mode="wait">
                    {/* View Mode */}
                    {!isEditing ? (
                        <motion.div
                            key="view"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.25 }}
                        >
                            {/* Navigation controls */}
                            <div className="flex justify-between items-center mb-6">
                                <Link
                                    to="/jobs"
                                    className="flex items-center gap-2 text-slate-500 hover:text-primary-600 font-black text-xs uppercase tracking-[0.2em] transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" /> BACK TO JOBS
                                </Link>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-6 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-700 hover:text-primary-600 hover:border-primary-100 font-black text-sm flex items-center gap-2 transition-all cursor-pointer"
                                >
                                    <Edit className="w-4 h-4" /> Edit Profile
                                </button>
                            </div>

                            {/* Main Card */}
                            <div className="bg-white rounded-[2.5rem] shadow-premium overflow-hidden border border-slate-100 flex flex-col">
                                {/* Blue Header Section */}
                                <div className="h-32 bg-gradient-to-r from-[#0d3c6e] via-[#1a6cbf] to-[#2d9de8] relative rounded-tl-[2.5rem] rounded-tr-[2.5rem]"></div>

                                {/* Card Content */}
                                <div className="px-12 pb-12 relative flex-1 flex flex-col">
                                    {/* Initials Avatar Overlapping Header */}
                                    <div className="relative -mt-16 mb-6">
                                        <div className="w-32 h-32 bg-white rounded-[1.75rem] flex items-center justify-center text-[#0d3c6e] text-3xl font-black shadow-[0_4px_24px_rgba(0,0,0,0.10)] border border-slate-100/60">
                                            {(profile.first_name?.[0] || '').toLowerCase()}{(profile.last_name?.[0] || '').toLowerCase()}
                                        </div>
                                    </div>

                                    {/* Header Details: Name, Status & Contact Grid */}
                                    <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-12">
                                        <div className="flex-1 space-y-4">
                                            <div>
                                                <h1 className="text-3xl font-black text-[#0d2340] tracking-tight flex items-center gap-3" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>
                                                    {profile.first_name?.toLowerCase()} {profile.last_name?.toLowerCase()}
                                                </h1>
                                                <div className="text-[11px] font-black text-[#2d9de8] tracking-[0.18em] flex items-center gap-2 mt-1.5 uppercase">
                                                    <span>Professional Candidate</span>
                                                    <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                                                </div>
                                            </div>

                                            {/* Contact Info Grid */}
                                            <div className="grid md:grid-cols-2 gap-x-8 gap-y-3 text-[#3a4a5c] font-semibold text-sm mt-2">
                                                <div className="flex items-center gap-3">
                                                    <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                    <span>{profile.email}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                    <span>{profile.location_city || 'Not Specified'}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                    <span>{profile.phone || 'Not Specified'}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Linkedin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                    {profile.linkedin_url ? (
                                                        <a
                                                            href={profile.linkedin_url.startsWith('http') ? profile.linkedin_url : `https://${profile.linkedin_url}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-[#2d9de8] hover:underline"
                                                        >
                                                            View LinkedIn Profile
                                                        </a>
                                                    ) : (
                                                        <span>Not Specified</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Executive Summary Card on Right */}
                                        <div className="w-full lg:w-56 bg-[#f5f7fa] border border-slate-200/60 rounded-2xl p-5 flex flex-col gap-4 text-center">
                                            <div className="space-y-0.5">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.18em] block">Executive Summary</span>
                                                <div className="text-4xl font-black text-[#0d2340] leading-none py-1">
                                                    {profile.experience_years || 0}
                                                </div>
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.18em] block">Years Exp.</span>
                                            </div>
                                            <div className="space-y-0.5 border-t border-slate-200 pt-3">
                                                <div className="text-lg font-black text-[#0d2340]">
                                                    {profile.expected_salary ? `₹${profile.expected_salary} LPA` : 'Negotiable'}
                                                </div>
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.18em] block">Exp. Salary</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Core Competencies & Education */}
                                    <div className="grid md:grid-cols-2 gap-12 border-t border-slate-100 pt-10 mb-10 flex-1">
                                        {/* Core Competencies */}
                                        <div className="space-y-5">
                                            <div className="flex items-center gap-2.5">
                                                <Briefcase className="w-4 h-4 text-[#2d9de8]" />
                                                <h2 className="text-[11px] font-black text-[#0d2340] tracking-[0.18em] uppercase">Core Competencies</h2>
                                            </div>
                                            {profile.skills && profile.skills.length > 0 ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {profile.skills.map((skill, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="px-3 py-1.5 bg-slate-50 border border-slate-200/80 text-slate-600 rounded-lg text-xs font-semibold"
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-slate-400 text-sm italic">No skills listed</p>
                                            )}
                                        </div>

                                        {/* Education */}
                                        <div className="space-y-5">
                                            <div className="flex items-center gap-2.5">
                                                <GraduationCap className="w-4 h-4 text-[#2d9de8]" />
                                                <h2 className="text-[11px] font-black text-[#0d2340] tracking-[0.18em] uppercase">Education</h2>
                                            </div>
                                            <div className="bg-slate-50/80 border border-slate-200/60 p-5 rounded-2xl space-y-1.5">
                                                <h3 className="text-sm font-black text-[#0d2340] uppercase tracking-tight">
                                                    {profile.degree || 'Not Specified'}
                                                </h3>
                                                <p className="text-[#2d9de8] text-sm font-semibold">
                                                    {profile.university || 'Centennial Academic Partner'}
                                                </p>
                                                <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-[0.12em] pt-0.5">
                                                    {profile.branch || 'General'}{profile.specialization ? ` · ${profile.specialization}` : ''}{profile.graduation_year ? ` · Class of ${profile.graduation_year}` : ''}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom Info Bar */}
                                    <div className="border-t border-slate-100 pt-8 grid grid-cols-3 gap-4 text-left">
                                        <div>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.18em] block mb-1.5">Current Company</span>
                                            <span className="text-sm font-black text-[#0d2340] block">
                                                {profile.current_company || 'Independent / Freelance'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.18em] block mb-1.5">Current CTC</span>
                                            <span className="text-sm font-black text-[#0d2340] block">
                                                {profile.current_salary ? `₹${profile.current_salary} LPA` : '₹0k Per Annum'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.18em] block mb-1.5">Joined On</span>
                                            <span className="text-sm font-black text-[#0d2340] block">
                                                {joinedDate}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        /* Edit Mode */
                        <motion.div
                            key="edit"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.25 }}
                        >
                            {/* Edit Controls */}
                            <div className="flex justify-between items-center mb-6">
                                <button
                                    onClick={handleCancel}
                                    className="flex items-center gap-2 text-slate-500 hover:text-red-600 font-black text-xs uppercase tracking-[0.2em] transition-colors cursor-pointer"
                                >
                                    <X className="w-4 h-4" /> CANCEL
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="btn-premium btn-premium-primary !px-8 !py-3 flex items-center justify-center gap-3 shadow-glow cursor-pointer"
                                >
                                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4" /> <span>Sync Changes</span></>}
                                </button>
                            </div>

                            {/* Profile Sync Notification */}
                            <AnimatePresence>
                                {notification && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className={`p-6 rounded-[2rem] flex items-center gap-4 mb-6 ${notification.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}
                                    >
                                        {notification.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <X className="w-6 h-6" />}
                                        <span className="font-black tracking-tight">{notification.text}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Form Card */}
                            <div className="glass rounded-[3rem] p-10 md:p-14 shadow-premium border border-white/50 space-y-16 text-left">
                                {/* Identity Section */}
                                <section>
                                    <SectionHeader icon={User} title="Personnel File" subtitle="Legal & Contact Identification" />
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <ProfileField label="First Name" name="first_name" value={profile.first_name} onChange={handleChange} />
                                        <ProfileField label="Last Name" name="last_name" value={profile.last_name} onChange={handleChange} />
                                        <ProfileField label="Direct Phone" icon={Phone} name="phone" value={profile.phone} onChange={handleChange} placeholder="+91..." />
                                        <ProfileField label="Current Headquarters" icon={MapPin} name="location_city" value={profile.location_city} onChange={handleChange} placeholder="City, Country" />
                                        <div className="md:col-span-2">
                                            <ProfileField label="LinkedIn Profile URL" icon={Linkedin} name="linkedin_url" value={profile.linkedin_url} onChange={handleChange} placeholder="https://linkedin.com/in/yourprofile" />
                                        </div>
                                    </div>
                                </section>

                                {/* Education Section */}
                                <section>
                                    <SectionHeader icon={GraduationCap} title="Academic Foundation" subtitle="Educational Background & Branch" />
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="md:col-span-2">
                                            <ProfileField label="Primary Institution" icon={Building} name="university" value={profile.university} onChange={handleChange} placeholder="Massachusetts Institute of Technology" />
                                        </div>
                                        <ProfileField label="Degree Earned" name="degree" value={profile.degree} onChange={handleChange} placeholder="e.g. Bachelor of Engineering" />
                                        <ProfileField label="Branch / Department" name="branch" value={profile.branch} onChange={handleChange} placeholder="e.g. Computer Science & Engineering" />
                                        <ProfileField label="Specialization" name="specialization" value={profile.specialization} onChange={handleChange} placeholder="e.g. Software Systems" />
                                        <ProfileField label="Passing Cycle" icon={Calendar} name="graduation_year" type="number" value={profile.graduation_year} onChange={handleChange} placeholder="2024" />
                                    </div>
                                </section>

                                {/* Career Section */}
                                <section>
                                    <SectionHeader icon={Briefcase} title="Professional Trajectory" subtitle="Work Experience & Impact" />
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <ProfileField label="Industry Tenure (Years)" name="experience_years" type="number" value={profile.experience_years} onChange={handleChange} />
                                        <ProfileField label="Current Organization" icon={Building} name="current_company" value={profile.current_company} onChange={handleChange} placeholder="Hyperion Tech Inc." />
                                        <ProfileField label="Current CTC (LPA)" name="current_salary" type="number" value={profile.current_salary} onChange={handleChange} placeholder="e.g. 8" />
                                        <ProfileField label="Expected Salary (LPA)" name="expected_salary" type="number" value={profile.expected_salary} onChange={handleChange} placeholder="e.g. 12" />
                                    </div>
                                </section>

                                {/* Skills Section */}
                                <section>
                                    <SectionHeader icon={Award} title="Skills & Core Competencies" subtitle="Add or remove technical skills" />
                                    <div>
                                        <div className="flex flex-wrap gap-2.5 mb-6">
                                            <AnimatePresence>
                                                {(profile.skills || []).map((skill, idx) => (
                                                    <motion.span
                                                        key={idx}
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.8 }}
                                                        className="px-4 py-2 bg-white border border-slate-100 text-slate-700 rounded-2xl text-xs font-black flex items-center gap-2 shadow-sm group hover:border-primary-200 transition-colors"
                                                    >
                                                        {skill}
                                                        <X
                                                            className="w-3.5 h-3.5 cursor-pointer text-slate-300 hover:text-red-500 transition-colors"
                                                            onClick={() => removeSkill(skill)}
                                                        />
                                                    </motion.span>
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                        <div className="relative group max-w-md">
                                            <input
                                                value={newSkill}
                                                onChange={(e) => setNewSkill(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault() || addSkill())}
                                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-6 pr-14 outline-none focus:border-primary-500 font-bold text-sm transition-all text-left"
                                                placeholder="Add a technical skill..."
                                            />
                                            <button
                                                type="button"
                                                onClick={addSkill}
                                                className="absolute right-3 top-2 w-10 h-10 bg-primary-600 text-white rounded-xl flex items-center justify-center shadow-glow hover:scale-105 transition-transform"
                                            >
                                                <Plus className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Profile;
