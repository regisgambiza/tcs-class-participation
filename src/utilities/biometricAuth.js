// biometricAuth.js
export const authenticateWithBiometrics = async () => {
    try {
        // Check if WebAuthn is supported in the browser
        if (!window.PublicKeyCredential) {
            alert("Biometric authentication is not supported in this browser.");
            return false;
        }

        // WebAuthn authentication request options
        const options = {
            challenge: new Uint8Array(32), // Random data for security
            allowCredentials: [],
            timeout: 60000, // 60 seconds timeout for the user to authenticate
            userVerification: "required", // Requires user verification (fingerprint, face scan, PIN)
        };

        // Trigger the biometric authentication process
        const assertion = await navigator.credentials.get({ publicKey: options });

        console.log("Biometric authentication assertion:", assertion);

        // If authentication is successful, return true
        return true;
    } catch (error) {
        console.error("Biometric authentication error:", error);
        alert("Biometric authentication failed. Please try again.");
        return false;
    }
};
