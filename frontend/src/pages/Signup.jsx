import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import {
    User,
    Mail,
    Phone,
    Lock,
    Sparkles,
    AlertCircle,
    Loader2,
    CheckCircle2,
    Eye,
    EyeOff,
    ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const Signup = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await api.post(
                '/auth/user/signup',
                formData
            );

            localStorage.setItem('token', data.token);
            localStorage.setItem('role', 'user');
            localStorage.setItem('name', data.name);

            navigate('/jobs');
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Failed to create account. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 bg-slate-50 flex items-center justify-center">

            {/* Background */}
            <div className="fixed inset-0 overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-cyan-200/20 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-6xl w-full relative z-10"
            >

                <div className="grid lg:grid-cols-2 bg-white rounded-[2.5rem] overflow-hidden shadow-premium">

                    {/* ================= LEFT PANEL ================= */}
                    <div className="hidden lg:flex flex-col justify-between p-16 bg-gradient-to-br from-[#08679d] via-[#0874b5] to-[#2778dc] text-white relative overflow-hidden">

                        {/* Decorative circles */}
                        <div className="absolute top-[-100px] right-[-100px] w-[350px] h-[350px] rounded-full bg-white/10" />
                        <div className="absolute bottom-[-120px] left-[-100px] w-[350px] h-[350px] rounded-full bg-cyan-400/10" />

                        <div className="relative z-10">

                            <div className="p-4 bg-white/10 border border-white/20 rounded-2xl w-fit mb-12">
                                <Sparkles className="w-10 h-10 text-cyan-300" />
                            </div>

                            <h1 className="text-5xl font-black leading-[1.1] tracking-tight">
                                Start Your
                                <br />
                                <span className="text-cyan-400">
                                    Centennial
                                </span>
                                <br />
                                Journey
                            </h1>

                            <p className="mt-8 text-white/85 text-lg leading-relaxed font-medium max-w-md">
                                Create your account to discover opportunities,
                                apply for jobs, and build your career with
                                Centennial Talent Solutions.
                            </p>

                            <div className="mt-12 space-y-6">

                                <div className="flex items-center gap-4">
                                    <div className="w-9 h-9 rounded-full bg-cyan-400/20 border border-cyan-300/40 flex items-center justify-center">
                                        <CheckCircle2 className="w-5 h-5 text-cyan-300" />
                                    </div>
                                    <span className="font-bold">
                                        Personalized job opportunities
                                    </span>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-9 h-9 rounded-full bg-cyan-400/20 border border-cyan-300/40 flex items-center justify-center">
                                        <CheckCircle2 className="w-5 h-5 text-cyan-300" />
                                    </div>
                                    <span className="font-bold">
                                        Easy application tracking
                                    </span>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-9 h-9 rounded-full bg-cyan-400/20 border border-cyan-300/40 flex items-center justify-center">
                                        <CheckCircle2 className="w-5 h-5 text-cyan-300" />
                                    </div>
                                    <span className="font-bold">
                                        Connect with global opportunities
                                    </span>
                                </div>

                            </div>
                        </div>

                        <div className="relative z-10 pt-8 mt-12 border-t border-white/20">
                            <p className="text-white/60 text-xs font-bold uppercase tracking-[0.25em]">
                                Powered by
                            </p>

                            <p className="text-xl font-black mt-2">
                                Centennial{' '}
                                <span className="text-cyan-400">
                                    Talent Solutions
                                </span>
                            </p>
                        </div>

                    </div>

                    {/* ================= RIGHT PANEL ================= */}
                    <div className="p-8 md:p-14 lg:p-16">

                        <div className="mb-8">

                            <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                                Create Account
                            </h2>

                            <p className="text-slate-500 mt-3 font-medium">
                                Create your candidate account
                            </p>

                        </div>

                        {/* Error */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.97 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mb-6 flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-xl border border-red-100"
                            >
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <span className="text-sm font-bold">
                                    {error}
                                </span>
                            </motion.div>
                        )}

                        <form
                            onSubmit={handleSignup}
                            className="space-y-5"
                        >

                            {/* First + Last Name */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                                        First Name
                                    </label>

                                    <div className="relative">

                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                                        <input
                                            name="first_name"
                                            type="text"
                                            required
                                            value={formData.first_name}
                                            onChange={handleChange}
                                            placeholder="Jane"
                                            className="w-full bg-white border-2 border-slate-100 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-primary-500 transition-all font-medium"
                                        />

                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                                        Last Name
                                    </label>

                                    <input
                                        name="last_name"
                                        type="text"
                                        required
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        placeholder="Doe"
                                        className="w-full bg-white border-2 border-slate-100 rounded-xl py-4 px-4 outline-none focus:border-primary-500 transition-all font-medium"
                                    />
                                </div>

                            </div>

                            {/* Email */}
                            <div>

                                <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                                    Email Address
                                </label>

                                <div className="relative">

                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="jane@example.com"
                                        className="w-full bg-white border-2 border-slate-100 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-primary-500 transition-all font-medium"
                                    />

                                </div>

                            </div>

                            {/* Phone */}
                            <div>

                                <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                                    Phone Number
                                </label>

                                <div className="relative">

                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                                    <input
                                        name="phone"
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+91 9876543210"
                                        className="w-full bg-white border-2 border-slate-100 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-primary-500 transition-all font-medium"
                                    />

                                </div>

                            </div>

                            {/* Password */}
                            <div>

                                <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                                    Password
                                </label>

                                <div className="relative">

                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                                    <input
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="w-full bg-white border-2 border-slate-100 rounded-xl py-4 pl-12 pr-12 outline-none focus:border-primary-500 transition-all font-medium"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-600"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>

                                </div>

                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-premium btn-premium-primary py-4 mt-3 group"
                            >

                                {loading ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        <span>Create Account</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                )}

                            </button>

                        </form>

                        {/* Login */}
                        <div className="mt-8 text-center">

                            <p className="text-slate-500 font-medium">
                                Already have an account?{' '}

                                <Link
                                    to="/login"
                                    className="text-primary-600 font-black hover:text-blue-700 underline decoration-2 underline-offset-4"
                                >
                                    Sign In
                                </Link>
                            </p>

                        </div>

                    </div>

                </div>

            </motion.div>

        </div>
    );
};

export default Signup;