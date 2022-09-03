# conference

When in a call, a "plus" icon is added to the call canvas where you can add an external number to the call.

This feature is based on [the dialpad addon plugin](https://github.com/twilio-professional-services/flex-dialpad-addon-plugin).

# flex-user-experience

![Conference demo](screenshots/conference.gif)

# setup and dependencies

There are no setup steps required for conference, only enabling the feature in the flex-config asset for your environment.

# how does it work?

This action executes a Twilio Function that uses the Twilio API to make a call and add this call to the current conference. In the Flex UI side, the participant is added manually and both hold/unhold and hangup buttons are available.

An invisible component is mounted to track participant state and set `endConferenceOnExit` appropriately to allow for external transfer functionality -- the agent can leave the call while the remaining conference participants continue to communicate. If there are two parties remaining, the call will automatically end when one of them hangs up.