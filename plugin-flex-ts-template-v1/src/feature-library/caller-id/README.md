# caller-id

This feature enables the user to define which number on the Twilio Account to use when dialing out using the dialpad.

# flex-user-experience

the vanilla feature without any further customizations will look like this

![alt text](screenshots/flex-user-experience.gif)

# setup and dependencies

There are no setup steps required for caller-id, only enabling the feature in the flex-config asset for your environment.

# how does it work?

When enabled, this feature loads the phone numbers on the account using a serverless function, caches them locally, preserve the selected value against the worker attributes.  When the [StartOutboundCall](https://assets.flex.twilio.com/docs/releases/flex-ui/1.31.2/Actions.html#.StartOutboundCall) action is invoked, we intercept the event before its processed and update the From number to use the selected value stored on the worker attributes.


__
