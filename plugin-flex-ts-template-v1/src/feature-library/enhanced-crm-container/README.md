# enhanced-crm-container

This feature replaces the OOTB [CRMContainer](https://assets.flex.twilio.com/docs/releases/flex-ui/1.31.2/CRMContainer.html) with the aim of providing a more userfriendly iframe.

The short coming with the OOTB container is that it re-renders as you toggle between tasks. This CRMContainer will only render once and the iframe is simply hidden as you toggle between tasks. Furthermore, using a task attribute of parentTask we can ensure related tasks only render the one iframe. A typical example of this is when creating a callback which starts as one task and creates a seperate outbound call task to dial the customer. When toggling between these tasks, the iframe will render the same instance.

# flex-user-experience

![alt text](screenshots/flex-user-experience-enhanced-crm-container.gif)

# setup and dependencies

There are no dependencies for setup beyond ensuring the flag is enabled within the flex-config attributes.

# how does it work?

The component keeps a array of each task and provides an iframe for each one. Based on the currently selected task, the component re-renders and modifies the CSS for the iframe to either hide or show based on whether its the currently selected task. Once the task is removed the iframe is removed.
