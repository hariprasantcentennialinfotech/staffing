const User = require('../models/User');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// Generate Token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/user/signup
// @access  Public
exports.registerUser = async (req, res) => {
    try {
        const { first_name, last_name, email, phone, password, location_city } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            first_name,
            last_name,
            email,
            phone,
            password, // Hashed by pre-save hook
            location_city
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: `${user.first_name} ${user.last_name}`,
                email: user.email,
                token: generateToken(user._id, 'user'),
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/user/login
// @access  Public
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: `${user.first_name} ${user.last_name}`,
                email: user.email,
                token: generateToken(user._id, 'user'),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Register a new admin
// @route   POST /api/auth/admin/signup
// @access  Public
exports.registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const adminExists = await Admin.findOne({ email });
        if (adminExists) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const admin = await Admin.create({
            name,
            email,
            password // Hashed by pre-save hook
        });

        if (admin) {
            res.status(201).json({
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                token: generateToken(admin._id, 'admin'),
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate admin & get token
// @route   POST /api/auth/admin/login
// @access  Public
exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });

        if (admin && (await admin.matchPassword(password))) {
            res.json({
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                token: generateToken(admin._id, 'admin'),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/user/profile
// @access  Private
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/user/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            const fieldsToUpdate = [
                'first_name', 'last_name', 'phone', 'location_city', 'location_state',
                'country', 'degree', 'branch', 'specialization', 'university',
                'graduation_year', 'experience_years', 'current_company',
                'current_salary', 'expected_salary', 'resume_url', 'linkedin_url', 'skills'
            ];

            fieldsToUpdate.forEach(field => {
                if (req.body[field] !== undefined) {
                    user[field] = req.body[field];
                }
            });

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                first_name: updatedUser.first_name,
                last_name: updatedUser.last_name,
                name: `${updatedUser.first_name} ${updatedUser.last_name}`,
                email: updatedUser.email,
                phone: updatedUser.phone,
                location_city: updatedUser.location_city,
                degree: updatedUser.degree,
                branch: updatedUser.branch,
                specialization: updatedUser.specialization,
                university: updatedUser.university,
                graduation_year: updatedUser.graduation_year,
                experience_years: updatedUser.experience_years,
                current_company: updatedUser.current_company,
                skills: updatedUser.skills,
                token: generateToken(updatedUser._id, 'user'),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ message: error.message });
    }
};// @desc    Get user profile by ID (Admin only)
// @route   GET /api/auth/user/:id
// @access  Private/Admin
exports.getUserProfileById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
