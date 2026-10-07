import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { Search, MapPin, Briefcase, DollarSign, Calendar, Filter, Loader2, ArrowRight, X, FileText, Send, Clock, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import InrLogo from '../assets/inr-logo.jpg';
import { getJobSlug } from '../utils/slug';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Centralized currency display logic
    const renderCurrencySymbol = (currencyCode, size = 'w-5 h-5') => {
        const code = String(currencyCode || 'INR').trim().toUpperCase();
        if (code === 'INR') {
            return <img src={InrLogo} alt="INR" className={`${size} rounded-full inline-block object-cover border border-slate-100 flex-shrink-0`} />;
        }
        return <span className="text-slate-900 font-black">$</span>;
    };

    const formatLocation = (j) => {
        if (!j) return '';
        const city = (j.location_city || '').trim();
        const state = (j.location_state || '').trim();
        const country = (j.country || '').trim();

        const parts = [];
        if (city) parts.push(city);
        if (state && !city.toLowerCase().includes(state.toLowerCase())) parts.push(state);
        if (country && !city.toLowerCase().includes(country.toLowerCase())) parts.push(country);

        return parts.join(', ') || 'Remote';
    };
    const [keyword, setKeyword] = useState('');
    const [location, setLocation] = useState('');
    const [jobType, setJobType] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [experience, setExperience] = useState('');

    // Application state
    const [selectedJob, setSelectedJob] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [applicationForm, setApplicationForm] = useState({
        resume_url: '',
        cover_letter: '',
        degree: '',
        branch: '',
        university: '',
        experience_years: '',
        current_company: ''
    });
    const [applying, setApplying] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    const fetchJobs = async (customParams = {}) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            const kw = customParams.keyword !== undefined ? customParams.keyword : keyword;
            const loc = customParams.location !== undefined ? customParams.location : location;
            const jt = customParams.jobType !== undefined ? customParams.jobType : jobType;
            const r = customParams.selectedRole !== undefined ? customParams.selectedRole : selectedRole;
            const exp = customParams.experience !== undefined ? customParams.experience : experience;

            if (kw && kw.trim()) params.append('keyword', kw.trim());
            if (loc && loc.trim()) params.append('location', loc.trim());
            if (jt) params.append('job_type', jt);
            if (r) params.append('role', r);
            if (exp) params.append('exp', exp);

            const { data } = await api.get(`/jobs?${params.toString()}&_cb=${Date.now()}`);
            setJobs(data);
        } catch (err) {
            console.error('Failed to fetch jobs', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.title = 'Explore Jobs & Career Opportunities | Centennial Infotech';
        let metaVerification = document.querySelector('meta[name="google-site-verification"]');
        if (!metaVerification) {
            metaVerification = document.createElement('meta');
            metaVerification.setAttribute('name', 'google-site-verification');
            metaVerification.setAttribute('content', 'i_aIkx7-44slNpsexwQNO7cORSNb5jxSLCP938dUElg');
            document.head.appendChild(metaVerification);
        }
        fetchJobs();
    }, [jobType, selectedRole, experience]);

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        fetchJobs();
    };

    const clearFilters = () => {
        setKeyword('');
        setLocation('');
        setJobType('');
        setSelectedRole('');
        setExperience('');
        fetchJobs({ keyword: '', location: '', jobType: '', selectedRole: '', experience: '' });
    };

    const hasActiveFilters = Boolean(keyword || location || jobType || selectedRole || experience);

    const handleApplyClick = async (job) => {
        if (!token) {
            navigate('/login');
            return;
        }
        if (role !== 'user') {
            alert('Only job seekers can apply for jobs.');
            return;
        }

        // Pre-fill form with profile data
        try {
            const { data } = await api.get('/auth/user/profile');
            setApplicationForm(prev => ({
                ...prev,
                resume_url: data.resume_url || '',
                degree: data.degree || '',
                branch: data.branch || '',
                university: data.university || '',
                experience_years: data.experience_years || '',
                current_company: data.current_company || ''
            }));
        } catch (err) {
            console.error('Could not fetch profile for pre-fill', err);
        }

        setSelectedJob(job);
        setShowModal(true);
        setError('');
        setSuccess('');
    };

    const handleApplicationSubmit = async (e) => {
        e.preventDefault();
        setApplying(true);
        setError('');
        try {
            await api.post('/applications', {
                job_id: selectedJob._id,
                ...applicationForm
            });
            setSuccess('Application submitted successfully!');
            setTimeout(() => {
                setShowModal(false);
                setApplicationForm({ resume_url: '', cover_letter: '' });
                setSelectedJob(null);
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit application');
        } finally {
            setApplying(false);
        }
    };

    return (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 pt-32 pb-16">
            {/* Hero Header */}
            <div className="text-center mb-10">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-50 text-primary-600 text-xs font-black uppercase tracking-widest rounded-full mb-6">
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                    Discover Your Next Career Move
                </span>
                <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-4 tracking-tight">
                    Career <span className="text-primary-600">Opportunities</span>
                </h1>
                <p className="text-lg text-slate-500 max-w-xl mx-auto">
                    Where talent learns, grows, and connects with opportunities at Centennial.
                </p>
            </div>

            {/* Search + Filters Row */}
            <form onSubmit={handleSearch} className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow rounded-3xl md:rounded-full p-2.5 flex flex-col md:flex-row items-center gap-2 mb-8 max-w-6xl mx-auto">
                {/* Keyword Search Input */}
                <div className="flex-1 relative w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        className="w-full pl-12 pr-10 py-3 bg-transparent outline-none text-slate-700 font-medium placeholder:text-slate-400"
                        placeholder="Search by role, company, or location..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    {keyword && (
                        <button
                            type="button"
                            onClick={() => {
                                setKeyword('');
                                fetchJobs({ keyword: '' });
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
                            title="Clear search"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <div className="hidden md:block w-px h-8 bg-slate-200"></div>

                {/* Role / Category Filter */}
                <div className="relative w-full md:w-56 border-t md:border-t-0 border-slate-100 pt-2 md:pt-0">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="appearance-none w-full pl-12 pr-8 py-3 bg-transparent outline-none text-slate-700 font-medium cursor-pointer"
                    >
                        {['', 'UI/UX Design', 'Web Development', 'App Development', 'Quality Assurance', 'Software Development', 'IT Consulting'].map((cat) => (
                            <option key={cat} value={cat}>{cat === '' ? 'All Roles' : cat}</option>
                        ))}
                    </select>
                </div>

                <div className="hidden md:block w-px h-8 bg-slate-200"></div>

                {/* Experience Filter */}
                <div className="relative w-full md:w-52 border-t md:border-t-0 border-slate-100 pt-2 md:pt-0">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <select
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="appearance-none w-full pl-12 pr-8 py-3 bg-transparent outline-none text-slate-700 font-medium cursor-pointer"
                    >
                        <option value="">All Experience</option>
                        <option value="0-1">0 - 1 Yrs (Fresher)</option>
                        <option value="1-3">1 - 3 Years</option>
                        <option value="3-5">3 - 5 Years</option>
                        <option value="5+">5+ Years</option>
                    </select>
                </div>

                <div className="hidden md:block w-px h-8 bg-slate-200"></div>

                {/* Job Type Filter */}
                <div className="relative w-full md:w-48 border-t md:border-t-0 border-slate-100 pt-2 md:pt-0">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <select
                        value={jobType}
                        onChange={(e) => setJobType(e.target.value)}
                        className="appearance-none w-full pl-12 pr-8 py-3 bg-transparent outline-none text-slate-700 font-medium capitalize cursor-pointer"
                    >
                        {['', 'full-time', 'part-time', 'internship', 'contract'].map((type) => (
                            <option key={type} value={type}>{type === '' ? 'All Types' : type.replace('-', ' ')}</option>
                        ))}
                    </select>
                </div>

                {/* Search Action Button */}
                <button
                    type="submit"
                    className="w-full md:w-auto px-7 py-3 bg-[#0f629c] hover:bg-[#0c5285] text-white font-bold rounded-2xl md:rounded-full transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer"
                >
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                </button>
            </form>

            {/* Active Filters Bar */}
            {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2 mb-8 max-w-6xl mx-auto px-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Active Filters:</span>
                    {keyword && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
                            Search: &ldquo;{keyword}&rdquo;
                            <button type="button" onClick={() => { setKeyword(''); fetchJobs({ keyword: '' }); }} className="hover:text-red-500 cursor-pointer">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </span>
                    )}
                    {selectedRole && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">
                            Role: {selectedRole}
                            <button type="button" onClick={() => setSelectedRole('')} className="hover:text-red-500 cursor-pointer">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </span>
                    )}
                    {experience && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-full">
                            Exp: {experience === '0-1' ? '0-1 Yrs' : experience === '1-3' ? '1-3 Yrs' : experience === '3-5' ? '3-5 Yrs' : '5+ Yrs'}
                            <button type="button" onClick={() => setExperience('')} className="hover:text-red-500 cursor-pointer">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </span>
                    )}
                    {jobType && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full capitalize">
                            Type: {jobType.replace('-', ' ')}
                            <button type="button" onClick={() => setJobType('')} className="hover:text-red-500 cursor-pointer">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </span>
                    )}
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="inline-flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-700 ml-2 cursor-pointer"
                    >
                        <RotateCcw className="w-3 h-3" />
                        Clear All
                    </button>
                </div>
            )}

            <div>
                {/* Job Listings Grid */}
                <div className="flex-1">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-10 h-10 text-primary-600 animate-spin mb-4" />
                            <p className="text-slate-500 font-medium">Fetching the best opportunities...</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-between items-center mb-6">
                                <p className="text-slate-500 font-medium">{jobs.length} jobs matching your criteria</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                <AnimatePresence>
                                    {jobs.map((job, index) => (
                                        <motion.div
                                            key={job._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary-100 transition-all duration-300 flex flex-col h-full"
                                        >
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                                                    <Briefcase className="w-6 h-6 text-primary-600" />
                                                </div>
                                                <span className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-black rounded-full uppercase tracking-widest border border-slate-100">
                                                    {job.job_type.replace('-', ' ')}
                                                </span>
                                            </div>

                                            <div className="mb-8 flex-1">
                                                <Link to={`/jobs/${getJobSlug(job)}`} className="block mb-2">
                                                    <h2 className="text-xl font-black text-slate-900 group-hover:text-primary-600 transition-colors tracking-tight line-clamp-2">{job.title}</h2>
                                                </Link>
                                                <p className="text-primary-600 text-[11px] font-black uppercase tracking-[0.15em]">{job.company_name}</p>
                                            </div>

                                            <div className="space-y-3 text-sm text-slate-500 font-medium mb-8">
                                                <div className="flex items-center">
                                                    <MapPin className="w-4 h-4 mr-2 text-slate-400 flex-shrink-0" />
                                                    <span className="truncate">{formatLocation(job)}</span>
                                                    <span className="mx-2">•</span>
                                                    <span className="capitalize flex-shrink-0">{job.work_mode}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Clock className="w-4 h-4 mr-2 text-slate-400 flex-shrink-0" />
                                                    <span>
                                                        {job.experience_required !== undefined && job.experience_required !== null && job.experience_required !== ''
                                                            ? (Number(job.experience_required) === 0
                                                                ? 'Fresher / 0 Yrs Exp'
                                                                : `${job.experience_required} Year${Number(job.experience_required) !== 1 ? 's' : ''} Exp`)
                                                            : 'Exp: Any'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center text-slate-900">
                                                    {renderCurrencySymbol(job.currency, 'w-4 h-4 mr-2')}
                                                    <span className="font-bold">{Number(job.salary_min / 1000 || 0).toLocaleString()}k - {Number(job.salary_max / 1000 || 0).toLocaleString()}k</span>
                                                    <span className="text-slate-400 text-xs font-medium ml-1">/ Monthly</span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => navigate(`/jobs/${getJobSlug(job)}`)}
                                                className="w-full py-4 bg-slate-50 text-slate-900 text-[11px] font-black tracking-[0.2em] uppercase rounded-2xl transition-all duration-300 flex items-center justify-center group-hover:bg-primary-50 group-hover:text-primary-700"
                                            >
                                                VIEW DETAILS <ArrowRight className="w-3.5 h-3.5 ml-2" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {jobs.length === 0 && (
                                    <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                                        <p className="text-slate-400">No jobs found matching your search. Try different keywords or location.</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Application Modal */}
            <AnimatePresence>
                {showModal && selectedJob && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">Apply to Position</h2>
                                    <p className="text-primary-600 font-bold text-sm uppercase">{selectedJob.title}</p>
                                </div>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleApplicationSubmit} className="p-8 space-y-4 max-h-[70vh] overflow-y-auto">
                                {error && (
                                    <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium flex items-center">
                                        <X className="w-4 h-4 mr-2" />
                                        {error}
                                    </div>
                                )}
                                {success && (
                                    <div className="p-4 bg-green-50 border border-green-100 text-green-600 rounded-xl text-sm font-medium flex items-center">
                                        <Send className="w-4 h-4 mr-2" />
                                        {success}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-left">Highest Degree</label>
                                        <input
                                            required
                                            className="input-field text-left py-2 px-3"
                                            placeholder="e.g. Master in CS"
                                            value={applicationForm.degree}
                                            onChange={(e) => setApplicationForm({ ...applicationForm, degree: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-left">Branch / Dept</label>
                                        <input
                                            required
                                            className="input-field text-left py-2 px-3"
                                            placeholder="e.g. Computer Science"
                                            value={applicationForm.branch}
                                            onChange={(e) => setApplicationForm({ ...applicationForm, branch: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-left">University</label>
                                        <input
                                            required
                                            className="input-field text-left py-2 px-3"
                                            placeholder="University Name"
                                            value={applicationForm.university}
                                            onChange={(e) => setApplicationForm({ ...applicationForm, university: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-left">Years of Experience</label>
                                        <input
                                            required
                                            type="number"
                                            className="input-field text-left py-2 px-3"
                                            placeholder="0"
                                            value={applicationForm.experience_years}
                                            onChange={(e) => setApplicationForm({ ...applicationForm, experience_years: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-left">Current/Last Company</label>
                                        <input
                                            className="input-field text-left py-2 px-3"
                                            placeholder="Company Name"
                                            value={applicationForm.current_company}
                                            onChange={(e) => setApplicationForm({ ...applicationForm, current_company: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-left">Resume URL</label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-2 w-5 h-5 text-slate-300" />
                                        <input
                                            required
                                            className="input-field pl-11 py-2 px-3 text-left"
                                            placeholder="https://link-to-your-resume.pdf"
                                            value={applicationForm.resume_url}
                                            onChange={(e) => setApplicationForm({ ...applicationForm, resume_url: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-left">Cover Letter (Optional)</label>
                                    <textarea
                                        rows="3"
                                        className="input-field resize-none py-2 px-3 text-left"
                                        placeholder="Why should we hire you?"
                                        value={applicationForm.cover_letter}
                                        onChange={(e) => setApplicationForm({ ...applicationForm, cover_letter: e.target.value })}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={applying || success}
                                    className="w-full btn-primary py-4 text-lg font-bold flex items-center justify-center space-x-2 shadow-xl shadow-primary-200"
                                >
                                    {applying ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                        <>
                                            <span>Submit Application</span>
                                            <Send className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Jobs;

