---
sidebar_label: Implementation Guide
sidebar_position: 1
title: "Voicemail Implementation Guide - Choose Your Solution"
---

# Voicemail Implementation Guide

This guide helps you choose and implement the right voicemail solution for your client within their existing Connie deployment.

## Which Voicemail Solution Does Your Client Need?

Choose the option that best fits your client's requirements:

| Feature | Option A:<br/>Basic Voicemail | Option B:<br/>Callback + Wait Experience | Option C:<br/>Full Email Integration |
|---------|-------------------------------|------------------------------------------|-------------------------------------|
| 📞 **Voicemail Recording** | ✅ | ✅ | ✅ |
| 🔄 **Callback Requests** | ❌ | ✅ | ✅ |
| ⏰ **In-Queue Wait Experience** | ❌ | ✅ | ✅ |
| 📧 **Email Notifications** | ❌ | ❌ | ✅ |
| 📎 **Audio Attachments** | ❌ | ❌ | ✅ |
| 🔧 **Setup Complexity** | Simple | Moderate | Advanced |
| ⚙️ **Template Feature** | Basic recording only | `callback-and-voicemail` | `callback-and-voicemail-with-email` |
| 🕐 **Setup Time** | 15 minutes | 30 minutes | 45-60 minutes |

---

## 🎯 Choose Your Implementation Path

### Option A: Basic Voicemail Only
**Perfect for:** Simple organizations that just need voicemail recording and task routing.

**What callers experience:**
- Call comes in → Record voicemail → Voicemail appears as task in Flex

**What you'll deploy:**
- Basic voicemail recording functionality
- Automatic transcription
- Task routing to agents

**Next steps:** → [Set up Basic Voicemail](./basic-voicemail-setup)

---

### Option B: Callback + Wait Experience  
**Perfect for:** Organizations that want to reduce wait times and offer callbacks.

**What callers experience:**
- Call comes in → Wait on hold with music
- Press * anytime → Choose callback OR voicemail
- Professional hold experience with options

**What you'll deploy:**
- Complete Professional Services Template callback/voicemail feature
- In-queue wait experience with hold music
- Callback request functionality
- Voicemail option during wait

**Next steps:** → [Set up Callback + Voicemail Experience](./callback-voicemail-setup)

---

### Option C: Full Email Integration
**Perfect for:** Organizations requiring compliance documentation and administrator alerts.

**What callers experience:**
- Everything from Option B
- Same professional callback + voicemail experience

**What administrators get:**
- Instant email notifications when voicemails are received
- Audio attachments delivered via email
- Complete transcription in email
- Professional email formatting

**What you'll deploy:**
- Everything from Option B
- Mailgun email integration
- Automated voicemail-to-email workflow
- Enhanced monitoring and logging

**Next steps:** → [Choose Your Email Provider](./)

---

## 🚀 Quick Start Prerequisites

### For All Options:
- ✅ Admin access to your organization's Connie deployment
- ✅ Basic familiarity with environment configuration
- ✅ Access to your client's phone number configuration

### Additional for Option C:
- ✅ Access to client's domain DNS settings
- ✅ Mailgun account (free tier available)
- ✅ Client's admin email address

---

## 🏗️ Implementation Overview

All voicemail options use **existing ConnieRTC template features** - you're not building custom code, just configuring what's already built.

### What You're NOT Doing:
- ❌ Writing custom Twilio Functions
- ❌ Building Studio Flows from scratch
- ❌ Creating custom UI components

### What You ARE Doing:
- ✅ Enabling existing template features
- ✅ Configuring environment variables
- ✅ Running standard deployment commands
- ✅ Testing the implementation

---

## 📋 Deployment Pattern (All Options)

No matter which option you choose, the deployment pattern is consistent:

```bash
# 1. Configure your client's settings
# (Copy-paste templates provided in each guide)

# 2. Deploy serverless functions
cd serverless-functions && npm run deploy

# 3. Apply infrastructure changes
cd infra-as-code/terraform/environments/default
terraform apply -var-file="local.tfvars"

# 4. Test the implementation
# (Test scripts provided in each guide)
```

---

## 🆘 Need Help?

- **New to Connie?** Each implementation guide includes a "First Time Setup" section
- **Contractor/Developer?** Look for the "Professional Services" callouts in each guide
- **Troubleshooting?** Every guide includes a comprehensive troubleshooting section

---

## 📞 Ready to Choose?

Click on your preferred option above to get started with step-by-step implementation instructions tailored to your client's needs.

:::tip Professional Services Available
If you prefer to have our team handle the implementation, professional services are available for all voicemail options. Contact your Connie representative for details.
:::