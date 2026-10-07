import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Lock, AlertCircle, Loader2, ArrowRight, Eye, EyeOff, User, Shield, BarChart2, Users, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../logo-centennial.png';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showCookies, setShowCookies] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Show cookie popup if not already accepted
        const cookiesAccepted = localStorage.getItem('adminCookiesAccepted');
        if (!cookiesAccepted) {
            setTimeout(() => setShowCookies(true), 600);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('adminCookiesAccepted', 'true');
        setShowCookies(false);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await api.post('/auth/admin/login', { email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', 'admin');
            localStorage.setItem('name', data.name);
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const features = [
        { icon: Shield, text: 'Manage whole hiring pipeline' },
        { icon: BarChart2, text: 'Real-time applicant analytics' },
        { icon: Users, text: 'Collaborative hiring tools' },
    ];

    return (
        <div className="min-h-screen bg-[#0d1b2e] flex items-center justify-center px-4 py-16 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary-900/30 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#0e3a5e]/40 rounded-full blur-[120px]"></div>
            </div>

            {/* Cookie Consent Popup */}
            <AnimatePresence>
                {showCookies && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#1565a0] rounded-[2rem] p-8 max-w-sm w-full shadow-2xl relative text-center"
                        >
                            <button
                                onClick={() => setShowCookies(false)}
                                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <h2 className="text-2xl font-black text-white mb-4 leading-tight">
                                Centennial Infotech and Cookies
                            </h2>
                            <p className="text-white/80 text-sm leading-relaxed mb-8">
                                This platform uses cookies. By clicking Accept or continuing to use the platform, you agree to our use of cookies.
                            </p>
                            <div className="space-y-3">
                                <button
                                    onClick={acceptCookies}
                                    className="w-full py-4 bg-white text-[#1565a0] font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-50 transition-colors"
                                >
                                    Accept All Cookies
                                </button>
                                <button
                                    onClick={() => setShowCookies(false)}
                                    className="w-full py-4 bg-white/10 border border-white/20 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-white/20 transition-colors"
                                >
                                    Later
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Card */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-5xl"
            >
                <div className="grid lg:grid-cols-2 rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10">
                    {/* Left Panel */}
                    <div className="bg-[#112240] p-12 flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

                        <div className="relative z-10">
                            {/* Lock icon */}
                            <div className="w-16 h-16 bg-slate-700/60 rounded-2xl flex items-center justify-center mb-10 border border-white/10">
                                <Lock className="w-8 h-8 text-accent-cyan" />
                            </div>

                            <h1 className="text-5xl font-black text-white leading-[1.1] tracking-tight mb-8">
                                Recruiter<br />
                                <span className="text-accent-cyan">Control Center</span>
                            </h1>

                            <p className="text-slate-400 text-base leading-relaxed mb-10">
                                Access the powerful suite of tools to manage job postings, track applications, and build your dream team.
                            </p>

                            <div className="space-y-5">
                                {features.map(({ icon: Icon, text }, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + i * 0.1 }}
                                        className="flex items-center gap-4"
                                    >
                                        <div className="w-6 h-6 rounded-full border-2 border-accent-cyan flex items-center justify-center flex-shrink-0">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-accent-cyan" />
                                        </div>
                                        <span className="text-slate-300 font-semibold text-sm">{text}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div className="relative z-10 pt-10 border-t border-white/10 mt-10">
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Enterprise Management</p>
                            <div className="flex items-center gap-3">
                                <img src={logo} alt="Centennial" className="h-8 w-auto object-contain brightness-0 invert opacity-80" />
                                <span className="text-white font-black text-lg">Centennial <span className="text-accent-cyan">Infotech</span></span>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Login Form */}
                    <div className="bg-[#0d1b2e] p-12 flex flex-col justify-center">
                        <div className="mb-10">
                            <h2 className="text-3xl font-black text-white tracking-tight">Recruiter Access</h2>
                            <p className="text-slate-400 mt-2 text-sm font-medium">Enter your credentials to continue</p>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="mb-6 flex items-center gap-3 text-red-400 bg-red-900/20 p-4 rounded-2xl border border-red-900/30"
                                >
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <span className="text-sm font-bold">{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Recruiter ID / Email</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent-cyan transition-colors">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-slate-800/60 border-2 border-slate-700 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-accent-cyan text-white font-medium transition-all duration-300 placeholder:text-slate-600"
                                        placeholder="Centennial Infotech"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Secure Password</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent-cyan transition-colors">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        className="w-full bg-slate-800/60 border-2 border-slate-700 rounded-2xl py-4 pl-12 pr-12 outline-none focus:border-accent-cyan text-white font-medium transition-all duration-300 placeholder:text-slate-600"
                                        placeholder="••••••••••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-accent-cyan transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-accent-cyan text-[#0d1b2e] font-black text-sm uppercase tracking-[0.2em] rounded-2xl hover:brightness-110 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-cyan-500/20 mt-2"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <span>Enter Dashboard</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
