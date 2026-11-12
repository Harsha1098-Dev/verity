/**
 * Indian Mobile Number Validator & Formatter
 * Rules:
 * - 10 digits length (excluding country code)
 * - Must start with 6, 7, 8, or 9
 * - Standardized to E.164 format (+91XXXXXXXXXX)
 */

function validateIndianPhoneNumber(rawPhone) {
  if (!rawPhone || typeof rawPhone !== 'string') {
    return {
      isValid: false,
      error: 'Phone number is required',
      formattedNumber: null,
    };
  }

  // Strip all non-digit characters except leading plus
  let cleaned = rawPhone.trim().replace(/[^\d+]/g, '');

  // Handle various formats:
  // e.g. "9876543210", "09876543210", "+919876543210", "919876543210"
  if (cleaned.startsWith('+91')) {
    cleaned = cleaned.substring(3);
  } else if (cleaned.startsWith('91') && cleaned.length === 12) {
    cleaned = cleaned.substring(2);
  } else if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = cleaned.substring(1);
  }

  // Must be exactly 10 digits
  if (cleaned.length !== 10) {
    return {
      isValid: false,
      error: 'Indian mobile number must be exactly 10 digits',
      formattedNumber: null,
    };
  }

  // First digit must be 6, 7, 8, or 9
  const firstDigit = cleaned[0];
  if (!['6', '7', '8', '9'].includes(firstDigit)) {
    return {
      isValid: false,
      error: 'Indian mobile numbers must start with 6, 7, 8, or 9',
      formattedNumber: null,
    };
  }

  const e164 = `+91${cleaned}`;
  const nationalFormatted = `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;

  return {
    isValid: true,
    error: null,
    rawNumber: cleaned,
    formattedNumber: e164,
    displayNumber: nationalFormatted,
  };
}

module.exports = {
  validateIndianPhoneNumber,
};
