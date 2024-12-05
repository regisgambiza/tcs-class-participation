// biometricAuth.js

export const authenticateWithBiometrics = async () => {
    try {
        if (!window.PublicKeyCredential) {
            alert("Biometric authentication is not supported in this browser.");
            return false;
        }

        const options = {
            challenge: new Uint8Array(32), // Random data from server for security
            allowCredentials: [],
            timeout: 60000, // 60 seconds
            userVerification: "required", // Require biometric authentication
        };

        const assertion = await navigator.credentials.get({ publicKey: options });
        console.log("Biometric authentication assertion:", assertion);

        // If successful, return true
        return true;
    } catch (error) {
        console.error("Biometric authentication error:", error);
        return false;
    }
};
