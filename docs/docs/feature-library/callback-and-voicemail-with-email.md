# Callback and Voicemail with Email Notifications

This feature enhances the standard Callback and Voicemail functionality by automatically sending email notifications with voicemail recordings as attachments when callers leave voicemails.

## Feature Summary

The Callback and Voicemail with Email Notifications feature provides all the functionality of the original callback and voicemail feature, plus automated email notifications to administrators when voicemails are received.

### Key Capabilities

- **Callback Requests**: Callers can request callbacks and maintain their place in queue
- **Voicemail Recording**: Callers can leave voicemails when agents are unavailable  
- **Email Notifications**: Automatic email alerts sent to administrators with voicemail attachments
- **Flexible Configuration**: Email notifications can be enabled/disabled independently
- **Multiple Email Providers**: Support for Mailgun with extensible architecture

### Use Cases

This feature is ideal for organizations that need:

- **Compliance Documentation**: Automated record-keeping of all voicemails
- **Administrator Alerts**: Immediate notification when voicemails are received
- **Remote Access**: Voicemail access via email when not at the desk
- **Backup Systems**: Email-based voicemail storage for redundancy

## Technical Implementation

### Architecture Overview

The feature extends the callback-and-voicemail functionality with an additional email notification layer:

1. **Caller Experience**: Identical to standard callback/voicemail feature
2. **Voicemail Processing**: Standard Twilio recording and transcription
3. **Task Creation**: Normal Flex task routing for agent handling
4. **Email Notification**: Parallel process that sends voicemail via email

### Email Integration

When a voicemail is recorded:

1. The voicemail is processed normally through Flex workflows
2. A separate email function is triggered asynchronously
3. The recording is fetched from Twilio's servers
4. An email is composed with the recording as a .wav attachment
5. The email is sent via the configured email provider (Mailgun)
6. Both processes complete independently for resilience

## Setup and Configuration

### Prerequisites

- Standard callback-and-voicemail feature requirements
- Email service provider account (Mailgun recommended)
- Admin email address for notifications
- Email provider API credentials

### Environment Variables

The feature requires these additional environment variables in your Twilio Functions:

```bash
# Email Configuration
ADMIN_EMAIL=admin@yourorganization.org
MAILGUN_DOMAIN=voicemail.yourorganization.org  
MAILGUN_API_KEY=key-1234567890abcdef1234567890abcdef
```

### Feature Configuration

Enable the feature in your Flex configuration:

```json
{
  "features": {
    "callback_and_voicemail_with_email": {
      "enabled": true,
      "allow_requeue": true,
      "max_attempts": 3,
      "auto_select_task": false,
      "enable_email_notifications": true,
      "admin_email": "admin@yourorganization.org",
      "mailgun_domain": "voicemail.yourorganization.org",
      "mailgun_api_key": "key-1234567890abcdef1234567890abcdef"
    }
  }
}
```

## Email Provider Setup

### Mailgun Configuration

For detailed Mailgun setup instructions, see:
- [Mailgun Setup Guide](../developers/building/feature-management/channels/voice/voicemail/mailgun-setup.md)

Key steps include:

1. **Create Mailgun Account**: Free tier available
2. **Domain Verification**: Set up DNS records for your domain
3. **API Key Generation**: Create and secure your API credentials
4. **DNS Configuration**: Configure SPF, DKIM, and MX records
5. **Testing**: Verify email delivery before production

### Alternative Email Providers

The feature architecture supports additional email providers. To add support for other services:

1. Create a new email handler function in `/serverless-functions/src/functions/features/callback-and-voicemail-with-email/email-providers/`
2. Update the main wait-experience function to use your new provider
3. Add the necessary environment variables and configuration options

## Deployment

### Infrastructure as Code

The feature includes complete Terraform configuration:

- **Terraform Module**: `/infra-as-code/terraform/modules/callback-and-voicemail-with-email/`
- **Workflows**: TaskRouter workflow for callback/voicemail routing
- **Studio Flows**: Complete Studio Flow with email integration
- **Functions**: Serverless functions for callback, voicemail, and email processing

### Manual Deployment

1. **Deploy Serverless Functions**:
   ```bash
   cd serverless-functions
   npm run deploy
   ```

2. **Apply Infrastructure**:
   ```bash
   cd infra-as-code/terraform/environments/default
   terraform init
   terraform plan -var-file="local.tfvars"
   terraform apply -var-file="local.tfvars"
   ```

3. **Configure Environment Variables**:
   - Set email provider credentials in Twilio Functions
   - Configure admin email addresses
   - Test email delivery

## Monitoring and Troubleshooting

### Email Delivery Monitoring

Monitor email delivery through:

- **Mailgun Dashboard**: Track delivery rates, bounces, and failures
- **Twilio Function Logs**: Monitor email function execution
- **Admin Email**: Set up test voicemails to verify delivery

