// Firebase Modular SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ✅ YOUR FIREBASE CONFIG (fill all fields properly)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  appId: "YOUR_APP_ID"
};

// Init
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let confirmationResult = null;
let recaptchaVerifier = null;
let isVerified = false;

// 🔥 Invisible reCAPTCHA
function setupRecaptcha() {
  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible"
    });
  }
}

// 📲 Send OTP
export async function sendOTP(phone) {
  try {
    setupRecaptcha();

    const fullPhone = "+91" + phone;

    confirmationResult = await signInWithPhoneNumber(
      auth,
      fullPhone,
      recaptchaVerifier
    );

    return { success: true, message: "OTP Sent ✅" };

  } catch (error) {
    return { success: false, message: error.message };
  }
}

// 🔐 Verify OTP
export async function verifyOTP(code) {
  try {
    await confirmationResult.confirm(code);
    isVerified = true;
    return { success: true, message: "Verified ✅" };

  } catch (error) {
    return { success: false, message: "Wrong OTP ❌" };
  }
}

// ✅ Check
export function isUserVerified() {
  return isVerified;
}