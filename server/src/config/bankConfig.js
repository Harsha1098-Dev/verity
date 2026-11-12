/**
 * Connected Merchant Bank Account Configuration & Settlement Engine
 * 
 * Manages the merchant bank details where all payment gateway proceeds
 * (Razorpay / UPI / Cards / Net Banking) settle directly.
 */

const connectedMerchantBank = {
  accountHolderName: process.env.MERCHANT_ACCOUNT_HOLDER || 'Harsha Vardhan',
  accountNumber: process.env.MERCHANT_ACCOUNT_NUMBER || '50100458921478',
  ifscCode: process.env.MERCHANT_IFSC_CODE || 'HDFC0000060',
  bankName: process.env.MERCHANT_BANK_NAME || 'HDFC Bank Ltd',
  branch: process.env.MERCHANT_BANK_BRANCH || 'Banjara Hills, Hyderabad',
  accountType: process.env.MERCHANT_ACCOUNT_TYPE || 'CURRENT',
  upiId: process.env.MERCHANT_UPI_ID || 'harsha.portal1111@okhdfcbank',
  isVerified: true,
  settlementSchedule: 'T+1 Daily Auto-Settlement',
  connectedAt: new Date().toISOString(),
};

/**
 * Validates Indian IFSC Code (11 characters: 4 letters, 0, 6 alphanumeric)
 */
function validateIFSC(ifsc) {
  if (!ifsc || typeof ifsc !== 'string') return false;
  return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc.trim().toUpperCase());
}

/**
 * Validates Indian Bank Account Number (9 to 18 digits)
 */
function validateAccountNumber(acc) {
  if (!acc || typeof acc !== 'string') return false;
  const digits = acc.replace(/\D/g, '');
  return digits.length >= 9 && digits.length <= 18;
}

/**
 * Validates UPI ID (e.g. username@bank)
 */
function validateUPI(upi) {
  if (!upi || typeof upi !== 'string') return false;
  return /^[\w.-]+@[\w.-]+$/.test(upi.trim());
}

/**
 * Masks account number for secure display (e.g. ••••••••••1478)
 */
function maskAccountNumber(acc) {
  if (!acc) return '';
  const digits = acc.replace(/\D/g, '');
  if (digits.length <= 4) return digits;
  return '•'.repeat(digits.length - 4) + digits.slice(-4);
}

/**
 * Get public bank details (masked account number for security)
 */
function getPublicBankDetails() {
  return {
    accountHolderName: connectedMerchantBank.accountHolderName,
    maskedAccountNumber: maskAccountNumber(connectedMerchantBank.accountNumber),
    rawAccountNumber: connectedMerchantBank.accountNumber,
    ifscCode: connectedMerchantBank.ifscCode,
    bankName: connectedMerchantBank.bankName,
    branch: connectedMerchantBank.branch,
    accountType: connectedMerchantBank.accountType,
    upiId: connectedMerchantBank.upiId,
    isVerified: connectedMerchantBank.isVerified,
    settlementSchedule: connectedMerchantBank.settlementSchedule,
    connectedAt: connectedMerchantBank.connectedAt,
  };
}

/**
 * Update connected merchant bank details
 */
function updateBankDetails(details) {
  if (details.accountHolderName) connectedMerchantBank.accountHolderName = details.accountHolderName.trim();
  if (details.accountNumber) connectedMerchantBank.accountNumber = details.accountNumber.trim();
  if (details.ifscCode) connectedMerchantBank.ifscCode = details.ifscCode.trim().toUpperCase();
  if (details.bankName) connectedMerchantBank.bankName = details.bankName.trim();
  if (details.branch) connectedMerchantBank.branch = details.branch.trim();
  if (details.accountType) connectedMerchantBank.accountType = details.accountType.trim().toUpperCase();
  if (details.upiId) connectedMerchantBank.upiId = details.upiId.trim().toLowerCase();
  
  connectedMerchantBank.isVerified = true;
  connectedMerchantBank.connectedAt = new Date().toISOString();

  return getPublicBankDetails();
}

module.exports = {
  connectedMerchantBank,
  validateIFSC,
  validateAccountNumber,
  validateUPI,
  maskAccountNumber,
  getPublicBankDetails,
  updateBankDetails,
};
