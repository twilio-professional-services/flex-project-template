# ConnieRTC Template for Twilio Flex

The _ConnieRTC Template for Twilio Flex_ is a starting point for Flex solutions of any size. It provides a methodology for managing all the key assets of a Twilio Flex solution:

- It can be used for large projects or simple standalone features
- Many of the most common features requested by Flex customers are already packaged in the template
- Each feature is self-contained and easily removed if desired  
- Features can be turned on and off using an administration panel
- You can deploy this solution and use it to build in just a few minutes by providing your account SID, API key, and API secret.

---

### ConnieRTC Template Documentation

---

## Why use this template?

The Twilio platform is a robust suite of tools that can be orchestrated together to create incredible custom solutions. The biggest challenge is how to automatically configure and orchestrate these different tools together from an single source of truth. This is the problem the ConnieRTC Template aims to resolve.

The template provides a means to manage all of the assets which make up a Flex solution. It can take new Flex developers from 0 to 100 by putting them right in the position of developing feature enhancements instead of worrying about how to manage assets and dependencies on the platform.

Furthermore, with the rich library of examples and conventions, developers can quickly see how to approach different problems on the platform by seeing working code that they can easily reverse engineer.

## Local Development

### Running the Project Locally

To run the project locally, use the following command from the root directory:

```bash
npm start
```

This single command will start all necessary components:
- Serverless Functions (on port 3001)
- Flex Insights proxy
- Flex Plugin (on port 3000)

There's no need to start each component separately during normal development.

For debugging purposes, you can also run components individually:
- `npm run start:serverless` - Starts only the serverless functions
- `npm run start:plugin` - Starts only the Flex plugin
- `npm run start:insights` - Starts only the Insights proxy

### Flex Plugin Library

If you are primarily looking to add common contact center functionality to Flex, we recommend starting with the plugins from the [Flex Plugin Library](https://www.twilio.com/docs/flex/developer/plugins/plugin-library) to support your use case. These plugins are maintained and supported by Twilio, and many are derived from the most popular features included in the template.

Using plugins from the Plugin Library reduces the custom code footprint and total cost of ownership of your solution. Please be aware they cannot be customized and must be deployed and configured manually via the Flex Admin user interface. In case you have already developed, or plan to develop, custom code that modifies Flex actions or components, it is necessary to validate that those modifications don't conflict with the standard plugin(s) you are planning to deploy from the Plugin Library. Depending on your use case, you may wish to use only plugins from the Plugin Library, or only the ConnieRTC Template, or a mix of both.

## How do I get started?

Installing the ConnieRTC Template in your Twilio account is fast and easy. Follow the step-by-step guide to install the template in under 10 minutes.

When you are ready to customize and extend your Flex solution with the ConnieRTC Template, get started building with the template!
