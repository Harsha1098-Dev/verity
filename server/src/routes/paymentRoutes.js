const express = require('express');
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  getBankDetails,
  updateBankDetails,
  getTransactions,
} = require('../controllers/paymentController');

// Payment Gateway Order & Verification Routes
router.post('/create-order', createOrder);
router.post('/verify-payment', verifyPayment);

// Direct Merchant Bank Connection & Settlement Routes
router.get('/bank-details', getBankDetails);
router.post('/bank-details', updateBankDetails);
router.get('/transactions', getTransactions);

module.exports = router;
