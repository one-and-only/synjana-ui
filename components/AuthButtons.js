import { signIn } from "next-auth/react";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function AuthButtons() {
  const sendOTP = async () => {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
    });

    const phoneNumber = prompt("Enter phone number (with country code):");
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
    const code = prompt("Enter OTP sent to your phone:");
    await confirmationResult.confirm(code);
  };

  return (
    <div>
      <button onClick={() => signIn("google")}>Continue with Google</button>
      <button onClick={() => signIn("microsoft")}>Continue with Microsoft</button>
      <button onClick={() => signIn("apple")}>Continue with Apple</button>
      <button onClick={sendOTP}>Continue with Phone</button>
      <div id="recaptcha-container"></div>
    </div>
  );
}
