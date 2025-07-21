/*
 * Send voicemail email notification with recording attachment via Mailgun
 * This function is triggered after a voicemail is recorded and sends an email
 * to the admin with the recording attached.
 */
const axios = require('axios');
const FormData = require('form-data');

exports.handler = async function(context, event, callback) {
  console.log('Email notification handler triggered with event:', JSON.stringify(event, null, 2));

  // Enhanced environment variable validation as recommended by Twilio Support
  const requiredEnvVars = {
    ADMIN_EMAIL: context.ADMIN_EMAIL,
    MAILGUN_DOMAIN: context.MAILGUN_DOMAIN,
    MAILGUN_API_KEY: context.MAILGUN_API_KEY,
    ACCOUNT_SID: context.ACCOUNT_SID,
    AUTH_TOKEN: context.AUTH_TOKEN
  };

  const missingVars = [];
  const invalidVars = [];

  for (const [varName, varValue] of Object.entries(requiredEnvVars)) {
    if (!varValue) {
      missingVars.push(varName);
    } else {
      // Basic format validation
      switch (varName) {
        case 'ADMIN_EMAIL':
          if (!varValue.includes('@') || !varValue.includes('.')) {
            invalidVars.push(`${varName} (invalid email format)`);
          }
          break;
        case 'MAILGUN_DOMAIN':
          if (!varValue.includes('.')) {
            invalidVars.push(`${varName} (invalid domain format)`);
          }
          break;
        case 'MAILGUN_API_KEY':
          // Mailgun API keys can start with 'key-' (domain keys) or other prefixes (private keys)
          // Just check that it's a reasonable length and not obviously invalid
          if (varValue.length < 20) {
            invalidVars.push(`${varName} (appears too short - should be at least 20 characters)`);
          }
          break;
        case 'ACCOUNT_SID':
          if (!varValue.startsWith('AC')) {
            invalidVars.push(`${varName} (should start with 'AC')`);
          }
          break;
        case 'AUTH_TOKEN':
          if (varValue.length < 20) {
            invalidVars.push(`${varName} (appears too short)`);
          }
          break;
      }
    }
  }

  if (missingVars.length > 0) {
    const errorMsg = `Missing required environment variables: ${missingVars.join(', ')}`;
    console.error('Environment validation failed:', errorMsg);
    return callback(errorMsg);
  }

  if (invalidVars.length > 0) {
    const errorMsg = `Invalid environment variable formats: ${invalidVars.join(', ')}`;
    console.error('Environment validation failed:', errorMsg);
    return callback(errorMsg);
  }

  console.log('Environment variable validation passed successfully');

  // Extract event data
  const recordingUrl = event.RecordingUrl;
  const caller = event.From || event.callerNumber || 'Unknown Caller';
  const called = event.To || event.calledNumber || 'Unknown Number';
  const recordingSid = event.RecordingSid;
  const transcriptionText = event.TranscriptionText || 'Transcription not available';
  
  // Use event.Timestamp if available for precise recording time (UTC format)
  const timestamp = event.Timestamp ? new Date(event.Timestamp * 1000).toISOString() : new Date().toISOString();

  if (!recordingUrl || !recordingSid) {
    console.error('Required recording information missing:', { recordingUrl, recordingSid });
    return callback('Recording URL and SID are required');
  }

  try {
    // Append .wav if not present (Twilio RecordingUrl is base; media fetch needs extension)
    let fullRecordingUrl = recordingUrl;
    if (!fullRecordingUrl.endsWith('.wav')) {
      fullRecordingUrl += '.wav';
    }

    console.log('Fetching recording from URL:', fullRecordingUrl);

    // Fetch the recording audio with authentication
    const response = await axios.get(fullRecordingUrl, { 
      responseType: 'arraybuffer',
      auth: {
        username: context.ACCOUNT_SID,
        password: context.AUTH_TOKEN
      },
      timeout: 30000 // 30 second timeout as recommended by Twilio Support
    });

    const audioBuffer = Buffer.from(response.data);
    const fileSizeInMB = audioBuffer.length / (1024 * 1024);
    
    console.log('Recording fetched successfully, size:', audioBuffer.length, 'bytes', `(${fileSizeInMB.toFixed(2)} MB)`);

    // File size check as recommended by Twilio Support
    const maxFileSizeMB = 20; // Conservative limit below Mailgun's 25MB to account for email overhead
    if (fileSizeInMB > maxFileSizeMB) {
      console.warn(`Recording file size (${fileSizeInMB.toFixed(2)} MB) exceeds maximum (${maxFileSizeMB} MB). Sending download link instead of attachment.`);
      
      // Send email with download link instead of attachment for large files
      const emailBody = `
New voicemail received:

From: ${caller}
To: ${called}
Date: ${timestamp}
Recording ID: ${recordingSid}
File Size: ${fileSizeInMB.toFixed(2)} MB

Transcription:
${transcriptionText}

The voicemail recording is too large to attach directly. 
You can access it here: ${recordingUrl}

Note: This link requires Twilio account authentication to access.

---
This is an automated message. Please do not reply.
      `.trim();

      // Prepare email without attachment
      const form = new FormData();
      form.append('from', `Voicemail Alert <voicemail@${context.MAILGUN_DOMAIN}>`);
      form.append('to', context.ADMIN_EMAIL);
      form.append('subject', `New Voicemail from ${caller} (Large File - Download Link)`);
      form.append('text', emailBody);

      // Send to Mailgun without attachment
      const mailgunResponse = await axios.post(
        `https://api.mailgun.net/v3/${context.MAILGUN_DOMAIN}/messages`,
        form,
        {
          auth: { username: 'api', password: context.MAILGUN_API_KEY },
          headers: form.getHeaders(),
          timeout: 30000
        }
      );

      console.log('Large file email (download link) sent successfully. Mailgun ID:', mailgunResponse.data.id);
      
      return callback(null, { 
        success: true, 
        mailgunId: mailgunResponse.data.id,
        emailSentTo: context.ADMIN_EMAIL,
        recordingSid: recordingSid,
        attachmentMethod: 'download_link',
        fileSizeMB: fileSizeInMB.toFixed(2)
      });
    }

    // Prepare Mailgun multipart form
    const form = new FormData();
    form.append('from', `Voicemail Alert <voicemail@${context.MAILGUN_DOMAIN}>`);
    form.append('to', context.ADMIN_EMAIL);
    form.append('subject', `New Voicemail from ${caller}`);
    
    // Create detailed email body
    const emailBody = `
New voicemail received:

From: ${caller}
To: ${called}
Date: ${timestamp}
Recording ID: ${recordingSid}

Transcription:
${transcriptionText}

The audio recording is attached to this email.

---
This is an automated message. Please do not reply.
    `.trim();
    
    form.append('text', emailBody);
    form.append('attachment', audioBuffer, { 
      filename: `voicemail-${recordingSid}.wav`, 
      contentType: 'audio/wav' 
    });

    console.log('Sending email to:', context.ADMIN_EMAIL);

    // Send to Mailgun
    const mailgunResponse = await axios.post(
      `https://api.mailgun.net/v3/${context.MAILGUN_DOMAIN}/messages`,
      form,
      {
        auth: { username: 'api', password: context.MAILGUN_API_KEY },
        headers: form.getHeaders(),
        timeout: 30000 // 30 second timeout
      }
    );

    // Enhanced logging for observability as recommended by Twilio Support
    console.log('Email sent successfully. Details:', {
      mailgunId: mailgunResponse.data.id,
      emailSentTo: context.ADMIN_EMAIL,
      recordingSid: recordingSid,
      fileSizeMB: fileSizeInMB.toFixed(2),
      attachmentMethod: 'direct_attachment',
      timestamp: new Date().toISOString(),
      caller: caller,
      deliveryStatus: 'sent'
    });

    return callback(null, { 
      success: true, 
      mailgunId: mailgunResponse.data.id,
      emailSentTo: context.ADMIN_EMAIL,
      recordingSid: recordingSid,
      attachmentMethod: 'direct_attachment',
      fileSizeMB: fileSizeInMB.toFixed(2)
    });

  } catch (error) {
    // Enhanced error logging for observability as recommended by Twilio Support
    const errorMessage = error.message || 'Unknown error';
    const responseData = error.response ? error.response.data : 'No response data';
    const statusCode = error.response ? error.response.status : 'No status code';
    const errorType = error.code || 'unknown_error';

    console.error('Error sending voicemail email. Details:', {
      errorType: errorType,
      message: errorMessage,
      statusCode: statusCode,
      responseData: responseData,
      recordingSid: recordingSid,
      caller: caller,
      timestamp: new Date().toISOString(),
      emailRecipient: context.ADMIN_EMAIL,
      mailgunDomain: context.MAILGUN_DOMAIN,
      deliveryStatus: 'failed',
      stage: error.response ? 'mailgun_api' : 'recording_fetch'
    });

    return callback(`Failed to send voicemail email: ${errorMessage}`);
  }
};