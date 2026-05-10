// backend/services/emailService.js

const nodemailer = require('nodemailer');


// Email Transporter Setup
// Uses Gmail SMTP with App Password

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify connection on startup
transporter.verify((error) => {
  if (error) {
    console.warn('⚠️ Email service not configured:', error.message);
  } else {
    console.log('✅ Email service ready');
  }
});


// Send Basic Email

const sendEmail = async (to, subject, text, html = null) => {
  try {
    const mailOptions = {
      from:    `UroScan AI <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      ...(html && { html }),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Email sent:', info.response);
    return true;
  } catch (error) {
    console.error('❌ Email Error:', error.message);
    return false;
  }
};


// Send Report Ready Notification

const sendReportNotification = async (
  to,
  patientName,
  hasStones,
  reportId
) => {
  const subject = `UroScan AI — X-ray Report Ready for ${patientName}`;

  // Plain text version
  const text = `
Hello,

The X-ray analysis for patient ${patientName} is complete.

Result  : ${hasStones ? 'Stones Detected ⚠️' : 'No Stones Detected ✅'}
Report  : Please login to view the full report.

IMPORTANT: This is an AI-assisted preliminary result.
Final diagnosis must be confirmed by your doctor.

Best Regards,
UroScan AI — Diagnosis Support System
  `.trim();

  // HTML version
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2 style="color: #1d4ed8;">UroScan AI — Report Ready</h2>
      <p>The X-ray analysis for patient <strong>${patientName}</strong> is complete.</p>

      <div style="padding: 16px; border-radius: 8px; background: ${hasStones ? '#fef2f2' : '#f0fdf4'}; border-left: 4px solid ${hasStones ? '#ef4444' : '#22c55e'};">
        <p style="margin: 0; font-size: 16px; font-weight: bold; color: ${hasStones ? '#dc2626' : '#16a34a'};">
          ${hasStones ? '⚠️ Stones Detected' : '✅ No Stones Detected'}
        </p>
      </div>

      <p style="margin-top: 16px;">Please login to the dashboard to view the complete report.</p>

      <p style="color: #64748b; font-size: 12px; margin-top: 24px;">
        ⚠️ This is an AI-assisted preliminary result. 
        Final diagnosis must be confirmed by a qualified doctor.
      </p>

      <hr style="border: none; border-top: 1px solid #e2e8f0;" />
      <p style="color: #94a3b8; font-size: 11px;">
        UroScan AI — Diagnosis Support System
      </p>
    </div>
  `;

  return await sendEmail(to, subject, text, html);
};


// Send Welcome Email (After Registration)

const sendWelcomeEmail = async (to, name, role) => {
  const subject = 'Welcome to UroScan AI';

  const text = `
Hello ${name},

Welcome to UroScan AI — Diagnosis Support System.

Your account has been created successfully.
Role: ${role.toUpperCase()}

Please login to access your dashboard.

Best Regards,
UroScan AI Team
  `.trim();

  return await sendEmail(to, subject, text);
};

module.exports = {
  sendEmail,
  sendReportNotification,
  sendWelcomeEmail,
};