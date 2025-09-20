const nodemailer = require('nodemailer');
require('dotenv').config();

let transporter;
if (process.env.EMAIL_HOST && process.env.EMAIL_USER) {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });
} else {
  // fallback transporter that logs to console
  transporter = { sendMail: async (opts) => { console.log('EMAIL (dev):', opts); return Promise.resolve(); } };
}

module.exports = {
  sendMail: async ({ to, subject, html, text }) => {
    return transporter.sendMail({ from: process.env.EMAIL_USER || 'no-reply@grip.local', to, subject, html, text });
  }
};
