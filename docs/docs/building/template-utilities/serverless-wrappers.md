---
title: Serverless wrappers
---

Serverless functions require lots of various boilerplate: response headers for surviving CORS, validation of required parameters, error handling, and validation of the worker's Flex token. The template provides serverless wrappers to massively reduce the boilerplate within serverless functions.

An [example boilerplate function](https://github.com/twilio-professional-services/flex-project-template/blob/main/serverless-functions/.boiler-plate-function) using the `prepareFlexFunction` wrapper has been provided as a template you can use for creating each of your serverless functions.

## prepareStudioFunction()
This wrapper should be used for all _unauthenticated_ functions (i.e. when there is no Flex token provided in the request). It validates provided parameters against the specified `requiredParameters` array, sets up a `response` object with the appropriate response headers, and provides a common `handleError` function for automatic API retries.

## prepareFlexFunction()
This wrapper should be used for all _authenticated_ functions (i.e. a Flex token is provided in the request). It does everything that the `prepareStudioFunction` wrapper does, as well as validating the Flex token provided in the `Token` parameter. If the token is missing or invalid, the wrapper will automatically respond to the caller appropriately and prevent execution of your handler.

This wrapper should _always_ be used for public (i.e. non-protected and non-private) functions which modify objects or expose potentially sensitive information.