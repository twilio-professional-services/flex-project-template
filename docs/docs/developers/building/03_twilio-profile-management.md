---
title: Twilio Profile Management & CORS Troubleshooting
---

# Twilio Profile Management & CORS Troubleshooting

This guide covers best practices for managing Twilio CLI profiles and troubleshooting common CORS issues that can occur when working with multiple environments.

## Overview

The Twilio Flex template supports multiple environments (dev, staging, production) and relies on proper Twilio CLI profile configuration to ensure deployments target the correct Twilio account and Flex instance.

## Common Issues

### Profile/Environment Mismatch

**Problem**: Configuration deployed to wrong environment, CORS errors, or "403 Forbidden" errors when accessing admin UI.

**Symptoms**:
- Admin UI fails to load with CORS errors
- Serverless functions deployed to wrong account
- Flex configuration pointing to wrong serverless domain

**Root Cause**: Twilio CLI profile doesn't match the intended deployment environment.

## Profile Management Best Practices

### 1. Check Current Profile Status

Always verify your current Twilio CLI profile before deploying:

```bash
# Check current profile
twilio profiles:list

# Check current profile account
node scripts/print-profile-account.mjs

# Quick profile vs environment check
export profile=`node scripts/print-profile-account.mjs`; echo "Current profile account: ${profile}"
```

### 2. Verify Profile Matches Environment Files

Before deploying any component, ensure your CLI profile matches the target environment:

**For Serverless Functions:**
```bash
cd serverless-functions
export env=`cat .env | grep ACCOUNT_SID | cut -d '=' -f 2`
export profile=`node ../scripts/print-profile-account.mjs`
echo -e 'serverless .env: \t' ${env}
echo -e 'CLI profile: \t' ${profile}
```

**For Flex Config:**
```bash
cd flex-config
export env=`cat .env | grep ACCOUNT_SID | cut -d '=' -f 2`
export profile=`node ../scripts/print-profile-account.mjs`
echo -e 'flex-config .env: \t' ${env}
echo -e 'CLI profile: \t' ${profile}
```

**For Add-ons:**
```bash
export env=`cat addons/serverless-schedule-manager/.env | grep ACCOUNT_SID | cut -d '=' -f 2`
export profile=`node scripts/print-profile-account.mjs`
echo -e 'schedule-manager .env: \t' ${env}
echo -e 'CLI profile: \t' ${profile}
```

### 3. Switching Profiles

If your profile doesn't match the target environment:

```bash
# List available profiles
twilio profiles:list

# Switch to the correct profile
twilio profiles:use my-dev-profile

# Verify the switch
twilio profiles:list
```

### 4. Regenerating Environment Files

If you've switched profiles and need to update .env files:

```bash
# From the template root directory
npm run postinstall -- --overwrite
```

This will regenerate all .env files based on your current CLI profile.

## CORS Troubleshooting

### Understanding CORS in the Flex Template

The Twilio Flex template has built-in CORS handling via middleware. **Do not add additional CORS headers unless absolutely necessary.**

### Common CORS Errors

**Error**: `Access-Control-Allow-Origin header contains multiple values '*,*'`

**Cause**: Duplicate CORS headers being added by both template middleware and custom code.

**Solution**: Remove custom CORS header additions and rely on template's built-in handling.

**Error**: `No 'Access-Control-Allow-Origin' header is present`

**Cause**: Error responses bypassing template middleware.

**Solution**: Add CORS headers only to error response paths.

### CORS Best Practices

1. **Use Template's Built-in CORS**: The template automatically handles CORS for successful responses.

2. **Only Add CORS to Error Paths**: Add CORS headers manually only when returning error responses:

```javascript
// ❌ Don't do this - duplicates template CORS
const response = new Twilio.Response();
response.appendHeader('Access-Control-Allow-Origin', '*');
response.appendHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

// ✅ Do this - only for error responses
if (error) {
  const response = new Twilio.Response();
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.setStatusCode(500);
  response.setBody({ error: 'Something went wrong' });
  return callback(null, response);
}
```

3. **Test CORS with Browser, Not Curl**: CORS is a browser security feature. Always test with actual browser requests.

4. **Check for OPTIONS Handling**: Ensure your functions handle OPTIONS preflight requests:

```javascript
exports.handler = function(context, event, callback) {
  // Handle OPTIONS preflight
  if (event.RequestMethod === 'OPTIONS') {
    const response = new Twilio.Response();
    response.appendHeader('Access-Control-Allow-Origin', '*');
    response.appendHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
    response.setStatusCode(200);
    return callback(null, response);
  }
  
  // Your function logic here...
};
```

## Environment-Specific Configuration

### Development Environment

For development, ensure your Flex configuration points to the correct serverless domain:

```json
// flex-config/ui_attributes.production.json
{
  "custom_data": {
    "serverless_functions_domain": "custom-flex-extensions-serverless-1866-dev.twil.io"
  }
}
```

### Verifying Serverless Domains

Check which serverless services and environments are active:

```bash
# List all serverless services
twilio api:serverless:v1:services:list

# List environments for a specific service
twilio api:serverless:v1:services:environments:list --service-sid=ZSxxxxx
```

## Deployment Checklist

Before deploying any component:

1. ✅ Verify CLI profile matches target environment
2. ✅ Check .env files are up to date
3. ✅ Ensure serverless domain in Flex config is correct
4. ✅ Test CORS with browser requests after deployment
5. ✅ Verify admin UI functionality

## Troubleshooting Steps

If you encounter CORS or profile issues:

1. **Check Profile Status**:
   ```bash
   twilio profiles:list
   node scripts/print-profile-account.mjs
   ```

2. **Verify Environment Alignment**:
   ```bash
   # Check all environments match
   cd serverless-functions && export env=`cat .env | grep ACCOUNT_SID | cut -d '=' -f 2` && echo "Serverless: ${env}"
   cd ../flex-config && export env=`cat .env | grep ACCOUNT_SID | cut -d '=' -f 2` && echo "Flex Config: ${env}"
   cd .. && export profile=`node scripts/print-profile-account.mjs` && echo "CLI Profile: ${profile}"
   ```

3. **Test CORS Headers**:
   ```bash
   # Test with curl
   curl -i -X OPTIONS https://your-serverless-domain.twil.io/features/admin-ui/flex/fetch-config
   
   # Look for single CORS headers (not duplicates)
   ```

4. **Check Serverless Deployment Status**:
   ```bash
   twilio api:serverless:v1:services:list
   ```

5. **Redeploy if Necessary**:
   ```bash
   # Redeploy serverless functions
   cd serverless-functions && npm run deploy
   
   # Redeploy flex config
   cd ../flex-config && npm run deploy
   ```

## Prevention

- Always check profile before deploying
- Use the verification commands provided in deployment docs
- Test admin UI functionality after any configuration changes
- Document any custom CORS modifications with clear comments
- Keep environment files in sync with CLI profile

## Related Documentation

- [Local Deployment Guide](./deployment/01_local-deployment.md)
- [Developer Setup](./01_developer-setup.md)
- [Twilio CLI Documentation](https://www.twilio.com/docs/twilio-cli)
