import * as Flex from "@twilio/flex-ui";

function beforeAcceptTask(flex: typeof Flex, manager: Flex.Manager) {
  flex.Actions.addListener("beforeAcceptTask", async (payload) => {
    console.log(
      "DEBUG *** - sample code for feature template to log AcceptTask payload",
      payload
    );
  });
}

export { beforeAcceptTask as sampleFeatureBeforeAcceptTask };
