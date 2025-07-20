---
sidebar_label: Choose Your Email Provider
sidebar_position: 1
title: "Choose Your Email Provider"
---

import Link from '@docusaurus/Link';

# Choose Your Email Provider

Select your email service provider to set up automated email notifications for voicemails and other Connie features.

<div style={{
  display: 'flex',
  flexWrap: 'wrap',
  gap: '20px',
  justifyContent: 'center',
  margin: '40px 0'
}}>
  <Link
    to="/developers/building/feature-management/channels/voice/voicemail/mailgun-setup"
    style={{
      textDecoration: 'none',
      color: 'inherit',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      border: '2px solid #e1e4e8',
      borderRadius: '8px',
      backgroundColor: '#f6f8fa',
      transition: 'all 0.3s ease',
      minWidth: '200px',
      maxWidth: '250px'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = '#0366d6';
      e.currentTarget.style.backgroundColor = '#f1f8ff';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = '#e1e4e8';
      e.currentTarget.style.backgroundColor = '#f6f8fa';
    }}
  >
    <img 
      src="/img/providers/mailgun-logo.png" 
      alt="Mailgun" 
      style={{
        height: '60px',
        width: 'auto',
        marginBottom: '15px'
      }}
    />
    <strong style={{ fontSize: '16px', marginBottom: '8px' }}>Mailgun</strong>
    <span style={{ fontSize: '14px', color: '#666', textAlign: 'center' }}>
      Reliable transactional email service
    </span>
  </Link>

  <Link
    to="/developers/building/feature-management/channels/voice/voicemail/sendgrid-setup"
    style={{
      textDecoration: 'none',
      color: 'inherit',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      border: '2px solid #e1e4e8',
      borderRadius: '8px',
      backgroundColor: '#f6f8fa',
      transition: 'all 0.3s ease',
      minWidth: '200px',
      maxWidth: '250px'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = '#0366d6';
      e.currentTarget.style.backgroundColor = '#f1f8ff';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = '#e1e4e8';
      e.currentTarget.style.backgroundColor = '#f6f8fa';
    }}
  >
    <img 
      src="/img/providers/sendgrid-logo.png" 
      alt="SendGrid" 
      style={{
        height: '60px',
        width: 'auto',
        marginBottom: '15px'
      }}
    />
    <strong style={{ fontSize: '16px', marginBottom: '8px' }}>SendGrid</strong>
    <span style={{ fontSize: '14px', color: '#666', textAlign: 'center' }}>
      Enterprise-grade email delivery
    </span>
  </Link>

  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    border: '2px dashed #d1d5da',
    borderRadius: '8px',
    backgroundColor: '#fafbfc',
    minWidth: '200px',
    maxWidth: '250px',
    opacity: '0.6'
  }}>
    <img 
      src="/img/providers/smtp2go-logo.png" 
      alt="SMTP2GO" 
      style={{
        height: '60px',
        width: 'auto',
        marginBottom: '15px'
      }}
    />
    <strong style={{ fontSize: '16px', marginBottom: '8px' }}>SMTP2GO</strong>
    <span style={{ fontSize: '14px', color: '#666', textAlign: 'center' }}>
      Coming Soon
    </span>
  </div>
</div>

## What Can I Do With Email Notifications?

- **Voicemail Alerts**: Get emailed copies of voicemails with audio attachments
- **System Notifications**: Receive alerts about system events and issues
- **Report Delivery**: Automated delivery of usage reports and analytics
- **Compliance Records**: Maintain audit trails for regulatory requirements

## Need Help Choosing?

If you're unsure which email provider to use, **Mailgun** is recommended for most organizations because:

- ✅ **Reliable delivery** - Industry-leading email deliverability
- ✅ **Cost-effective** - Free tier available for small volumes
- ✅ **Easy setup** - Straightforward configuration process
- ✅ **Excellent support** - Comprehensive documentation and support

## Next Steps

1. Click on your preferred email provider above
2. Follow the setup guide for your chosen service
3. Test your configuration to ensure emails are working
4. Configure specific features like voicemail notifications