# salesforce-click-to-dial

When leveraging the OOTB [Salesforce integration package](https://www.twilio.com/docs/flex/admin-guide/integrations/salesforce) it can be seen that relevant data from salesforce is posted but at the receiving end in flex, the data is ignored.

To tackle this, this package will suppress the [StartOutboundCall](https://assets.flex.twilio.com/docs/releases/flex-ui/1.31.2/Actions.html#.StartOutboundCall) event that the OOTB integration package produces and while listening for the same post event, will produce its own [StartOutboundCall](https://assets.flex.twilio.com/docs/releases/flex-ui/1.31.2/Actions.html#.StartOutboundCall). This results in a complete set of data that is being posted over, being available to the task attributes.

A secondary benefit of this feature is it will ensure the agent is available when a click-to-dial event is received from salesforce.

# flex-user-experience

N/A

# setup and dependencies

Beyond setting up the [Salesforce integration package](https://www.twilio.com/docs/flex/admin-guide/integrations/salesforce) there are no dependencies beyond ensuring the flex-config flag for the feature is enabled.
