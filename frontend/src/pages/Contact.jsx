import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, CheckCircle2, MessageSquare, ArrowLeft, Building2, Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [serverMessage, setServerMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        document.title = 'Contact Us | Centennial Infotech';
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');

        try {
            const { data } = await api.post('/contact', formData);
            setServerMessage(data.message || 'Thank you! Your message has been sent successfully.');
            setSubmitted(true);
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });
        } catch (err) {
            console.error('Contact form submission error:', err);
            const msg = err.response?.data?.message || 'Unable to connect to the email service. You can click below to email us directly.';
            setErrorMessage(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleMailtoFallback = () => {
        const mailtoUrl = `mailto:sales@centennialinfotech.com?subject=${encodeURIComponent(
            formData.subject || 'Staffing & Hiring Inquiry'
        )}&body=${encodeURIComponent(
            `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\nMessage:\n${formData.message}`
        )}`;
        window.location.href = mailtoUrl;
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Glows */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary-200/20 rounded-full blur-[150px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-[150px]"></div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Back Link */}
                <Link
                    to="/jobs"
                    className="inline-flex items-center text-slate-500 hover:text-primary-600 font-bold mb-8 transition-colors group text-sm"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Jobs
                </Link>

                {/* Hero Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em] bg-primary-50 text-primary-600 mb-4 border border-primary-100">
                        Get In Touch
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
                        We're Here to Help You Build Your Dream Team
                    </h1>
                    <p className="text-lg text-slate-600 font-medium leading-relaxed">
                        Have questions about our talent solutions, open roles, or custom enterprise staffing? Connect directly with our team.
                    </p>
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-5 gap-8 items-start">
                    {/* Left Column: Direct Contact Info (2 cols) */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-2 space-y-6"
                    >
                        {/* Direct Contacts Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center">
                                <Building2 className="w-5 h-5 mr-3 text-primary-600" />
                                Direct Contact
                            </h2>

                            <div className="space-y-6">
                                {/* Phone */}
                                <a
                                    href="tel:+918146511568"
                                    className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-primary-50/50 transition-colors border border-slate-100 group"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-primary-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-0.5">Call Us</p>
                                        <p className="text-base font-extrabold text-slate-900 group-hover:text-primary-600 transition-colors">
                                            +91-81465 11568
                                        </p>
                                        <p className="text-xs text-slate-500 font-medium mt-0.5">Mon – Sat, 9:00 AM – 7:00 PM IST</p>
                                    </div>
                                </a>

                                {/* Email */}
                                <a
                                    href="mailto:sales@centennialinfotech.com"
                                    className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-primary-50/50 transition-colors border border-slate-100 group"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-0.5">Sales & Inquiries</p>
                                        <p className="text-base font-extrabold text-slate-900 group-hover:text-primary-600 transition-colors truncate">
                                            sales@centennialinfotech.com
                                        </p>
                                        <p className="text-xs text-slate-500 font-medium mt-0.5">We respond within 24 hours</p>
                                    </div>
                                </a>

                                {/* Office Location */}
                                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-0.5">Headquarters</p>
                                        <p className="text-sm font-extrabold text-slate-900">
                                            Centennial Infotech
                                        </p>
                                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                                            Chennai / Bangalore, India &amp; Global Client Delivery
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Info Card */}
                        <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white rounded-3xl p-8 shadow-premium">
                            <h3 className="text-lg font-black mb-2">Looking for custom staffing?</h3>
                            <p className="text-sm text-primary-100 font-medium mb-6 leading-relaxed">
                                Our recruitment consultants specialize in tech, executive search, and offshore development teams.
                            </p>
                            <Link
                                to="/jobs"
                                className="inline-block bg-white text-primary-700 font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider hover:bg-primary-50 transition-colors shadow-sm"
                            >
                                View Open Roles
                            </Link>
                        </div>
                    </motion.div>

                    {/* Right Column: Contact Form (3 cols) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-3 bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100"
                    >
                        <h2 className="text-2xl font-black text-slate-900 mb-2 flex items-center">
                            <MessageSquare className="w-6 h-6 mr-3 text-primary-600" />
                            Send Us a Message
                        </h2>
                        <p className="text-sm text-slate-500 font-medium mb-8">
                            Fill out the form below to send an email directly to our staffing and recruitment team.
                        </p>

                        {submitted ? (
                            <div className="p-8 bg-green-50 rounded-2xl border border-green-200 text-center">
                                <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
                                <h3 className="text-lg font-black text-green-900 mb-2">Message Sent Successfully!</h3>
                                <p className="text-sm text-green-700 font-medium mb-6">
                                    {serverMessage || 'Our recruitment leadership has received your inquiry and will respond within 24 business hours.'}
                                </p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-green-700 transition-colors"
                                >
                                    Send Another Inquiry
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {errorMessage && (
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                        <div className="flex items-center gap-2">
                                            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
                                            <span>{errorMessage}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleMailtoFallback}
                                            className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold whitespace-nowrap hover:bg-red-700 transition-colors"
                                        >
                                            Send via Mail Client
                                        </button>
                                    </div>
                                )}

                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                                            Your Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="John Doe"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium text-slate-800 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="john@example.com"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium text-slate-800 text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="+91 98765 43210"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium text-slate-800 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                                            Subject
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            placeholder="Hiring Inquiry / Partnership"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium text-slate-800 text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                                        Your Message *
                                    </label>
                                    <textarea
                                        required
                                        rows={5}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        placeholder="Tell us about your staffing requirements, open questions, or hiring goals..."
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium text-slate-800 text-sm resize-none"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 px-8 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-300 shadow-md flex items-center justify-center gap-2 group"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Sending Message...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Send Inquiry</span>
                                            <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
