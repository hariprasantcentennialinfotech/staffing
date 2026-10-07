const express = require('express');
const router = express.Router();
const {
    applyToJob,
    getMyApplications,
    getJobApplications,
    updateApplicationStatus,
    getApplicationById
} = require('../controllers/applicationController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// User routes (MUST be before /:id to avoid param conflict)
router.get('/my/all', protect, getMyApplications);

// Admin routes (MUST be before /:id to avoid param conflict)
router.get('/job/:jobId', protect, adminOnly, getJobApplications);
router.put('/:id/status', protect, adminOnly, updateApplicationStatus);

// User routes
router.post('/', protect, applyToJob);

// Shared routes (keep last — catches any :id)
router.get('/:id', protect, getApplicationById);

module.exports = router;
