const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    skill_name: { type: String, required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema);
