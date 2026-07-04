import nodemailer from 'nodemailer';
import dotenv from 'dotenv';


dotenv.config();

/**
 * Configure SMTP Transporter.
 * Uses environment variables for security and portability.
 */
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: parseInt(process.env.SMTP_PORT) || 2525, // Parsed to integer for reliability
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

/**
 * Utility to send email notifications.
 * @param {string} toEmail - Recipient email address
 * @param {string} subject - Email subject line
 * @param {string} text - Plain text body content
 */
export const sendNotification = async (toEmail, subject, text) => {
    try {
        const mailOptions = {
            from: '"Rent Finder System" <no-reply@rentfinder.com>',
            to: toEmail,
            subject: subject,
            text: text,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Notification email successfully sent: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
        
    } catch (error) {
        console.error("Email Notification Failed:", error.message);
        // We do not throw here to allow the main execution flow to continue if email fails
        return { success: false, error: error.message };
    }
};