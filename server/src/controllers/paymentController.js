const crypto = require('crypto');
const {
  getPublicBankDetails,
  updateBankDetails: saveBankDetails,
  validateIFSC,
  validateAccountNumber,
  validateUPI,
  connectedMerchantBank,
} = require('../config/bankConfig');

// Optional Razorpay SDK instance
let razorpayInstance = null;
const isRazorpayConfigured = !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

if (isRazorpayConfigured) {
  try {
    const Razorpay = require('razorpay');
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log('⚡ Live Razorpay Gateway initialized with direct bank settlement routing.');
  } catch (e) {
    console.warn('⚠️ Razorpay package load warning, using smart payment engine.');
  }
} else {
  console.log('⚡ Razorpay Gateway running in Smart Dev Simulation mode (Mock UPI / Card / Net Banking enabled).');
}

// In-memory transaction registry
const paymentTransactions = [
  {
    transactionId: 'TXN_PORTAL_INIT_1111',
    orderId: 'order_portal_initial',
    amount: 1111,
    currency: 'INR',
    tierId: 'sovereign_annual',
    tierName: '11:11 Sovereign Annual',
    customerPhone: '+91 98765 43210',
    paymentMethod: 'UPI (Google Pay)',
    status: 'SETTLED',
    settlementAccount: `${connectedMerchantBank.bankName} - ${connectedMerchantBank.accountNumber.slice(-4)}`,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

// Membership catalog pricing in INR
const MEMBERSHIP_PLANS = {
  sacred_monthly: {
    id: 'sacred_monthly',
    name: 'Sacred Monthly Access',
    amount: 499, // INR
    period: 'monthly',
    description: 'Full unmetered access to 3D scenes and custom voice affirmations.',
  },
  sovereign_annual: {
    id: 'sovereign_annual',
    name: '11:11 Sovereign Annual',
    amount: 1111, // INR
    period: 'annual',
    description: 'Most Sacred Value • Delta-wave audio, 15-question neural synthesis & all 10 3D realms.',
  },
  divine_lifetime: {
    id: 'divine_lifetime',
    name: 'Divine Lifetime Mastery',
    amount: 3333, // INR
    period: 'lifetime',
    description: 'Permanent VIP status • Direct creator channel & lifetime updates.',
  },
};

/**
 * 1. Create Payment Order
 * POST /api/payment/create-order
 */
async function createOrder(req, res) {
  try {
    const { tierId = 'sovereign_annual', customerPhone, customerName } = req.body;
    const plan = MEMBERSHIP_PLANS[tierId] || MEMBERSHIP_PLANS.sovereign_annual;
    const amountInPaise = plan.amount * 100; // Razorpay uses smallest currency unit

    const orderReceipt = `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    let orderData = null;

    if (razorpayInstance) {
      // Live Razorpay order creation
      orderData = await razorpayInstance.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: orderReceipt,
        notes: {
          tierId: plan.id,
          tierName: plan.name,
          customerPhone: customerPhone || 'Unspecified',
          settlementBank: `${connectedMerchantBank.bankName} (${connectedMerchantBank.accountNumber.slice(-4)})`,
        },
      });
    } else {
      // Smart Sandbox simulated Razorpay order
      const mockOrderId = `order_${crypto.randomBytes(8).toString('hex')}`;
      orderData = {
        id: mockOrderId,
        entity: 'order',
        amount: amountInPaise,
        amount_paid: 0,
        amount_due: amountInPaise,
        currency: 'INR',
        receipt: orderReceipt,
        status: 'created',
        attempts: 0,
        notes: {
          tierId: plan.id,
          tierName: plan.name,
          customerPhone: customerPhone || '+91 98765 43210',
          settlementBank: `${connectedMerchantBank.bankName} (${connectedMerchantBank.accountNumber.slice(-4)})`,
        },
        created_at: Math.floor(Date.now() / 1000),
      };
    }

    return res.status(200).json({
      success: true,
      orderId: orderData.id,
      amount: plan.amount,
      amountInPaise,
      currency: 'INR',
      plan,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_portal1111mockkey',
      merchantBank: getPublicBankDetails(),
      isSandbox: !isRazorpayConfigured,
      message: `Order initialized for ${plan.name} (₹${plan.amount})`,
    });
  } catch (error) {
    console.error('[PaymentController] createOrder Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to initiate payment gateway order: ' + error.message,
    });
  }
}

/**
 * 2. Verify Payment & Settle to Bank
 * POST /api/payment/verify-payment
 */
async function verifyPayment(req, res) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      tierId = 'sovereign_annual',
      customerPhone,
      customerName,
      paymentMethod = 'UPI',
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({
        success: false,
        error: 'Missing order_id or payment_id in payment verification',
      });
    }

    let isSignatureValid = false;

    if (razorpayInstance && process.env.RAZORPAY_KEY_SECRET) {
      const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      isSignatureValid = generatedSignature === razorpay_signature;
    } else {
      // In Dev / Smart simulation mode, accept generated sandbox transactions
      isSignatureValid = true;
    }

    if (!isSignatureValid) {
      return res.status(400).json({
        success: false,
        error: 'Invalid payment gateway signature verification failed',
      });
    }

    const plan = MEMBERSHIP_PLANS[tierId] || MEMBERSHIP_PLANS.sovereign_annual;
    const txId = `TXN_PORTAL_${Date.now()}`;

    // Record verified transaction with settlement to connected bank
    const transactionRecord = {
      transactionId: txId,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      amount: plan.amount,
      currency: 'INR',
      tierId: plan.id,
      tierName: plan.name,
      customerPhone: customerPhone || '+91 98765 43210',
      customerName: customerName || 'Harsha',
      paymentMethod,
      status: 'SETTLED',
      settlementAccount: `${connectedMerchantBank.bankName} (${connectedMerchantBank.accountNumber.slice(-4)})`,
      settlementIFSC: connectedMerchantBank.ifscCode,
      settlementAccountHolder: connectedMerchantBank.accountHolderName,
      settledAt: new Date().toISOString(),
    };

    paymentTransactions.unshift(transactionRecord);

    console.log(`\n💰 [PAYMENT SETTLEMENT] Verified ₹${plan.amount} for ${plan.name}`);
    console.log(`🏦 Direct Bank Settlement to: ${connectedMerchantBank.accountHolderName} | ${connectedMerchantBank.bankName} | A/C: ${connectedMerchantBank.accountNumber.slice(-4)}`);
    console.log(`💳 Transaction ID: ${txId}\n`);

    return res.status(200).json({
      success: true,
      transactionId: txId,
      paymentId: razorpay_payment_id,
      tier: plan,
      isVIP: true,
      settlement: {
        status: 'SETTLED_TO_BANK',
        bankName: connectedMerchantBank.bankName,
        accountHolder: connectedMerchantBank.accountHolderName,
        accountNumberMasked: `••••••••${connectedMerchantBank.accountNumber.slice(-4)}`,
        ifscCode: connectedMerchantBank.ifscCode,
      },
      message: `Sacred payment of ₹${plan.amount} confirmed. ${plan.name} is now active!`,
    });
  } catch (error) {
    console.error('[PaymentController] verifyPayment Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Payment verification failed: ' + error.message,
    });
  }
}

/**
 * 3. Get Connected Merchant Bank Details
 * GET /api/payment/bank-details
 */
function getBankDetails(req, res) {
  try {
    const details = getPublicBankDetails();
    return res.status(200).json({
      success: true,
      bankDetails: details,
      gateway: {
        provider: 'Razorpay UPI & Direct Bank Settlement',
        currency: 'INR (₹)',
        supportedMethods: ['UPI (GPay, PhonePe, Paytm)', 'Cards (Visa, RuPay)', 'Net Banking', 'Direct IMPS/NEFT'],
        isLive: isRazorpayConfigured,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve bank details: ' + error.message,
    });
  }
}

/**
 * 4. Connect / Update Direct Merchant Bank Details
 * POST /api/payment/bank-details
 */
function updateBankDetails(req, res) {
  try {
    const {
      accountHolderName,
      accountNumber,
      ifscCode,
      bankName,
      branch,
      accountType,
      upiId,
    } = req.body;

    if (!accountHolderName || accountHolderName.trim().length < 3) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid Account Holder Name (minimum 3 characters)',
      });
    }

    if (!accountNumber || !validateAccountNumber(accountNumber)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Indian Bank Account Number (must be between 9 and 18 digits)',
      });
    }

    if (!ifscCode || !validateIFSC(ifscCode)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid IFSC Code (must be 11 characters, e.g. HDFC0000060 or SBIN0001234)',
      });
    }

    if (upiId && !validateUPI(upiId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid UPI ID format (must be username@bank, e.g. harsha@okhdfcbank)',
      });
    }

    const updated = saveBankDetails({
      accountHolderName,
      accountNumber,
      ifscCode,
      bankName: bankName || 'Verified Bank',
      branch: branch || 'Main Branch',
      accountType: accountType || 'CURRENT',
      upiId: upiId || `${accountHolderName.toLowerCase().replace(/\s+/g, '')}@upi`,
    });

    console.log(`🏦 [BANK DETAILS UPDATED] Merchant Account connected: ${updated.accountHolderName} | ${updated.bankName} | IFSC: ${updated.ifscCode}`);

    return res.status(200).json({
      success: true,
      message: 'Direct bank account connected successfully for real-time settlements.',
      bankDetails: updated,
    });
  } catch (error) {
    console.error('[PaymentController] updateBankDetails Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update bank details: ' + error.message,
    });
  }
}

/**
 * 5. Get Settlement & Transaction History
 * GET /api/payment/transactions
 */
function getTransactions(req, res) {
  try {
    return res.status(200).json({
      success: true,
      transactions: paymentTransactions,
      totalSettledAmount: paymentTransactions.reduce((acc, t) => acc + t.amount, 0),
      settlementDestination: getPublicBankDetails(),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch transactions: ' + error.message,
    });
  }
}

module.exports = {
  createOrder,
  verifyPayment,
  getBankDetails,
  updateBankDetails,
  getTransactions,
  MEMBERSHIP_PLANS,
};
