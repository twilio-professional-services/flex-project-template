---
sidebar_label: Mailgun Setup
sidebar_position: 2
title: "Mailgun Email Setup for Voicemail Notifications"
---

# Mailgun Email Setup for Voicemail Notifications

This guide helps you implement Mailgun integration to send automated email notifications when callers leave voicemails in your Connie system. Voicemail audio files will be automatically emailed to admin mailboxes for compliance and record-keeping.

## Prerequisites

- ✅ Twilio account with Flex enabled and a phone number configured
- ✅ Mailgun account (free tier available)
- ✅ A domain name you control (or subdomain)
- ✅ Access to your domain's DNS settings
- ✅ Basic knowledge of JSON for Studio imports and Node.js for Functions

## Architecture Overview

This implementation creates an automated workflow where:

1. **Caller leaves voicemail** → Recorded in Twilio Studio
2. **Voicemail triggers serverless function** → Processes recording
3. **Function calls Mailgun API** → Sends email with attachment
4. **Admin receives notification** → With audio file attached
5. **Original voicemail task** → Routes to Flex agents normally

The system maintains compliance records while keeping your normal workflow intact.

---

## Step 1: Set Up Your Mailgun Account

### Sign Up for Mailgun

1. Go to [mailgun.com](https://mailgun.com) and sign up for a free account
2. Verify your email address and log into your dashboard
3. Note your account region (US or EU) - you'll need this later

### Add and Verify Your Domain

For best email deliverability, use a subdomain dedicated to voicemail notifications:

**Recommended subdomain**: `voicemail.yourdomain.com`  
**Example**: If your organization is `helpinghand.org`, use `voicemail.helpinghand.org`

1. In Mailgun dashboard, go to **Sending** → **Domains**
2. Click **Add New Domain**
3. Enter your subdomain (e.g., `voicemail.helpinghand.org`)
4. Select your region (US or EU)
5. Click **Add Domain**

### Configure DNS Records

Mailgun will provide DNS records you need to add to your domain. In your domain registrar (GoDaddy, Namecheap, etc.):

**Required Records:**
- **TXT Record** - For SPF authentication
- **TXT Record** - For DKIM authentication  
- **CNAME Record** - For tracking
- **MX Record** - For receiving (optional but recommended)

**Example DNS Setup:**
```
Type: TXT
Name: voicemail.helpinghand.org
Value: v=spf1 include:mailgun.org ~all

Type: TXT  
Name: smtp._domainkey.voicemail.helpinghand.org
Value: k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQ...

Type: CNAME
Name: email.voicemail.helpinghand.org  
Value: mailgun.org

Type: MX
Name: voicemail.helpinghand.org
Value: 10 mxa.mailgun.org
```

:::tip DNS Propagation
DNS changes can take up to 24 hours to propagate. You can check status in your Mailgun dashboard under **Domains** → **Your Domain** → **Domain Verification**.
:::

---

## Step 2: Get Your Mailgun API Credentials

### Generate API Key

1. In Mailgun dashboard, go to **Settings** → **API Keys**
2. Click **Create New Key** 
3. Give it a name like "Connie Voicemail Notifications"
4. Copy the generated API key - it looks like: `key-1234567890abcdef1234567890abcdef`

### Note Your Domain and Region

You'll need these values for configuration:

- **Domain**: Your verified domain (e.g., `voicemail.helpinghand.org`)
- **Region**: Either `us` or `eu` depending on your account
- **API Endpoint**: 
  - US: `https://api.mailgun.net`
  - EU: `https://api.eu.mailgun.net`

### Test Your Setup

Send a test email to verify everything works:

1. In Mailgun dashboard, go to **Sending** → **Overview**
2. Use the **Send Test Email** feature
3. Send to your admin email address
4. Confirm the email arrives in your inbox

---

## Step 3: Configure Twilio Studio Flow

### Import the Studio Flow

1. Log into your [Twilio Console](https://console.twilio.com)
2. Go to **Studio** → **Flows**
3. Click **Create New Flow**
4. Choose **Import from JSON**
5. Paste the following flow configuration:

```json
{
  "description": "Connie Voicemail with Email Notifications",
  "states": [
    {
      "name": "Trigger",
      "type": "trigger",
      "transitions": [
        { "event": "incomingMessage" },
        { "next": "greet_and_offer_options", "event": "incomingCall" },
        { "event": "incomingConversationMessage" },
        { "event": "incomingRequest" },
        { "event": "incomingParent" }
      ],
      "properties": {
        "offset": { "x": 0, "y": 0 }
      }
    },
    {
      "name": "greet_and_offer_options",
      "type": "say-play",
      "transitions": [
        { "next": "gather_input", "event": "audioComplete" }
      ],
      "properties": {
        "offset": { "x": 180, "y": 200 },
        "loop": 1,
        "say": "Welcome to our organization. Press 1 to request a callback, 2 to leave a voicemail, or 3 to wait for the next available agent."
      }
    },
    {
      "name": "gather_input",
      "type": "gather-input-on-call",
      "transitions": [
        { "next": "branch_on_input", "event": "keypress" },
        { "next": "greet_and_offer_options", "event": "speech" },
        { "next": "greet_and_offer_options", "event": "timeout" }
      ],
      "properties": {
        "offset": { "x": 180, "y": 450 },
        "speech_timeout": "auto",
        "stop_gather": true,
        "number_of_digits": 1,
        "timeout": 5
      }
    },
    {
      "name": "branch_on_input",
      "type": "split-based-on",
      "transitions": [
        {
          "next": "invalid_option",
          "event": "noMatch"
        },
        {
          "next": "request_callback",
          "event": "match",
          "conditions": [
            {
              "friendly_name": "If value equal_to 1",
              "arguments": [ "{{widgets.gather_input.Digits}}" ],
              "type": "equal_to",
              "value": "1"
            }
          ]
        },
        {
          "next": "record_voicemail_1",
          "event": "match",
          "conditions": [
            {
              "friendly_name": "If value equal_to 2",
              "arguments": [ "{{widgets.gather_input.Digits}}" ],
              "type": "equal_to",
              "value": "2"
            }
          ]
        },
        {
          "next": "send_to_flex_queue",
          "event": "match",
          "conditions": [
            {
              "friendly_name": "If value equal_to 3",
              "arguments": [ "{{widgets.gather_input.Digits}}" ],
              "type": "equal_to",
              "value": "3"
            }
          ]
        }
      ],
      "properties": {
        "input": "{{widgets.gather_input.Digits}}",
        "offset": { "x": 180, "y": 700 }
      }
    },
    {
      "name": "invalid_option",
      "type": "say-play",
      "transitions": [
        { "next": "greet_and_offer_options", "event": "audioComplete" }
      ],
      "properties": {
        "offset": { "x": 400, "y": 700 },
        "loop": 1,
        "say": "Sorry, that was not a valid option. Please try again."
      }
    },
    {
      "name": "request_callback",
      "type": "say-play",
      "transitions": [
        { "next": "gather_callback_number", "event": "audioComplete" }
      ],
      "properties": {
        "offset": { "x": -200, "y": 1000 },
        "loop": 1,
        "say": "Please enter your phone number for callback, followed by the pound key."
      }
    },
    {
      "name": "gather_callback_number",
      "type": "gather-input-on-call",
      "transitions": [
        { "next": "send_callback_to_flex", "event": "keypress" },
        { "next": "request_callback", "event": "speech" },
        { "next": "request_callback", "event": "timeout" }
      ],
      "properties": {
        "offset": { "x": -200, "y": 1250 },
        "speech_timeout": "auto",
        "stop_gather": true,
        "finish_on_key": "#",
        "timeout": 10
      }
    },
    {
      "name": "send_callback_to_flex",
      "type": "send-to-flex",
      "transitions": [
        { "event": "callComplete" },
        { "event": "failedToEnqueue" },
        { "event": "callFailure" }
      ],
      "properties": {
        "offset": { "x": -200, "y": 1500 },
        "workflow": "YOUR-WORKFLOW-SID",
        "channel": "YOUR-CHANNEL-SID",
        "attributes": "{ \"type\": \"callback_request\", \"caller\": \"{{trigger.From}}\", \"callback_number\": \"{{widgets.gather_callback_number.Digits}}\" }",
        "priority": "0",
        "timeout": "3600"
      }
    },
    {
      "name": "record_voicemail_1",
      "type": "record-voicemail",
      "transitions": [
        { "next": "send_voicemail_to_flex", "event": "recordingComplete" },
        { "event": "noAudio" },
        { "event": "hangup" }
      ],
      "properties": {
        "transcribe": true,
        "offset": { "x": 180, "y": 1000 },
        "trim": "trim-silence",
        "play_beep": "true",
        "recording_status_callback_url": "https://YOUR-FUNCTION-URL.twil.io/voicemail-handler",
        "timeout": 5,
        "max_length": 300
      }
    },
    {
      "name": "send_voicemail_to_flex",
      "type": "send-to-flex",
      "transitions": [
        { "event": "callComplete" },
        { "event": "failedToEnqueue" },
        { "event": "callFailure" }
      ],
      "properties": {
        "offset": { "x": 180, "y": 1250 },
        "workflow": "YOUR-WORKFLOW-SID",
        "channel": "YOUR-CHANNEL-SID",
        "attributes": "{ \"type\": \"voicemail\", \"recording_url\": \"{{widgets.record_voicemail_1.RecordingUrl}}\", \"caller\": \"{{trigger.From}}\" }",
        "priority": "0",
        "timeout": "3600"
      }
    },
    {
      "name": "send_to_flex_queue",
      "type": "send-to-flex",
      "transitions": [
        { "event": "callComplete" },
        { "event": "failedToEnqueue" },
        { "event": "callFailure" }
      ],
      "properties": {
        "offset": { "x": 600, "y": 1000 },
        "workflow": "YOUR-WORKFLOW-SID",
        "channel": "YOUR-CHANNEL-SID",
        "attributes": "{ \"type\": \"queue_to_flex\", \"caller\": \"{{trigger.From}}\" }",
        "priority": "0",
        "timeout": "3600"
      }
    }
  ],
  "initial_state": "Trigger",
  "flags": {
    "allow_concurrent_calls": true
  }
}
```

:::warning Update Required Values
Before saving the flow, you'll need to update these placeholders:
- `YOUR-FUNCTION-URL` - Your Twilio Functions domain (Step 4)
- `YOUR-WORKFLOW-SID` - Your Flex Workflow SID
- `YOUR-CHANNEL-SID` - Your Flex Channel SID
:::

---

## Step 4: Create the Email Function

### Set Up Twilio Functions

1. In Twilio Console, go to **Functions & Assets** → **Services**
2. Click **Create Service**
3. Name it "voicemail-email-handler"
4. Click **Next** → **Add Function**
5. Name the function `/voicemail-handler`

### Add the Function Code

```javascript
const Mailgun = require('mailgun.js');

exports.handler = async function(context, event, callback) {
  console.log('Voicemail handler triggered:', event);
  
  // Get environment variables
  const mailgunApiKey = context.MAILGUN_API_KEY;
  const mailgunDomain = context.MAILGUN_DOMAIN;
  const adminEmail = context.ADMIN_EMAIL;
  
  // Validate required parameters
  if (!event.RecordingUrl || !event.From) {
    console.error('Missing required parameters');
    return callback(null, { success: false, message: 'Missing parameters' });
  }
  
  try {
    // Initialize Mailgun
    const mailgun = new Mailgun(FormData);
    const mg = mailgun.client({
      username: 'api',
      key: mailgunApiKey,
      url: 'https://api.mailgun.net' // Change to https://api.eu.mailgun.net for EU
    });
    
    // Download the recording
    const recordingResponse = await fetch(event.RecordingUrl + '.wav');
    const recordingBuffer = await recordingResponse.buffer();
    
    // Prepare email data
    const messageData = {
      from: `Connie Voicemail <noreply@${mailgunDomain}>`,
      to: adminEmail,
      subject: `New Voicemail from ${event.From}`,
      text: `A new voicemail has been received from ${event.From}.\n\nTimestamp: ${new Date().toLocaleString()}\nRecording URL: ${event.RecordingUrl}\n\nThe voicemail audio file is attached to this email.`,
      html: `
        <h2>New Voicemail Received</h2>
        <p><strong>From:</strong> ${event.From}</p>
        <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Recording URL:</strong> <a href="${event.RecordingUrl}">${event.RecordingUrl}</a></p>
        <p>The voicemail audio file is attached to this email.</p>
        <hr>
        <p><em>This is an automated message from your Connie system.</em></p>
      `,
      attachment: [
        {
          data: recordingBuffer,
          filename: `voicemail_${event.From}_${Date.now()}.wav`,
          contentType: 'audio/wav'
        }
      ]
    };
    
    // Send email
    const result = await mg.messages.create(mailgunDomain, messageData);
    console.log('Email sent successfully:', result);
    
    return callback(null, { 
      success: true, 
      messageId: result.id,
      message: 'Voicemail email sent successfully' 
    });
    
  } catch (error) {
    console.error('Error sending voicemail email:', error);
    return callback(null, { 
      success: false, 
      message: error.message 
    });
  }
};
```

### Configure Environment Variables

1. In your Function service, go to **Settings** → **Environment Variables**
2. Add these variables:

| Variable | Value | Example |
|----------|--------|---------|
| `MAILGUN_API_KEY` | Your Mailgun API key | `key-1234567890abcdef...` |
| `MAILGUN_DOMAIN` | Your verified domain | `voicemail.helpinghand.org` |
| `ADMIN_EMAIL` | Where to send notifications | `admin@helpinghand.org` |

### Add Dependencies

1. Go to **Settings** → **Dependencies**
2. Add this dependency:

```json
{
  "mailgun.js": "^8.0.6"
}
```

### Deploy the Function

1. Click **Deploy All**
2. Wait for deployment to complete
3. Copy your function URL (it will look like: `https://voicemail-handler-1234.twil.io/voicemail-handler`)

---

## Step 5: Update Your Studio Flow

### Connect the Function

1. Go back to your Studio Flow
2. Edit the `record_voicemail_1` widget
3. Update the `recording_status_callback_url` to your function URL
4. Save and publish the flow

### Connect to Your Phone Number

1. In Twilio Console, go to **Phone Numbers** → **Manage** → **Active Numbers**
2. Click on your Connie phone number
3. In the **Voice Configuration** section:
   - Set **A call comes in** to your new Studio Flow
4. Save the configuration

---

## Step 6: Test Your Setup

### Test the Complete Flow

1. **Call your Connie number**
2. **Press 2** when prompted (for voicemail)
3. **Leave a test message** and hang up
4. **Check your admin email** - you should receive:
   - Email notification with voicemail details
   - Attached .wav audio file
5. **Check Flex** - the voicemail task should appear normally

### Troubleshooting Common Issues

**No email received?**
- Check your Mailgun logs in the dashboard
- Verify DNS records are properly configured
- Confirm API key and domain are correct in Function environment variables

**Email sent but no attachment?**
- Check Function logs for errors
- Verify the recording URL is accessible
- Ensure Mailgun account has sufficient quota

**Voicemail not routing to Flex?**
- Check your Workflow and Channel SIDs in the Studio Flow
- Verify Flex configuration is correct

---

## Security Best Practices

### Environment Variables
- Never hardcode API keys in your function code
- Use Twilio Functions environment variables for all secrets
- Rotate API keys regularly (quarterly recommended)

### Domain Security
- Use dedicated subdomains for email sending
- Implement SPF, DKIM, and DMARC records
- Monitor DNS records for unauthorized changes

### Function Security
- Validate all input parameters
- Implement proper error handling
- Log activities for audit purposes
- Use HTTPS only for all API calls

---

## Monitoring and Maintenance

### Regular Checks
- **Monthly**: Test the complete voicemail-to-email flow
- **Quarterly**: Review Mailgun usage and costs
- **Annually**: Rotate API keys and review security settings

### Monitoring Tools
- **Mailgun Dashboard**: Track delivery rates and bounces
- **Twilio Console**: Monitor Function execution logs
- **DNS Monitoring**: Ensure domain records remain correct

### Performance Optimization
- Monitor email delivery times
- Optimize recording file sizes if needed
- Review and clean up old recordings periodically

---

## Next Steps

### Additional Features
- **Multiple Recipients**: Send notifications to multiple admin emails
- **Email Templates**: Create branded email templates
- **Priority Handling**: Implement urgency detection for critical voicemails
- **Integration**: Connect with CRM systems for customer context

### Scaling Considerations
- **Volume Planning**: Review Mailgun limits for high-volume deployments
- **Error Handling**: Implement retry logic for failed email deliveries
- **Backup Systems**: Set up alternative notification methods

Your Mailgun-powered voicemail notification system is now ready for production use!