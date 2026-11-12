const express = require('express');
const router = express.Router();
const {
  sendOTP,
  resendOTP,
  verifyOTP,
  verifySession,
} = require('../controllers/authController');

/**
 * Route: Send OTP to Indian Mobile Number
 * POST /api/auth/send-otp
 * Body: { phoneNumber: "9876543210" }
 */
router.post('/send-otp', sendOTP);

/**
 * Route: Resend OTP (with 30-second rate-limit cooldown)
 * POST /api/auth/resend-otp
 * Body: { phoneNumber: "9876543210" }
 */
router.post('/resend-otp', resendOTP);

/**
 * Route: Verify OTP & Automatic Firebase User Creation
 * POST /api/auth/verify-otp
 * Body: { phoneNumber: "9876543210", otpCode: "111111", name?: "Harsha" }
 */
router.post('/verify-otp', verifyOTP);

/**
 * Route: Verify Persistent Session Token
 * GET /api/auth/session
 * Header: Authorization: Bearer <token>
 */
router.get('/session', verifySession);

module.exports = router;
