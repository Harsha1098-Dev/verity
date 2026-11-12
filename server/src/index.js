const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { initializeFirebaseAdmin } = require('./config/firebaseAdmin');
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const { getPublicBankDetails } = require('./config/bankConfig');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Firebase Admin SDK
initializeFirebaseAdmin();

// Middleware
app.use(
  cors({
    origin: '*', // Allows mobile apps, web preview, and local Expo clients
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

// Request logger for debugging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'Portal 11:11 Mobile OTP & Payment Gateway Server',
    environment: process.env.NODE_ENV || 'development',
    time: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error occurred',
  });
});

// Start listening
app.listen(PORT, '0.0.0.0', () => {
  const bank = getPublicBankDetails();
  console.log(`\n======================================================`);
  console.log(`✨ PORTAL 11:11 FIREBASE AUTH & PAYMENT SERVER IS ACTIVE`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🇮🇳 Indian Mobile Numbers: Ready (+91)`);
  console.log(`💳 Payment Gateway: Razorpay UPI, Cards & Net Banking`);
  console.log(`🏦 Direct Bank Settlement: ${bank.accountHolderName} | ${bank.bankName} (${bank.maskedAccountNumber}) | IFSC: ${bank.ifscCode}`);
  console.log(`======================================================\n`);
});

module.exports = app;
