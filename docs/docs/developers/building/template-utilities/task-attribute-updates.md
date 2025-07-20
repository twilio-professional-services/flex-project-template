---
title: Task attribute updates
---

Location: `plugin-flex-ts-template-v2/src/utils/serverless/TaskRouter/TaskRouterService.ts`

Flex provides a few methods out-of-the-box to modify task attributes. However, these methods do not take in to consideration the fact that multiple features may wish to change attributes at the same time, such as in response to an action or event. Unfortunately, using the out-of-box methods can hit race conditions resulting in lost attributes.

The template provides a much more robust solution for updating task attributes as part of the `TaskRouterService`. This solution eliminates race conditions by using the `ETag` header supported by TaskRouter, and provides improved performance with optional deferred updates.

## Updating task attributes

You can use the `updateTaskAttributes` function of `TaskRouterService` to robustly update task attributes. Here is an example implementation:

```js
const attributes = {
  my_custom_attribute: "Hello world",
};

try {
  await TaskRouterService.updateTaskAttributes(taskSid, attributes);
} catch (error) {
  // Handle failure to update task attributes
}
```

The function will merge the provided attributes with the rest of the task attributes and submit the change to the TaskRouter API. If a conflict is reported due to a race condition, the function will re-fetch the latest attributes, re-merge the provided attributes, and try again until successful.

## Deferred updates

It is a common occurrence for multiple features to wish to update task attributes in response to a common event, such as completing the task. However, if multiple features are updating attributes at the same time, this results in excessive API calls, and increases the chance of retries being needed to resolve racing updates. Deferred updates are intended as a solution to this problem.

Deferred updates are flushed out to TaskRouter when either a non-deferred update occurs, or when the `CompleteTask` action is invoked.

To submit a task attribute update that can be deferred, an optional third parameter can be provided to the `updateTaskAttributes` function as follows:

```js
// Setting the third parameter to `true` indicates that it can wait to be submitted until either a non-deferred update occurs, or the `CompleteTask` action is invoked.
await TaskRouterService.updateTaskAttributes(taskSid, attributes, true);
```