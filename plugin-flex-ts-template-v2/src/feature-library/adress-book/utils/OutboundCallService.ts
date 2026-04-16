import { Actions } from '@twilio/flex-ui';
import logger from '../../../utils/logger';

/**
 * Validates if a phone number is in E.164 format.
 * E.164 format: +[country code][number], e.g., +12025551234
 *
 * @param phoneNumber - The phone number to validate
 * @returns true if valid E.164 format, false otherwise
 */
export const isValidE164PhoneNumber = (phoneNumber: string): boolean => {
  const e164Regex = /^\+?[1-9]\d{1,14}$/;
  return e164Regex.test(phoneNumber.replace(/\s/g, ''));
};

/**
 * Formats a phone number to E.164 format.
 * Accepts various formats: 202-555-1234, (202) 555-1234, +1 202 555 1234, 2025551234, +12025551234
 *
 * @param phoneNumber - The phone number to format
 * @returns Formatted E.164 number, or null if unable to parse
 */
export const formatPhoneNumberToE164 = (phoneNumber: string): string | null => {
  if (!phoneNumber) {
    return null;
  }

  // Remove all non-digit characters except the leading +
  let cleaned = phoneNumber.replace(/[^\d+]/g, '');

  // If it starts with +, keep it; otherwise remove any + signs
  if (cleaned.startsWith('+')) {
    // Valid start with +
  } else if (cleaned.includes('+')) {
    cleaned = cleaned.replace(/\+/g, '');
  }

  // Remove leading + for processing
  const hasPlus = cleaned.startsWith('+');
  const digitsOnly = cleaned.replace(/\D/g, '');

  // If only 10 digits (US default), assume +1
  if (digitsOnly.length === 10) {
    return `+1${digitsOnly}`;
  }

  // If already 11+ digits, prepend + if missing
  if (digitsOnly.length >= 11) {
    return hasPlus ? `+${digitsOnly}` : `+${digitsOnly}`;
  }

  // Unable to determine valid format
  return null;
};

/**
 * Invokes the StartOutboundCall Flex action with the given destination.
 * This will trigger the outbound call and integrate with the caller-id feature
 * if enabled (via the beforeStartOutboundCall hook).
 *
 * @param destination - The phone number to call (E.164 format or will be formatted)
 * @throws Error if the call invocation fails
 */
export const invokeOutboundCall = async (destination: string): Promise<void> => {
  if (!destination) {
    throw new Error('Destination phone number is required');
  }

  // Validate or format the phone number
  let validatedDestination = destination;
  if (!isValidE164PhoneNumber(destination)) {
    const formatted = formatPhoneNumberToE164(destination);
    if (!formatted) {
      throw new Error(`Invalid phone number format: ${destination}`);
    }
    validatedDestination = formatted;
  }

  try {
    logger.log('[address-book] Invoking StartOutboundCall', { destination: validatedDestination });

    // Invoke the Flex action - this will:
    // 1. Trigger befo StartOutboundCall hooks (e.g., caller-id hook)
    // 2. Create an outbound task in the UI
    // 3. Integrate with agent's selected caller ID if available
    await Actions.invokeAction('StartOutboundCall', {
      destination: validatedDestination,
    });

    logger.log('[address-book] StartOutboundCall succeeded', { destination: validatedDestination });
  } catch (error: any) {
    logger.error('[address-book] Error invoking StartOutboundCall', {
      destination: validatedDestination,
      error: error?.message || error,
    });
    throw error;
  }
};
