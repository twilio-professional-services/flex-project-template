import axios from 'axios';

const validateAccountSid = async () => {
  try {
    const flexConfigResponse = await axios.get('https://flex-api.twilio.com/v1/Configuration', {
      auth: {
        username: process.env.TWILIO_API_KEY,
        password: process.env.TWILIO_API_SECRET
      }
    });
    
    if (flexConfigResponse?.data?.account_sid === process.env.TWILIO_ACCOUNT_SID) {
      console.log('✅ Success: API key matches provided Flex account SID');
      return;
    }
    
    console.log('❌ Error: API key does not match the provided Flex account SID or this is not a Flex account');
  } catch (error) {
    console.log(`❌ Error validating API key and Flex account SID: ${error}`);
  }
  
  process.exitCode = 1;
}

const validateEnvName = () => {
  if (process.env.ENVIRONMENT.includes('/')) {
    console.log(`❌ Error: Environment name includes invalid character '/'`);
    process.exitCode = 1;
  }
}

validateEnvName();
validateAccountSid();