/**
 * WebAuthn/Passkey helper functions for admin authentication
 * Custom implementation since Better Auth 1.4.9 doesn't include passkey plugin
 */

export interface WebAuthnCredential {
    id: string;
    publicKey: string;
    counter: number;
}

/**
 * Register a new passkey for a user
 */
export async function registerPasskey(userId: string, email: string): Promise<{ success: boolean; credentialId?: string; error?: string }> {
    try {
        if (!window.PublicKeyCredential) {
            return { success: false, error: "WebAuthn is not supported in this browser" };
        }

        const rpId = window.location.hostname;
        const challenge = crypto.getRandomValues(new Uint8Array(32));

        // Create credential
        const credential = await navigator.credentials.create({
            publicKey: {
                challenge,
                rp: {
                    name: "ROOKIES Bakery",
                    id: rpId,
                },
                user: {
                    id: new TextEncoder().encode(userId),
                    name: email,
                    displayName: email,
                },
                pubKeyCredParams: [
                    { alg: -7, type: "public-key" }, // ES256
                    { alg: -257, type: "public-key" }, // RS256
                ],
                authenticatorSelection: {
                    authenticatorAttachment: "platform", // Prefer platform authenticators (fingerprint, face ID)
                    userVerification: "required",
                },
                timeout: 60000,
                attestation: "direct",
            },
        }) as PublicKeyCredential;

        if (!credential || !credential.response) {
            return { success: false, error: "Failed to create credential" };
        }

        const response = credential.response as AuthenticatorAttestationResponse;
        const credentialId = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)));

        // Send credential to server for storage
        const serverResponse = await fetch("/api/webauthn/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId,
                email,
                credentialId,
                publicKey: btoa(String.fromCharCode(...new Uint8Array(response.getPublicKey() || new Uint8Array()))),
                attestationObject: btoa(String.fromCharCode(...new Uint8Array(response.attestationObject))),
            }),
        });

        if (!serverResponse.ok) {
            return { success: false, error: "Failed to register passkey on server" };
        }

        return { success: true, credentialId };
    } catch (error: any) {
        console.error("Passkey registration error:", error);
        return {
            success: false,
            error: error.message || "Failed to register passkey",
        };
    }
}

/**
 * Authenticate using passkey
 */
export async function authenticateWithPasskey(email: string): Promise<{ success: boolean; userId?: string; error?: string }> {
    try {
        if (!window.PublicKeyCredential) {
            return { success: false, error: "WebAuthn is not supported in this browser" };
        }

        const rpId = window.location.hostname;

        // Get challenge from server
        const challengeResponse = await fetch("/api/webauthn/challenge", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        if (!challengeResponse.ok) {
            return { success: false, error: "Failed to get challenge from server" };
        }

        const { challenge, allowCredentials } = await challengeResponse.json();

        // Authenticate
        const assertion = await navigator.credentials.get({
            publicKey: {
                challenge: Uint8Array.from(atob(challenge), (c) => c.charCodeAt(0)),
                rpId,
                allowCredentials: allowCredentials?.map((cred: any) => ({
                    id: Uint8Array.from(atob(cred.id), (c) => c.charCodeAt(0)),
                    type: "public-key",
                })),
                userVerification: "required",
                timeout: 60000,
            },
            mediation: "conditional", // Enable conditional UI for mobile autofill
        }) as PublicKeyCredential;

        if (!assertion || !assertion.response) {
            return { success: false, error: "Failed to authenticate" };
        }

        const response = assertion.response as AuthenticatorAssertionResponse;

        // Verify with server
        const verifyResponse = await fetch("/api/webauthn/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email,
                credentialId: btoa(String.fromCharCode(...new Uint8Array(assertion.rawId))),
                authenticatorData: btoa(String.fromCharCode(...new Uint8Array(response.authenticatorData))),
                clientDataJSON: btoa(String.fromCharCode(...new Uint8Array(response.clientDataJSON))),
                signature: btoa(String.fromCharCode(...new Uint8Array(response.signature))),
            }),
        });

        if (!verifyResponse.ok) {
            return { success: false, error: "Failed to verify authentication" };
        }

        const { userId } = await verifyResponse.json();
        return { success: true, userId };
    } catch (error: any) {
        console.error("Passkey authentication error:", error);
        if (error.name === "NotAllowedError") {
            return { success: false, error: "Authentication was cancelled" };
        }
        return {
            success: false,
            error: error.message || "Failed to authenticate with passkey",
        };
    }
}

