const express = require('express');
const router = express.Router();
const {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob,
    getAdminJobs
} = require('../controllers/jobController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public Routes
router.get('/', getJobs);

// Admin Only Routes (MUST be before /:id to avoid param conflict)
router.post('/', protect, adminOnly, createJob);
router.get('/admin/all', protect, adminOnly, getAdminJobs);

// Param Routes (keep last)
router.get('/:id', getJobById);
router.put('/:id', protect, adminOnly, updateJob);
router.delete('/:id', protect, adminOnly, deleteJob);

module.exports = router;
