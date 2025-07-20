---
sidebar_label: SendGrid Setup
sidebar_position: 3
title: "SendGrid Email Setup for Voicemail Notifications"
---

# SendGrid Email Setup for Voicemail Notifications

This guide helps you implement SendGrid integration to send automated email notifications when callers leave voicemails in your Connie system. Voicemail audio files will be automatically emailed to admin mailboxes for compliance and record-keeping.

## Prerequisites

- ✅ Twilio account with Flex enabled and a phone number configured
- ✅ SendGrid account (free tier available)
- ✅ A domain name you control (or subdomain)
- ✅ Access to your domain's DNS settings
- ✅ Basic knowledge of JSON for Studio imports and Node.js for Functions

## Architecture Overview

This implementation creates an automated workflow where:

1. **Caller leaves voicemail** → Recorded in Twilio Studio
2. **Voicemail triggers serverless function** → Processes recording
3. **Function calls SendGrid API** → Sends email with attachment
4. **Admin receives notification** → With audio file attached
5. **Original voicemail task** → Routes to Flex agents normally

The system maintains compliance records while keeping your normal workflow intact.

---

## Step 1: Set Up Your SendGrid Account

### Sign Up for SendGrid

1. Go to [sendgrid.com](https://sendgrid.com) and sign up for a free account
2. Verify your email address and complete account setup
3. Navigate to the SendGrid dashboard

### Verify Your Sender Identity

SendGrid requires sender verification for email delivery. You have two options:

**Option A: Domain Authentication (Recommended)**
1. Go to **Settings** → **Sender Authentication** → **Domain Authentication**
2. Click **Authenticate Your Domain**
3. Enter your domain (e.g., `helpinghand.org`)
4. Choose your DNS host provider
5. Add the provided DNS records to your domain

**Option B: Single Sender Verification**
1. Go to **Settings** → **Sender Authentication** → **Single Sender Verification**
2. Click **Create New Sender**
3. Fill in sender details (name, email, address)
4. Verify the email address

### Configure DNS Records (Domain Authentication)

If using domain authentication, add these DNS records:

**Example DNS Setup:**
```
Type: CNAME
Name: s1._domainkey.helpinghand.org
Value: s1.domainkey.u1234567.wl123.sendgrid.net

Type: CNAME  
Name: s2._domainkey.helpinghand.org
Value: s2.domainkey.u1234567.wl123.sendgrid.net

Type: CNAME
Name: em1234.helpinghand.org
Value: u1234567.wl123.sendgrid.net
```

:::tip DNS Propagation
DNS changes can take up to 48 hours to propagate. You can check verification status in your SendGrid dashboard.
:::

---

## Step 2: Get Your SendGrid API Key

### Generate API Key

1. In SendGrid dashboard, go to **Settings** → **API Keys**
2. Click **Create API Key**
3. Choose **Restricted Access**
4. Give it a name like "Connie Voicemail Notifications"
5. Set permissions:
   - **Mail Send**: Full Access
   - **Mail Settings**: Read Access (optional)
6. Click **Create & View**
7. Copy the generated API key - it starts with `SG.`

:::warning Save Your API Key
SendGrid only shows the API key once. Save it securely - you won't be able to view it again.
:::

### Test Your Setup

Send a test email to verify everything works:

1. In SendGrid dashboard, go to **Email API** → **Dynamic Templates** (optional)
2. Or use the API test in your function (Step 4)

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
  "description": "Connie Voicemail with SendGrid Email Notifications",
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
        "recording_status_callback_url": "https://YOUR-FUNCTION-URL.twil.io/sendgrid-voicemail-handler",
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
3. Name it "sendgrid-voicemail-handler"
4. Click **Next** → **Add Function**
5. Name the function `/sendgrid-voicemail-handler`

### Add the Function Code

```javascript
const sgMail = require('@sendgrid/mail');

exports.handler = async function(context, event, callback) {
  console.log('SendGrid voicemail handler triggered:', event);
  
  // Get environment variables
  const sendGridApiKey = context.SENDGRID_API_KEY;
  const fromEmail = context.FROM_EMAIL;
  const adminEmail = context.ADMIN_EMAIL;
  
  // Validate required parameters
  if (!event.RecordingUrl || !event.From) {
    console.error('Missing required parameters');
    return callback(null, { success: false, message: 'Missing parameters' });
  }
  
  // Validate environment variables
  if (!sendGridApiKey || !fromEmail || !adminEmail) {
    console.error('Missing required environment variables');
    return callback(null, { success: false, message: 'Missing configuration' });
  }
  
  try {
    // Set SendGrid API key
    sgMail.setApiKey(sendGridApiKey);
    
    // Download the recording
    const recordingResponse = await fetch(event.RecordingUrl + '.wav');
    const recordingBuffer = await recordingResponse.buffer();
    const recordingBase64 = recordingBuffer.toString('base64');
    
    // Prepare email data
    const msg = {
      to: adminEmail,
      from: fromEmail,
      subject: `New Voicemail from ${event.From}`,
      text: `A new voicemail has been received from ${event.From}.\n\nTimestamp: ${new Date().toLocaleString()}\nRecording URL: ${event.RecordingUrl}\n\nThe voicemail audio file is attached to this email.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Voicemail Received</h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>From:</strong> ${event.From}</p>
            <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Recording URL:</strong> <a href="${event.RecordingUrl}" style="color: #007bff;">${event.RecordingUrl}</a></p>
          </div>
          <p>The voicemail audio file is attached to this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #666; font-size: 14px;"><em>This is an automated message from your Connie system.</em></p>
        </div>
      `,
      attachments: [
        {
          content: recordingBase64,
          filename: `voicemail_${event.From}_${Date.now()}.wav`,
          type: 'audio/wav',
          disposition: 'attachment'
        }
      ]
    };
    
    // Send email
    const result = await sgMail.send(msg);
    console.log('Email sent successfully via SendGrid:', result[0].statusCode);
    
    return callback(null, { 
      success: true, 
      messageId: result[0].headers['x-message-id'],
      statusCode: result[0].statusCode,
      message: 'Voicemail email sent successfully via SendGrid' 
    });
    
  } catch (error) {
    console.error('Error sending voicemail email via SendGrid:', error);
    
    // Handle SendGrid specific errors
    if (error.response) {
      console.error('SendGrid API Error:', error.response.body);
      return callback(null, { 
        success: false, 
        message: `SendGrid API Error: ${error.response.body.errors?.[0]?.message || error.message}`,
        statusCode: error.code
      });
    }
    
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
| `SENDGRID_API_KEY` | Your SendGrid API key | `SG.1234567890abcdef...` |
| `FROM_EMAIL` | Verified sender email | `noreply@helpinghand.org` |
| `ADMIN_EMAIL` | Where to send notifications | `admin@helpinghand.org` |

### Add Dependencies

1. Go to **Settings** → **Dependencies**
2. Add this dependency:

```json
{
  "@sendgrid/mail": "^7.7.0"
}
```

### Deploy the Function

1. Click **Deploy All**
2. Wait for deployment to complete
3. Copy your function URL (it will look like: `https://sendgrid-voicemail-handler-1234.twil.io/sendgrid-voicemail-handler`)

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
- Check your SendGrid Activity Feed in the dashboard
- Verify your sender identity is authenticated
- Confirm API key has Mail Send permissions
- Check Function logs for errors

**Email sent but no attachment?**
- Check Function logs for download errors
- Verify the recording URL is accessible
- Ensure SendGrid account has attachment permissions

**Authentication errors?**
- Verify your API key is correct and has proper permissions
- Check that your FROM_EMAIL is verified in SendGrid
- Ensure DNS records are properly configured

**Voicemail not routing to Flex?**
- Check your Workflow and Channel SIDs in the Studio Flow
- Verify Flex configuration is correct

---

## Advanced Configuration

### Email Templates

SendGrid supports dynamic templates for better email design:

1. In SendGrid, go to **Email API** → **Dynamic Templates**
2. Create a new template with your branding
3. Use template variables for dynamic content:

```javascript
// In your function, replace the msg object with:
const msg = {
  to: adminEmail,
  from: fromEmail,
  templateId: 'd-1234567890abcdef', // Your template ID
  dynamicTemplateData: {
    caller_number: event.From,
    timestamp: new Date().toLocaleString(),
    recording_url: event.RecordingUrl
  },
  attachments: [
    {
      content: recordingBase64,
      filename: `voicemail_${event.From}_${Date.now()}.wav`,
      type: 'audio/wav',
      disposition: 'attachment'
    }
  ]
};
```

### Multiple Recipients

To send notifications to multiple recipients:

```javascript
// Update the TO field in your function:
const msg = {
  to: [
    adminEmail,
    'manager@helpinghand.org',
    'compliance@helpinghand.org'
  ],
  // ... rest of message config
};
```

### Webhook Event Handling

SendGrid can send webhook events for tracking:

1. In SendGrid, go to **Settings** → **Mail Settings** → **Event Webhook**
2. Set your endpoint URL: `https://your-function.twil.io/sendgrid-webhook`
3. Select events to track (delivered, opened, clicked, etc.)

---

## Security Best Practices

### API Key Management
- Use restricted API keys with minimal required permissions
- Rotate API keys regularly (quarterly recommended)
- Never hardcode API keys in your function code
- Store all secrets in Twilio Functions environment variables

### Email Security
- Always use verified sender identities
- Implement SPF, DKIM, and DMARC records for domain authentication
- Monitor for suspicious sending patterns
- Use HTTPS for all webhook endpoints

### Data Privacy
- Limit voicemail retention time
- Encrypt attachments if handling sensitive data
- Implement access controls for admin emails
- Log all email activities for audit purposes

---

## Monitoring and Maintenance

### SendGrid Dashboard Monitoring
- **Activity Feed**: Track all email activity and delivery status
- **Statistics**: Monitor sending volume and engagement metrics
- **Suppressions**: Manage bounced and unsubscribed addresses
- **Alerts**: Set up notifications for sending issues

### Regular Maintenance Tasks
- **Weekly**: Review email delivery statistics
- **Monthly**: Test the complete voicemail-to-email flow
- **Quarterly**: Rotate API keys and review access permissions
- **Annually**: Review and update email templates and branding

### Performance Optimization
- Monitor email delivery times and optimize if needed
- Review attachment sizes and compress if necessary
- Implement error handling and retry logic for failed sends
- Set up alerts for function execution failures

---

## Cost Management

### SendGrid Pricing Tiers
- **Free Tier**: 100 emails/day forever
- **Essentials**: $14.95/month for 50,000 emails
- **Pro**: $89.95/month for 100,000 emails

### Cost Optimization Tips
- Monitor your sending volume in SendGrid dashboard
- Remove inactive recipients to reduce bounce rates
- Use templates to reduce bandwidth usage
- Implement proper error handling to avoid retry costs

---

## Next Steps

### Additional Features
- **SMS Notifications**: Add SMS alerts for urgent voicemails
- **CRM Integration**: Connect with your customer management system
- **Analytics Dashboard**: Build reporting for voicemail metrics
- **Priority Routing**: Implement VIP caller detection

### Scaling Considerations
- **High Volume**: Plan for SendGrid tier upgrades
- **Multiple Locations**: Consider regional SendGrid accounts
- **Backup Systems**: Implement fallback notification methods
- **Load Testing**: Test system under peak call volumes

Your SendGrid-powered voicemail notification system is now ready for production use!