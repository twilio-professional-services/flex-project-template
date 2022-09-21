# Sample feature template to demonstrate using the plugin template

## What is a feature in the context of the plugin template?

A feature is standalone Flex UI Customization. The feature sits on top of the plugin template which can support multiple features. 

What are the benifits to this approach vs a standalone plugin?
+ A standardized folder layout for your plugin making to clear what your customizations and interactions with Flex UI are.
+ The plugin template provides helper librarys that can be reused by features
+ Multiple features can be containted in a single plugin providing code reuse and standardization

Add you custom feature code in: 
```
src/feature-library/feature-name
```

Add any calls you make to customize Flex into the hooks in:
```
src/flex-hooks
```

## Sample feature overview

To give a practical example of how to extend your feature in a consistent way this sample feature adds a custom component to a Flex UI component as well as demonstrating registering an action.

Note that by default when installing this feature the hooks from Flex UI to these customizations have not been registered. This is because adding the feature only copied files to src/feature-library/feature-name, registering the hooks to this feature requires updates to files in srv/flex-hooks. 
Follow the steps below to hook it up and test it out!

### Register beforeAcceptTask

Note we have code custom to this feature in: 
```
src/feature-library/feature-name/flex-hooks/actions/AcceptTask
```

To hook this up and have the action registered update:
```
src/flex-hooks/actions
```
```
import { sampleFeatureBeforeAcceptTask } from "../../feature-library/feature-name/flex-hooks/actions/AcceptTask";

const actionsToRegister: Actions = {
  AcceptTask: {
    before: [sampleFeatureBeforeAcceptTask, .... optional other features customizations....],
    after: [],
    replace: [],
  },
```






