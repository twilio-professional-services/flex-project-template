# 📊 Google Sheets Integration

**Connect ConnieRTC to your Google Sheets customer database**

Perfect for small nonprofits who manage their client data in Google Sheets. No database expertise required!

## Overview

This integration allows ConnieRTC to look up customer information from a Google Sheet when calls arrive. Your agents see the caller's information instantly, without needing to search multiple systems.

## Prerequisites

- ✅ ConnieRTC basecamp deployed (see [Quick Start](quick-start.md))
- ✅ Google account with Sheets access
- ✅ Customer data in Google Sheets format

## Step 1: Prepare Your Google Sheet

### Required Columns

Your Google Sheet must have these columns (case-sensitive):

| Column | Description | Example |
|--------|-------------|---------|
| `phone` | Phone number (any format) | +15109309015 |
| `first_name` | First name | Mickey |
| `last_name` | Last name | Mouse |
| `email` | Email address | mickey@disney.com |
| `programs` | Services/programs | SNP, Housing |
| `notes` | Additional information | Regular food bank visitor |

### Sample Data

Create a sheet with sample data to test:

```csv
phone,first_name,last_name,email,programs,notes
+15109309015,Mickey,Mouse,mickey@disney.com,SNP,Demo customer for testing
+15551234567,Donald,Duck,donald@disney.com,"SNP, Housing",Regular food bank visitor
+15559876543,Goofy,Goof,goofy@disney.com,Crisis Support,Crisis counseling client
```

### Make Sheet Public (Read-Only)

1. Open your Google Sheet
2. Click **Share** button (top right)
3. Click **Change to anyone with the link**
4. Set permissions to **Viewer**
5. Copy the share link

Your link will look like:
```
https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=0
```

## Step 2: Get the Sheet ID

From your Google Sheets URL, extract the Sheet ID:

```
https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=0
                                    ↑ This is your Sheet ID ↑
```

## Step 3: Update ConnieRTC Configuration

### Update Serverless Function

Edit `serverless-functions/src/functions/lookup-customer.js`:

```javascript
const axios = require('axios');

exports.handler = async (context, event, callback) => {
    const response = new Twilio.Response();
    
    // Enable CORS
    response.appendHeader('Access-Control-Allow-Origin', '*');
    response.appendHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    try {
        const { phone } = event;
        
        // Clean phone number for comparison
        const cleanPhone = phone.replace(/^\+?1?/, '').replace(/\D/g, '');
        
        // Your Google Sheets configuration
        const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE';
        const RANGE = 'Sheet1!A:F'; // Adjust range as needed
        
        // Fetch data from Google Sheets
        const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${context.GOOGLE_SHEETS_API_KEY}`;
        
        const sheetsResponse = await axios.get(sheetsUrl);
        const rows = sheetsResponse.data.values;
        
        if (!rows || rows.length === 0) {
            throw new Error('No data found in sheet');
        }
        
        // Find customer by phone number
        const headers = rows[0];
        const phoneIndex = headers.indexOf('phone');
        
        const customerRow = rows.slice(1).find(row => {
            const rowPhone = row[phoneIndex]?.replace(/^\+?1?/, '').replace(/\D/g, '');
            return rowPhone === cleanPhone;
        });
        
        if (customerRow) {
            const customer = {};
            headers.forEach((header, index) => {
                customer[header] = customerRow[index] || '';
            });
            
            response.setBody({
                found: true,
                customer: customer,
                profile_url: `https://your-crm-url.com/profile?customer=${customer.first_name}+${customer.last_name}`
            });
        } else {
            response.setBody({
                found: false,
                customer: null,
                profile_url: `https://your-crm-url.com/profile?phone=${phone}`
            });
        }
        
        callback(null, response);
        
    } catch (error) {
        console.error('Error looking up customer:', error);
        response.setStatusCode(500);
        response.setBody({ error: 'Failed to lookup customer' });
        callback(null, response);
    }
};
```

### Set Environment Variables

Add to your `.env` file:

```bash
GOOGLE_SHEETS_API_KEY=your_google_api_key_here
GOOGLE_SHEET_ID=your_google_sheet_id_here
```

## Step 4: Get Google Sheets API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the **Google Sheets API**
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy your API key
6. (Optional) Restrict the key to Sheets API only

## Step 5: Deploy and Test

```bash
# Deploy updated function
cd serverless-functions
npm run deploy

