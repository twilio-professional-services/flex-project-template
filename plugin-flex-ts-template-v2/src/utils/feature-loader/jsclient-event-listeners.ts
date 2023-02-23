import * as Flex from "@twilio/flex-ui";
import { FlexJsClient } from "../../types/manager/FlexJsClient";

export const addHook = (flex: typeof Flex, manager: Flex.Manager, feature: string, hook: any) => {
  if (!hook.clientName) {
    console.info(`Feature ${feature} declared JS client event hook, but is missing clientName to hook`);
    return;
  }
  const client = hook.clientName as FlexJsClient;
  
  if (!hook.eventName) {
    console.info(`Feature ${feature} declared JS client event hook, but is missing eventName to hook`);
    return;
  }
  const event = hook.eventName;
  
  console.info(`Feature ${feature} registered ${client} ${event} event hook: ${hook.jsClientHook.name}`);
  
  switch (client) {
    case FlexJsClient.conversationsClient:
      if (event == "conversationJoined") {
        manager.conversationsClient.on("conversationJoined", conversation => {
          hook.jsClientHook(flex, manager, conversation);
        });
      }
      break;
    case FlexJsClient.voiceClient:
      if (event == "incoming") {
        manager.voiceClient.on("incoming", call => {
          hook.jsClientHook(flex, manager, call);
        });
      }
      break;
    case FlexJsClient.workerClient:
      if (event == "reservationCreated") {
        manager.workerClient?.on("reservationCreated", reservation => {
          hook.jsClientHook(flex, manager, reservation);
        });
      }
      break;
  }
}