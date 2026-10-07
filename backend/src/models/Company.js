const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: { type: String, required: true },
    logo: String,
    website: String,
    description: String,
    industry: String,
    size: String,
    headquarters: String
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