# Test with curl
curl "https://your-serverless-domain.twil.io/lookup-customer?phone=+15109309015"
```

Expected response:
```json
{
  "found": true,
  "customer": {
    "phone": "+15109309015",
    "first_name": "Mickey",
    "last_name": "Mouse",
    "email": "mickey@disney.com",
    "programs": "SNP",
    "notes": "Demo customer for testing"
  },
  "profile_url": "https://your-crm-url.com/profile?customer=Mickey+Mouse"
}
```

## Advanced Configuration

### Multiple Sheets

To search multiple sheets or tabs:

```javascript
const ranges = ['Clients!A:F', 'Volunteers!A:F', 'Donors!A:F'];

for (const range of ranges) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${context.GOOGLE_SHEETS_API_KEY}`;
    // ... search logic
}
```

### Data Validation

Add validation for required fields:

```javascript
// Validate required customer data
const requiredFields = ['first_name', 'last_name', 'phone'];
const isValid = requiredFields.every(field => customer[field]?.trim());

if (!isValid) {
    console.warn('Customer missing required fields:', customer);
}
```

### Caching for Performance

For high-volume deployments, consider caching:

```javascript
// Simple in-memory cache (resets on function cold start)
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const cacheKey = `sheet-${SHEET_ID}`;
const cached = cache.get(cacheKey);

if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    rows = cached.data;
} else {
    // Fetch from API and cache
    const response = await axios.get(sheetsUrl);
    rows = response.data.values;
    cache.set(cacheKey, { data: rows, timestamp: Date.now() });
}
```

## Security Best Practices

### API Key Security

- ✅ Use restricted API keys (Sheets API only)
- ✅ Store API keys in environment variables
- ✅ Rotate keys regularly
- ❌ Never commit API keys to git

### Sheet Permissions

- ✅ Use "Viewer" permissions only
- ✅ Share with "Anyone with link" not "Anyone on internet"
- ✅ Monitor sheet access logs
- ❌ Don't give edit permissions to API

### Data Privacy

- ✅ Only include necessary data in sheets
- ✅ Use generic notes, avoid sensitive details
- ✅ Regular data cleanup
- ❌ Don't store SSNs, detailed medical info, etc.

## Troubleshooting

### Common Issues

**"API key not valid"**
- Check your Google Cloud Console settings
- Ensure Sheets API is enabled
- Verify API key restrictions

**"Sheet not found"**
- Check Sheet ID is correct
- Ensure sheet is public (shared with link)
- Test sheet URL in browser

**"No data returned"**
- Check sheet has data in expected format
- Verify column headers match exactly
- Check range specification (A:F, etc.)

### Testing Your Integration

```bash
# Test Google Sheets API directly
curl "https://sheets.googleapis.com/v4/spreadsheets/YOUR_SHEET_ID/values/Sheet1!A:F?key=YOUR_API_KEY"

# Test your serverless function
curl "https://your-domain.twil.io/lookup-customer?phone=+15109309015"
```

## Migration from Other Systems

### From Excel/CSV

1. Upload Excel/CSV to Google Sheets
2. Ensure column headers match requirements
3. Make sheet public and get Sheet ID
4. Follow setup steps above

### From CRM Systems

Most CRMs can export to CSV format:
- **Salesforce**: Reports → Export → CSV
- **HubSpot**: Contacts → Export → CSV  
- **Zoho**: Contacts → Export → CSV

Then upload CSV to Google Sheets and follow setup.

---

**🎉 Success!** Your ConnieRTC deployment now pulls customer data from Google Sheets in real-time. Agents see caller information instantly, improving service quality and efficiency.

**Next Steps:**
- [Customize the UI](ui-customization.md) to match your branding
- [Set up advanced features](advanced-features.md) for enhanced functionality
- [Deploy to production](deployment.md) with security best practices
