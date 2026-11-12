# Portal 11:11 — Firebase Mobile Phone OTP Authentication Server

Production-ready Node.js & Express backend for Firebase Phone OTP Authentication tailored for Indian mobile numbers (`+91`).

---

## Features

- **Indian Mobile Number Validation & Formatting:** Rejects non-Indian numbers or malformed lengths; standardizes to E.164 (`+91XXXXXXXXXX`).
- **Send & Resend OTP:** Dispatches 6-digit verification codes.
- **Strict 30-Second Rate Limiting:** Enforces server-side 30-second cooldown on resend attempts to prevent SMS spam and fraud.
- **Firebase Admin SDK Integration:** Uses Firebase Admin to lookup existing users or automatically provision new Firebase user accounts.
- **Custom Token Issuance:** Generates Firebase Custom Tokens (`createCustomToken`) for persistent client sessions.
- **Session Verification:** Verifies client Bearer tokens on app launch to maintain persistent login state.
- **Development Fallback Mode:** Operates out-of-the-box in local development with mock verification (code `111111`) before production Firebase keys are placed.

---

## Quick Start

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Add Your Firebase Service Account
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your project ➔ **Project Settings** (gear icon) ➔ **Service accounts**.
3. Click **Generate new private key**.
4. Save the downloaded JSON file as `server/serviceAccountKey.json`.

### 4. Run Server
```bash
# Production mode
npm start

# Development mode with hot-reloading
npm run dev
```

Server starts at: `http://localhost:5000`

---

## API Endpoints

### 1. `POST /api/auth/send-otp`
Dispatches an OTP to the Indian mobile number.
```json
// Request
{
  "phoneNumber": "9876543210"
}

// Response (200 OK)
{
  "success": true,
  "message": "OTP sent successfully to +91 98765 43210",
  "phoneNumber": "+919876543210",
  "displayNumber": "+91 98765 43210",
  "cooldownSeconds": 30,
  "expiresInSeconds": 300
}
```

### 2. `POST /api/auth/resend-otp`
Resends OTP code, strictly validating that 30 seconds have elapsed since the prior request.
- Returns `429 Too Many Requests` if called before 30 seconds.

### 3. `POST /api/auth/verify-otp`
Verifies the 6-digit OTP code, automatically creates the Firebase user if new, and returns the session token.
```json
// Request
{
  "phoneNumber": "9876543210",
  "otpCode": "111111",
  "name": "Harsha"
}

// Response (200 OK)
{
  "success": true,
  "message": "Welcome back! Sovereign reality portal unlocked.",
  "user": {
    "uid": "firebase_uid_12345",
    "phoneNumber": "+919876543210",
    "displayNumber": "+91 98765 43210",
    "displayName": "Harsha",
    "isNewUser": false
  },
  "token": "firebase_custom_token_...",
  "redirectUrl": "/home"
}
```

### 4. `GET /api/auth/session`
Validates persistent token from `Authorization: Bearer <token>` header.
