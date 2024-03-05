---
title: Serverless wrappers
---

## Handler wrappers
Serverless function handlers require lots of various boilerplate: response headers for surviving CORS, validation of required parameters, error handling, and validation of the worker's Flex token. The template provides serverless wrappers to massively reduce the boilerplate within serverless functions.

An [example boilerplate function](https://github.com/twilio-professional-services/flex-project-template/blob/main/serverless-functions/.boiler-plate-function) using the `prepareFlexFunction` wrapper has been provided as a template you can use for creating each of your serverless functions.

### prepareStudioFunction()
This wrapper should be used for all _unauthenticated_ functions (i.e. when there is no Flex token provided in the request). It validates provided parameters against the specified `requiredParameters` array, sets up a `response` object with the appropriate response headers, and provides a common `handleError` function for automatic API retries.

### prepareFlexFunction()
This wrapper should be used for all _authenticated_ functions (i.e. a Flex token is provided in the request). It does everything that the `prepareStudioFunction` wrapper does, as well as validating the Flex token provided in the `Token` parameter. If the token is missing or invalid, the wrapper will automatically respond to the caller appropriately and prevent execution of your handler.

This wrapper should _always_ be used for public (i.e. non-protected and non-private) functions which modify objects or expose potentially sensitive information.

## Web service wrappers
When calling web services from your serverless functions, whether to Twilio or another service, it is generally desirable to add error handling and retry logic. The template provides wrappers for calling these services that will automatically handle errors and perform retries when necessary. A retry will be performed when an HTTP status of 412, 429, or 503 is returned, or if there is a connection error.

The following environment variables can be used to configure the retry handler:
- `TWILIO_SERVICE_MAX_BACKOFF` - Maximum amount of wait time before the retry is attempted
- `TWILIO_SERVICE_MIN_BACKOFF` - Minimum amount of wait time before the retry is attempted
- `TWILIO_SERVICE_RETRY_LIMIT` - Maximum number of retry attempts
- `ENABLE_LOCAL_LOGGING` - Whether to emit retry logs useful for local debugging

The following web service wrappers will return the web service response using this schema:
```js
{
  success: boolean; // Whether the web service request was successful
  status: number; // The HTTP status code from the web service
  data: any; // Data returned from the web service
}
```

### executeWithRetry()
This function accepts a callback function that you can provide with the code to execute and return the web service request. If the code throws an error, a retry handler will be invoked to handle the error and perform a retry depending on the response status.

Example usage:
```js
const axios = require('axios');
const { executeWithRetry } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);

const result = await executeWithRetry(context, async () => {
  // Make the API request
  // Code that throws within this block will be handled by the retry handler
  const response = await axios.get('https://my-amazing-service.tld/api/endpoint');
  return response.data;
});

if (result.success) {
  console.log('Web service response:', result.data);
}
```

### executeTwilio()
This function works exactly the same as `executeWithRetry()`, however it also provides an instantiated Twilio client directly to the callback function.

Example usage:
```js
const { twilioExecute } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);

const conversationSid = 'CH...';
const result = await twilioExecute(context, (client) =>
  client.conversations.v1.conversations(conversationSid).fetch()
);

if (result.success) {
  console.log('Twilio API response:', result.data);
}
```

You may also wish to customize the error handling, for example to treat certain non-successful responses as a success, but use the wrapper's retry logic for everything else. Here is an example of doing so:
```js
const { twilioExecute } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);

const taskSid = 'WT...';
const result = await twilioExecute(context, async (client) => {
  try {
    return await client.taskrouter.v1
      .workspaces(process.env.TWILIO_FLEX_WORKSPACE_SID)
      .tasks(taskSid)
      .update({ assignmentStatus: 'completed' });
  } catch (error) {
    if (error.code === 20001) {
      console.warn('Handling error 20001');
      return error.message;
    }
    // Re-throw the error for the retry handler to catch
    throw error;
  }
});

if (result.success) {
  console.log('Twilio API response:', result.data);
}
```
