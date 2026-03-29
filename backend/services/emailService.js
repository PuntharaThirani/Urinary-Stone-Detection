const nodemailer = require('nodemailer');

// Email යවන කෙනාගේ විස්තර (Transporter)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // ඔබේ ඊමේල් ලිපිනය (.env එකේ දාන්න)
        pass: process.env.EMAIL_PASS  // ඔබේ App Password එක
    }
});

/**
 * සාමාන්‍ය Email එකක් යැවීම
 */
const sendEmail = async (to, subject, text) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            text: text
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('📧 Email Sent:', info.response);
        return true;
    } catch (error) {
        console.error('❌ Email Error:', error);
        return false;
    }
};

/**
 * Report එකක් හැදුනම යවන Email එක (Template එකක් වගේ)
 */
const sendReportNotification = async (to, patientName, result) => {
    const subject = `Kidney Stone Report Ready - ${patientName}`;
    const text = `
    Hello,
    
    The X-ray analysis for patient ${patientName} is complete.
    Result: ${result ? "Stones Detected ⚠️" : "No Stones Detected ✅"}
    
    Please login to the dashboard to view the full report.
    
    Best Regards,
    Kidney Stone Detection System
    `;

    return await sendEmail(to, subject, text);
};

module.exports = { sendEmail, sendReportNotification };