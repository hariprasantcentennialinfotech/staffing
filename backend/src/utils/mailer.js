const nodemailer = require('nodemailer');

const createTransporter = () => {
    const rawPass = (process.env.MAIL_PASS || '').replace(/^"|"$/g, '').trim();
    const cleanPass = rawPass.replace(/\s+/g, '');

    const isGmail = (process.env.MAIL_HOST || '').includes('gmail') || !process.env.MAIL_HOST;

    const config = {
        host: process.env.MAIL_HOST || 'smtp.gmail.com',
        port: Number(process.env.MAIL_PORT) || 587,
        secure: process.env.MAIL_SECURE === 'true',
        auth: {
            user: process.env.MAIL_USER,
            pass: cleanPass || rawPass
        },
        tls: {
            rejectUnauthorized: false
        }
    };

    if (isGmail) {
        config.service = 'gmail';
    }

    return nodemailer.createTransport(config);
};

module.exports = { createTransporter };
