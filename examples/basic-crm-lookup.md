# 🎯 Basic CRM Lookup Example

This example demonstrates a complete ConnieRTC integration from phone call to customer data display.

## Overview

This Studio Flow handles incoming calls and looks up customer information before routing to an agent.

## Flow Steps

1. **📞 Call Arrives** - Incoming call triggers the flow
2. **🔍 Customer Lookup** - Calls the lookup-customer serverless function  
3. **📋 Set Attributes** - Adds customer data to task attributes
4. **🎯 Route to Agent** - Sends call to Flex with customer context

## Import Instructions

1. Go to [Twilio Console Studio](https://console.twilio.com/us1/develop/studio/flows)
2. Click **Create new Flow**
3. Choose **Import from JSON**
4. Upload this file: `basic-crm-lookup.json`
5. Update the serverless function URL (step 4 below)

## Configuration

### Step 1: Update Function URL

In the **"Lookup Customer"** widget, update the URL to your deployed function:

```
https://YOUR-SERVERLESS-DOMAIN.twil.io/lookup-customer
```

### Step 2: Configure Parameters

The lookup widget sends these parameters:
- `phone` - The caller's phone number ({{trigger.call.From}})

### Step 3: Set Task Attributes

The **"Set Task Attributes"** widget creates these attributes:

```json
{
  "type": "inbound",
  "name": "{{widgets.lookup_customer.parsed.customer.first_name}} {{widgets.lookup_customer.parsed.customer.last_name}}",
  "from": "{{trigger.call.From}}",
  "customer_found": "{{widgets.lookup_customer.parsed.found}}",
  "customer": "{{widgets.lookup_customer.parsed.customer}}",
  "profile_url": "{{widgets.lookup_customer.parsed.profile_url}}"
}
```

### Step 4: Assign to Phone Number

1. Go to [Phone Numbers](https://console.twilio.com/us1/develop/phone-numbers/manage/incoming)
2. Click on your Twilio phone number
3. Set **A call comes in** webhook to your Studio Flow
4. Save configuration

## Testing

Call your Twilio number with these test numbers:

### Demo Customers
- **+1 (510) 930-9015** → Mickey Mouse
- **+1 (555) 123-4567** → Donald Duck  
- **+1 (555) 987-6543** → Goofy Goof

### Expected Behavior

**For Known Customers:**
1. Call arrives at Studio Flow
2. Function finds customer in database
3. Task created with customer name and data
4. Agent sees full customer profile in CRM container

**For Unknown Callers:**
1. Call arrives at Studio Flow  
2. Function returns "customer not found"
3. Task created with phone number as name
4. Agent sees "Unknown Caller" with phone number

## Customization

### Add More Data Fields

To capture additional customer information, update:

1. **Serverless Function** - Add fields to customer object
2. **Studio Flow** - Include new fields in task attributes  
3. **Flex Plugin** - Display new fields in CRM container

### Connect Different Data Source

Replace the demo data in `lookup-customer.js`:

```javascript
// Replace this demo function
function lookupFromDemo(cleanPhone) {
  // Demo data here
}

// With your data source
async function lookupFromMySQL(cleanPhone, context) {
  // Your MySQL query here
}
```

### Error Handling

The flow includes error handling for:
- ❌ Function timeout or failure
- ❌ Invalid phone number format  
- ❌ Database connection issues

Failed lookups default to "Unknown Caller" and still route to agents.

## Troubleshooting

### Function Not Found (404)

Check that:
- ✅ Serverless function is deployed
- ✅ Function URL is correct in Studio Flow
- ✅ Function name matches exactly: `lookup-customer`

### Customer Not Found

Check that:
- ✅ Phone number format matches your data
- ✅ Demo customers exist in function
- ✅ Clean phone logic works correctly

### Studio Flow Errors

Check the [Studio Flow Execution Logs](https://console.twilio.com/us1/develop/studio/flows) for detailed error information.

## Next Steps

Once this basic example works:

1. **[Connect Your Database](../docs/google-sheets.md)** - Replace demo data
2. **[Customize the UI](../docs/ui-customization.md)** - Brand the interface
3. **[Add Advanced Features](../docs/advanced-features.md)** - Enable more capabilities

---

**🎉 Success!** You now have a complete customer lookup integration. Agents see caller information instantly, improving service quality and efficiency.
