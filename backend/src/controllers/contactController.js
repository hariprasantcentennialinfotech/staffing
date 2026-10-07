const Contact = require('../models/Contact');
const { createTransporter } = require('../utils/mailer');

// @desc    Submit a contact inquiry & send email via SMTP
// @route   POST /api/contact
// @access  Public
exports.submitContact = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email, and message.'
            });
        }

        // 1. Save inquiry to MongoDB database
        const contactDoc = await Contact.create({
            name,
            email,
            phone: phone || '',
            subject: subject || 'General Inquiry',
            message
        });

        // 2. Prepare SMTP Transporter
        let emailSent = false;
        let emailError = null;

        try {
            const transporter = createTransporter();
            const fromName = process.env.MAIL_FROM_NAME || 'Centennial Infotech';
            const fromEmail = process.env.MAIL_USER || 'centennialinfotech@gmail.com';
            const destinationEmail = process.env.MAIL_FROM_EMAIL || 'sales@centennialinfotech.com';

            // Email 1: Notification to the Sales / Admin Team
            await transporter.sendMail({
                from: `"${fromName}" <${fromEmail}>`,
                to: destinationEmail,
                replyTo: email,
                subject: `New Contact Form Inquiry: ${subject || 'Staffing Request'} [From: ${name}]`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded-lg: 8px;">
                        <h2 style="color: #4f46e5; margin-bottom: 20px;">New Message from Career & Staffing Portal</h2>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                            <tr>
                                <td style="padding: 8px; font-weight: bold; width: 140px; color: #64748b;">Full Name:</td>
                                <td style="padding: 8px; color: #0f172a;">${name}</td>
                            </tr>
                            <tr style="background-color: #f8fafc;">
                                <td style="padding: 8px; font-weight: bold; color: #64748b;">Email Address:</td>
                                <td style="padding: 8px; color: #0f172a;"><a href="mailto:${email}">${email}</a></td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; font-weight: bold; color: #64748b;">Phone Number:</td>
                                <td style="padding: 8px; color: #0f172a;">${phone || 'Not provided'}</td>
                            </tr>
                            <tr style="background-color: #f8fafc;">
                                <td style="padding: 8px; font-weight: bold; color: #64748b;">Subject:</td>
                                <td style="padding: 8px; color: #0f172a;">${subject || 'General Inquiry'}</td>
                            </tr>
                        </table>
                        <h3 style="color: #334155; margin-bottom: 10px;">Message:</h3>
                        <div style="background-color: #f1f5f9; padding: 15px; border-radius: 6px; white-space: pre-wrap; color: #1e293b; line-height: 1.5;">
${message}
                        </div>
                        <p style="margin-top: 25px; font-size: 12px; color: #94a3b8; text-align: center;">
                            Centennial Infotech Portal • Timestamp: ${new Date().toLocaleString()}
                        </p>
                    </div>
                `
            });

            // Email 2: Confirmation Receipt to the Client / Applicant
            await transporter.sendMail({
                from: `"${fromName}" <${fromEmail}>`,
                to: email,
                subject: `We received your inquiry - Centennial Infotech`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 8px;">
                        <h2 style="color: #4f46e5; margin-bottom: 15px;">Thank You for Contacting Us, ${name}!</h2>
                        <p style="color: #334155; line-height: 1.6;">
                            We have received your message regarding <strong>"${subject || 'Hiring & Staffing'}"</strong>. Our talent specialists and recruitment leadership will review your note and respond within 24 business hours.
                        </p>
                        <div style="background-color: #f8fafc; border-left: 4px solid #4f46e5; padding: 12px 16px; margin: 20px 0; font-size: 14px; color: #475569;">
                            <strong>Your Message:</strong><br/>
                            ${message}
                        </div>
                        <p style="color: #334155; line-height: 1.6; margin-top: 20px;">
                            For urgent matters, feel free to call our direct line at <strong>+91-81465 11568</strong>.
                        </p>
                        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;" />
                        <p style="font-size: 12px; color: #94a3b8; text-align: center;">
                            Centennial Infotech | Excellence in Hiring &amp; Global IT Staffing<br/>
                            <a href="https://centennialinfotech.com" style="color: #4f46e5;">centennialinfotech.com</a>
                        </p>
                    </div>
                `
            });

            emailSent = true;
        } catch (mailErr) {
            console.error('SMTP Mail Transmission Error:', mailErr.message);
            emailError = mailErr.message;
        }

        return res.status(200).json({
            success: true,
            message: emailSent
                ? 'Your message has been sent successfully! Our team will respond shortly.'
                : 'Your inquiry has been recorded successfully. Our team will contact you soon.',
            emailSent,
            inquiryId: contactDoc._id,
            warning: emailError ? `Email dispatch notice: ${emailError}` : undefined
        });

    } catch (error) {
        console.error('Contact Submission Error:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while processing your message. Please try again.'
        });
    }
};
