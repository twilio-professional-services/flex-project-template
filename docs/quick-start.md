# 🚀 Quick Start Guide

**Get ConnieRTC running in 30 minutes with Google Sheets integration**

## Prerequisites

Before you begin, make sure you have:

- ✅ **Node.js 18+** - [Download here](https://nodejs.org)
- ✅ **Twilio Account** - [Sign up free](https://www.twilio.com/try-twilio)
- ✅ **Twilio CLI** - [Install guide](https://www.twilio.com/docs/twilio-cli/quickstart)
- ✅ **Google Account** - For Google Sheets integration

## Option 1: Automated Setup (Recommended)

Run our quick-start script for automated setup:

```bash
# Clone the repository
git clone https://github.com/connie-org/connieRTC-flex-community
cd connieRTC-flex-community

# Run the quick start script
./scripts/quick-start.sh
```

The script will:
1. ✅ Check prerequisites
2. ✅ Set up Twilio credentials
3. ✅ Create sample customer database
4. ✅ Deploy serverless functions
5. ✅ Configure basic Flex plugin
6. ✅ Provide test phone numbers

## Option 2: Manual Setup

### Step 1: Clone and Install

```bash
git clone https://github.com/connie-org/connieRTC-flex-community
cd connieRTC-flex-community
npm install
```

### Step 2: Configure Twilio

```bash
# Set up your Twilio profile
twilio profiles:create

# Or set environment variables
export TWILIO_ACCOUNT_SID=your_account_sid
export TWILIO_AUTH_TOKEN=your_auth_token
```

### Step 3: Deploy Serverless Functions

```bash
cd serverless-functions
npm install
npm run deploy
```

### Step 4: Deploy Flex Plugin

```bash
cd ../flex-plugin
npm install
npm run build
npm run deploy
```

### Step 5: Configure Studio Flow

1. Import the sample Studio Flow from `examples/studio-flows/basic-crm-lookup.json`
2. Update the serverless function URLs
3. Assign the flow to your Twilio phone number

## Testing Your Deployment

Once deployed, test with these sample numbers:

- **📞 +1 (510) 930-9015** → Mickey Mouse (Demo customer)
- **📞 +1 (555) 123-4567** → Donald Duck (Regular visitor)
- **📞 Any other number** → Unknown caller (fallback)

## What You'll See

When a call comes in, your Flex agent will see:

```
┌─────────────────────────────────────┐
│ 📞 Incoming Call                    │
├─────────────────────────────────────┤
│ 👤 Mickey Mouse                     │
│ 📧 mickey@disney.com                │
│ 🏷️  Programs: SNP                   │
│ 📝 Notes: Demo customer for testing │
└─────────────────────────────────────┘
```

## Next Steps

### Connect Your Data

- **[Google Sheets](google-sheets.md)** - Connect your Google Sheets database
- **[MySQL Database](mysql-integration.md)** - Connect MySQL/MariaDB
- **[Custom API](custom-api.md)** - Connect any REST API

### Customize Your Deployment

- **[UI Customization](ui-customization.md)** - Brand and customize the interface
- **[Advanced Features](advanced-features.md)** - Enable additional capabilities
- **[Studio Flows](studio-flows.md)** - Create custom call routing

### Production Deployment

- **[Security Guide](security.md)** - Production security checklist
- **[Performance](performance.md)** - Optimization for high volume
- **[Monitoring](monitoring.md)** - Set up alerts and logging

## Troubleshooting

### Common Issues

**"Twilio CLI not found"**
```bash
# Install Twilio CLI
npm install -g twilio-cli
```

**"Invalid credentials"**
```bash
# Verify your credentials
twilio api:core:accounts:fetch
```

**"Function deployment failed"**
```bash
# Check your serverless domain
twilio serverless:list
```

### Getting Help

- 💬 **[GitHub Discussions](https://github.com/connie-org/connieRTC-flex-community/discussions)** - Community support
- 📚 **[Documentation](../README.md)** - Full documentation
- 🏢 **[Professional Services](https://connie.technology/services)** - Expert help

---

**🎉 Congratulations!** You now have a working ConnieRTC deployment that shows customer data instantly when calls arrive. Your agents will love the immediate context, and your callers will receive better, more personalized service.

**Ready to connect your real data?** Check out our integration guides above!
