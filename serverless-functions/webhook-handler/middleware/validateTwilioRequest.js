const twilio = require('twilio');

/**
 * Middleware to validate that incoming requests are signed by Twilio
 * Verifies the X-Twilio-Signature header using HMAC-SHA1 validation
 *
 * Required environment variables:
 * - TWILIO_AUTH_TOKEN: Your Twilio account auth token
 * - WEBHOOK_URL: The full URL of this webhook endpoint
 */
const validateTwilioRequest = (req, res, next) => {
  try {
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    if (!authToken) {
      console.error('TWILIO_AUTH_TOKEN environment variable not set');
      const err = new Error('Server misconfiguration: missing TWILIO_AUTH_TOKEN');
      err.status = 500;
      return next(err);
    }

    const webhookUrl = process.env.WEBHOOK_URL;
    if (!webhookUrl) {
      console.error('WEBHOOK_URL environment variable not set');
      const err = new Error('Server misconfiguration: missing WEBHOOK_URL');
      err.status = 500;
      return next(err);
    }

    const twilioSignature = req.headers['x-twilio-signature'];
    if (!twilioSignature) {
      console.warn('Request missing X-Twilio-Signature header');
      const err = new Error('Unauthorized: missing signature');
      err.status = 401;
      return next(err);
    }

    // Validate the request signature
    const isValid = twilio.validateRequest(authToken, twilioSignature, webhookUrl, req.body);

    if (!isValid) {
      console.warn('Invalid Twilio signature received');
      const err = new Error('Unauthorized: invalid signature');
      err.status = 401;
      return next(err);
    }

    // Signature is valid, proceed
    next();
  } catch (error) {
    const err = new Error(error.message || 'Signature validation failed');
    err.status = 500;
    next(err);
  }
};

module.exports = validateTwilioRequest;
