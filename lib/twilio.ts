import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
// Default to Twilio WhatsApp Sandbox number if not configured
// To use sandbox, join the sandbox: https://console.twilio.com/us1/develop/sms/sandbox
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER || "whatsapp:+14155238886";

if (!accountSid || !authToken) {
  console.warn("Twilio credentials not configured. WhatsApp OTP will not work.");
}

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

/**
 * Sends OTP code via WhatsApp using Twilio
 */
export async function sendWhatsAppOTP(
  phoneNumber: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  if (!client) {
    return {
      success: false,
      error: "Twilio is not configured. Please add TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN to your environment variables.",
    };
  }

  // Send WhatsApp message using Content API (required for WhatsApp)
  // Check if contentSid is configured, otherwise use body (fallback)
  const contentSid = process.env.TWILIO_CONTENT_SID;
  const sandboxNumber = "whatsapp:+14155238886";
  // If Content SID is set, prefer using sandbox number for compatibility
  // Content templates are typically tied to sandbox or specific verified numbers
  const effectiveFromNumber = contentSid ? sandboxNumber : whatsappNumber;
  
  try {
    // Format phone number for WhatsApp (whatsapp:+92XXXXXXXXXX)
    const whatsappPhone = phoneNumber.startsWith("whatsapp:")
      ? phoneNumber
      : `whatsapp:${phoneNumber}`;
    
    let messageParams: any = {
      from: effectiveFromNumber,
      to: whatsappPhone,
    };
    
    if (contentSid) {
      // Use Content API with template
      messageParams.contentSid = contentSid;
      messageParams.contentVariables = JSON.stringify({ "1": code });
    } else {
      // Fallback to plain text body (may not work for all WhatsApp setups)
      messageParams.body = `Your login code is: ${code}\n\nThis code will expire in 10 minutes. Do not share this code with anyone.`;
    }
    
    await client.messages.create(messageParams);

    return { success: true };
  } catch (error: any) {
    console.error("Twilio WhatsApp error:", error);
    
    // Provide user-friendly error messages for common Twilio errors
    let errorMessage = error.message || "Failed to send WhatsApp message";
    
    if (error.code === 63007) {
      // Error 63007: "Twilio could not find a Channel with the specified From address"
      // This usually means:
      // 1. The WhatsApp channel isn't set up in Twilio
      // 2. The recipient hasn't joined the sandbox (but that's usually error 21608)
      // 3. The Content SID isn't associated with the number
      if (contentSid && effectiveFromNumber === sandboxNumber) {
        errorMessage = `WhatsApp channel not found. Possible issues:\n1. The recipient phone number (+${phoneNumber.replace(/^\+/, '')}) must join the Twilio WhatsApp Sandbox first. Send "join [code]" to +1 415 523 8886 via WhatsApp.\n2. Your Twilio account may not have WhatsApp enabled. Check: https://console.twilio.com/us1/develop/sms/sandbox\n3. The Content SID (${contentSid.substring(0, 10)}...) may not be associated with the sandbox number. Verify in Twilio Console.`;
      } else if (contentSid && effectiveFromNumber !== sandboxNumber) {
        errorMessage = `WhatsApp number ${whatsappNumber} is not configured for WhatsApp. When using Content API (TWILIO_CONTENT_SID), use the sandbox number: whatsapp:+14155238886. Update your .env: TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886`;
      } else {
        errorMessage = `WhatsApp number not configured. Please check your TWILIO_WHATSAPP_NUMBER in .env. Current: ${whatsappNumber}. For testing, use Twilio Sandbox: whatsapp:+14155238886 (join at https://console.twilio.com/us1/develop/sms/sandbox). If using Content API, ensure TWILIO_CONTENT_SID is set and use the sandbox number.`;
      }
    } else if (error.code === 21211) {
      errorMessage = "Invalid 'To' phone number. Please check the phone number format.";
    } else if (error.code === 21608) {
      errorMessage = "Unsubscribed recipient. The phone number must join the Twilio WhatsApp Sandbox first.";
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Checks if Twilio is properly configured
 */
export function isTwilioConfigured(): boolean {
  return !!(accountSid && authToken);
}

