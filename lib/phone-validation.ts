import { parsePhoneNumber, isValidPhoneNumber } from "libphonenumber-js";

/**
 * Validates and normalizes Pakistani phone numbers
 * Accepts format: +92XXXXXXXXXX (with country code)
 */
export function validatePakistaniPhone(phone: string): {
  valid: boolean;
  normalized?: string;
  error?: string;
} {
  try {
    // Remove any spaces, dashes, or other characters
    const cleaned = phone.replace(/[\s\-\(\)]/g, "");

    // Check if it starts with +92
    if (!cleaned.startsWith("+92")) {
      return {
        valid: false,
        error: "Phone number must start with +92 (Pakistan country code)",
      };
    }

    // Validate using libphonenumber-js
    if (!isValidPhoneNumber(cleaned, "PK")) {
      return {
        valid: false,
        error: "Invalid Pakistani phone number format",
      };
    }

    // Parse and normalize
    const phoneNumber = parsePhoneNumber(cleaned, "PK");
    
    if (!phoneNumber.isValid()) {
      return {
        valid: false,
        error: "Invalid phone number",
      };
    }

    // Return in E.164 format (+92XXXXXXXXXX)
    return {
      valid: true,
      normalized: phoneNumber.format("E.164"),
    };
  } catch (error) {
    return {
      valid: false,
      error: "Error validating phone number",
    };
  }
}

/**
 * Normalizes phone number to E.164 format
 */
export function normalizePhone(phone: string): string {
  const result = validatePakistaniPhone(phone);
  return result.normalized || phone;
}

/**
 * Formats phone number for display
 */
export function formatPhoneForDisplay(phone: string): string {
  try {
    const phoneNumber = parsePhoneNumber(phone, "PK");
    return phoneNumber.formatInternational();
  } catch {
    return phone;
  }
}