### Common Issues

**No emails received:**
- Verify email provider configuration and API keys
- Check DNS records for email domain
- Review Function logs for errors
- Test email provider independently

**Emails without attachments:**
- Verify recording URL accessibility
- Check Twilio authentication in email function
- Review file size limits (most providers: 25MB)
- Confirm .wav format compatibility

**Voicemail tasks not routing:**
- Standard callback-and-voicemail troubleshooting applies
- Email functionality runs independently of task routing

## Security Considerations (Twilio Support Validated)

### API Key Management

- Store all API keys in Twilio Functions environment variables (Twilio recommended pattern)
- Never include credentials in code repositories
- Rotate API keys quarterly
- Use separate keys for production and development
- Enhanced validation ensures proper credential formats

### Recording Access Security

- Uses standard Twilio ACCOUNT_SID/AUTH_TOKEN pattern for recording retrieval
- Recordings accessed only within secure Twilio Functions environment
- No credential exposure in logs or error messages
- Time-limited access to recordings for email processing only

### Email Security

- Use dedicated subdomains for email sending
- Implement proper DNS security records (SPF, DKIM, DMARC)
- Monitor email reputation and delivery rates
- Set up proper reverse DNS records

### Data Privacy

- Voicemail recordings contain sensitive customer data
- Ensure email provider complies with your privacy requirements
- Consider encryption for email transmission and storage
- Implement proper retention policies for voicemail emails
- Large files use secure download links instead of direct transmission

## Performance and Scalability

### Expected Performance

- **Email Delivery**: Typically 1-5 seconds after voicemail completion
- **File Size**: .wav recordings are typically 1-10MB depending on length
- **Throughput**: Scales with email provider limits (Mailgun: 100/hour free tier)

### File Size Management (Twilio Support Recommended)

The feature includes intelligent file size handling:

- **Small Files (< 20MB)**: Attached directly to email
- **Large Files (≥ 20MB)**: Email contains secure download link instead of attachment
- **Timeout Protection**: 30-second timeout for recording downloads
- **Size Logging**: All file sizes logged for monitoring and optimization

### Optimization Recommendations

- **Recording Quality**: Balance audio quality with file size
- **Email Templates**: Use efficient HTML templates to reduce processing time
- **Error Handling**: Comprehensive error logging with structured data for monitoring
- **Monitoring**: Enhanced observability with detailed success/failure logging

### Scaling Considerations (Twilio Support Validated)

For high-volume deployments:

- **Email Provider**: Upgrade to paid email service plans
- **Function Timeout**: Current 30-second timeout handles most use cases
- **Queue Processing**: For very high volume, consider Twilio Event Streams or external queuing
- **Backup Systems**: Implement alternative notification methods
- **Observability**: Use structured logging for monitoring and alerting

## Cost Considerations

### Email Provider Costs

- **Mailgun**: Free tier (100 emails/day), paid plans start at $35/month
- **Data Transfer**: Outbound attachment data may incur additional costs
- **Volume Planning**: Estimate monthly voicemail volume for cost planning

### Twilio Costs

- **Function Execution**: Additional compute time for email processing
- **Storage**: Recording storage costs (standard Twilio rates)
- **API Calls**: Minimal additional API usage for email functions

## Feature Comparison

| Feature | Callback & Voicemail | Callback & Voicemail with Email |
|---------|---------------------|----------------------------------|
| Callback Requests | ✅ | ✅ |
| Voicemail Recording | ✅ | ✅ |
| Flex Task Creation | ✅ | ✅ |
| Agent Interface | ✅ | ✅ |
| Email Notifications | ❌ | ✅ |
| Voicemail Attachments | ❌ | ✅ |
| Admin Alerts | ❌ | ✅ |
| Email Configuration | ❌ | ✅ |

## Related Documentation

- [Callback and Voicemail (Standard)](./callback-and-voicemail.md)
- [Mailgun Email Setup](../developers/building/feature-management/channels/voice/voicemail/mailgun-setup.md)
- [SendGrid Email Setup](../developers/building/feature-management/channels/voice/voicemail/sendgrid-setup.md)
- [Voice Channel Overview](../end-users/cbo-admins/voice/)

## Support and Maintenance

### Regular Maintenance

- **Monthly**: Test complete voicemail-to-email workflow
- **Quarterly**: Review email delivery metrics and costs
- **Annually**: Rotate API keys and review security configuration

### Getting Help

For support with this feature:

1. Check Function logs in Twilio Console
2. Review email provider delivery logs
3. Test individual components (recording, email, task routing)
4. Consult the troubleshooting sections in this documentation

The Callback and Voicemail with Email Notifications feature provides enterprise-grade voicemail management with automated documentation and administrator alerting, perfect for organizations requiring comprehensive communication records.