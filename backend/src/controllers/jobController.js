const Job = require('../models/Job');
const Company = require('../models/Company');
const Skill = require('../models/Skill');

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private/Admin
exports.createJob = async (req, res) => {
    try {
        const {
            job_id, title, role, company_id, company_name, description,
            requirements, responsibilities, salary_min, salary_max, currency,
            experience_required, job_type, work_mode, location_city,
            location_state, country, openings_count, application_deadline,
            status, skills_required
        } = req.body;

        // Handle arrays (split strings if they come from textarea)
        const parseArray = (input) => {
            if (Array.isArray(input)) return input;
            if (typeof input === 'string') {
                return input.split('\n').map(s => s.trim()).filter(s => s !== '');
            }
            return [];
        };

        const generateSlug = (title) => {
            if (!title) return '';
            return title.trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
        };

        const job = await Job.create({
            job_id,
            title,
            slug: generateSlug(title),
            role,
            company_id,
            company_name,
            posted_by_admin_id: req.user._id, // From auth middleware
            description,
            requirements: parseArray(requirements),
            responsibilities: parseArray(responsibilities),
            salary_min,
            salary_max,
            currency,
            experience_required,
            job_type,
            work_mode,
            location_city,
            location_state,
            country,
            openings_count,
            application_deadline,
            status: status || 'draft',
            skills_required
        });

        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all open jobs (for users)
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res) => {
    try {
        const { keyword, location, job_type, work_mode, role, exp, experience } = req.query;

        const andConditions = [{ status: 'open' }];

        // Keyword search across title, company, role, location, description, and skills
        if (keyword && keyword.trim()) {
            const trimmedKeyword = keyword.trim();
            const regex = { $regex: trimmedKeyword, $options: 'i' };

            // Find matching company IDs if any
            const matchingCompanies = await Company.find({ name: regex }).select('_id');
            const companyIds = matchingCompanies.map(c => c._id);

            // Find matching skill IDs if any
            const matchingSkills = await Skill.find({ skill_name: regex }).select('_id');
            const skillIds = matchingSkills.map(s => s._id);

            const keywordOr = [
                { title: regex },
                { company_name: regex },
                { role: regex },
                { location_city: regex },
                { location_state: regex },
                { country: regex },
                { description: regex }
            ];

            if (companyIds.length > 0) {
                keywordOr.push({ company_id: { $in: companyIds } });
            }
            if (skillIds.length > 0) {
                keywordOr.push({ skills_required: { $in: skillIds } });
            }

            andConditions.push({ $or: keywordOr });
        }

        // Dedicated Location filter (if passed explicitly)
        if (location && location.trim()) {
            const locRegex = { $regex: location.trim(), $options: 'i' };
            andConditions.push({
                $or: [
                    { location_city: locRegex },
                    { location_state: locRegex },
                    { country: locRegex }
                ]
            });
        }

        // Job Type filter
        if (job_type) {
            andConditions.push({ job_type });
        }

        // Work Mode filter
        if (work_mode) {
            andConditions.push({ work_mode });
        }

        // Role filter
        if (role) {
            andConditions.push({ role });
        }

        // Experience filter (supports '0-1', '1-3', '3-5', '5+' or numbers)
        const expFilter = exp || experience;
        if (expFilter && expFilter !== 'all' && expFilter !== '') {
            if (expFilter === '0-1' || expFilter === 'fresher') {
                andConditions.push({
                    $or: [
                        { experience_required: { $lte: 1 } },
                        { experience_required: null },
                        { experience_required: { $exists: false } }
                    ]
                });
            } else if (expFilter === '1-3') {
                andConditions.push({ experience_required: { $gte: 1, $lte: 3 } });
            } else if (expFilter === '3-5') {
                andConditions.push({ experience_required: { $gte: 3, $lte: 5 } });
            } else if (expFilter === '5+' || expFilter === '5plus') {
                andConditions.push({ experience_required: { $gte: 5 } });
            } else if (!isNaN(Number(expFilter))) {
                andConditions.push({ experience_required: { $lte: Number(expFilter) } });
            }
        }

        const query = andConditions.length > 1 ? { $and: andConditions } : andConditions[0];

        const jobs = await Job.find(query)
            .populate('company_id', 'name logo')
            .populate('skills_required', 'skill_name')
            .sort({ createdAt: -1 });

        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get job by ID or Title Slug
// @route   GET /api/jobs/:id
// @access  Public
exports.getJobById = async (req, res) => {
    try {
        const identifier = decodeURIComponent(req.params.id).trim();
        const mongoose = require('mongoose');

        let job = null;

        // 1. Try finding by MongoDB ObjectId if valid
        if (mongoose.Types.ObjectId.isValid(identifier)) {
            job = await Job.findById(identifier)
                .populate('company_id')
                .populate('skills_required');
        }

        // 2. Try finding by unique job_id (e.g. JOB1001)
        if (!job) {
            job = await Job.findOne({ job_id: identifier })
                .populate('company_id')
                .populate('skills_required');
        }

        // 3. Try finding by stored slug (case-insensitive)
        if (!job) {
            job = await Job.findOne({
                slug: new RegExp('^' + identifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i')
            })
                .populate('company_id')
                .populate('skills_required');
        }

        // 4. Try finding by title matching slug pattern (e.g. "Junior-Data-Analyst" -> "Junior Data Analyst")
        if (!job) {
            const titleFromName = identifier.replace(/[-_]+/g, ' ').trim();
            job = await Job.findOne({
                title: new RegExp('^' + titleFromName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i')
            })
                .populate('company_id')
                .populate('skills_required');
        }

        // 5. Fallback title search with loose regex
        if (!job) {
            const titleFromName = identifier.replace(/[-_]+/g, ' ').trim();
            job = await Job.findOne({
                title: { $regex: titleFromName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' }
            })
                .populate('company_id')
                .populate('skills_required');
        }

        if (job) {
            res.json(job);
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private/Admin
exports.updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (job) {
            console.log('Update Request Body:', JSON.stringify(req.body, null, 2));

            // Handle arrays (split strings if they come from textarea)
            const parseArray = (input) => {
                if (Array.isArray(input)) return input;
                if (typeof input === 'string') {
                    return input.split('\n').map(s => s.trim()).filter(s => s !== '');
                }
                return [];
            };

            const generateSlug = (title) => {
                if (!title) return '';
                return title.trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
            };

            const updateData = {
                ...req.body,
                requirements: parseArray(req.body.requirements),
                responsibilities: parseArray(req.body.responsibilities),
                ...(req.body.title ? { slug: generateSlug(req.body.title) } : {}),
                // Explicitly sanitize and fallback to existing only if truly missing
                currency: (req.body.currency && typeof req.body.currency === 'string')
                    ? req.body.currency.trim().toUpperCase()
                    : (job.currency || 'INR')
            };

            console.log('Computed Update Data:', JSON.stringify(updateData, null, 2));

            const updatedJob = await Job.findByIdAndUpdate(
                req.params.id,
                updateData,
                { new: true, runValidators: true }
            );

            console.log('Job Updated Successfully:', updatedJob._id);
            res.json(updatedJob);
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private/Admin
exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (job) {
            await job.deleteOne();
            res.json({ message: 'Job removed' });
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all jobs (including drafts/closed) for Admin
// @route   GET /api/jobs/admin/all
// @access  Private/Admin
exports.getAdminJobs = async (req, res) => {
    try {
        const mongoose = require('mongoose');
        const jobs = await Job.aggregate([
            { $match: { posted_by_admin_id: new mongoose.Types.ObjectId(req.user._id) } },
            {
                $lookup: {
                    from: 'applications',
                    localField: '_id',
                    foreignField: 'job_id',
                    as: 'applications'
                }
            },
            {
                $addFields: {
                    applicationCount: { $size: '$applications' }
                }
            },
            { $project: { applications: 0 } },
            { $sort: { createdAt: -1 } }
        ]);
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
