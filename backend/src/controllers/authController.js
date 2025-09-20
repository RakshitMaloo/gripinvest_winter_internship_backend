const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, PasswordReset } = require('../models');
const emailService = require('../utils/emailService');
require('dotenv').config();

const signToken = (user) => jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

module.exports = {
  signup: async (req, res, next) => {
    try {
      const { name, email, password, risk_appetite } = req.body;
      const exists = await User.findOne({ where: { email } });
      if (exists) return res.status(400).json({ message: 'Email already in use' });
      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hashed, risk_appetite, balance: 1000.00 });
      const token = signToken(user);
      res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
    } catch (err) { next(err); }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(401).json({ message: 'Invalid credentials' });
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
      const token = signToken(user);
      res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
    } catch (err) { next(err); }
  },

  requestPasswordReset: async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(404).json({ message: 'User not found' });
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      await PasswordReset.create({ userId: user.id, otp, expiresAt });
      await emailService.sendMail({ to: user.email, subject: 'Your OTP', text: `Your OTP: ${otp}` });
      res.json({ message: 'OTP sent (check email / server logs)' });
    } catch (err) { next(err); }
  },

  verifyOtpAndReset: async (req, res, next) => {
    try {
      const { email, otp, newPassword } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(404).json({ message: 'User not found' });
      const record = await PasswordReset.findOne({ where: { userId: user.id, otp, used: false }, order: [['createdAt','DESC']] });
      if (!record) return res.status(400).json({ message: 'Invalid OTP' });
      if (new Date(record.expiresAt) < new Date()) return res.status(400).json({ message: 'OTP expired' });
      const hashed = await bcrypt.hash(newPassword, 10);
      user.password = hashed; await user.save();
      record.used = true; await record.save();
      res.json({ message: 'Password reset successful' });
    } catch (err) { next(err); }
  }
};
