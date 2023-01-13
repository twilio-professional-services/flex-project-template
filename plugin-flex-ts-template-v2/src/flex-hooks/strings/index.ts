import * as Flex from "@twilio/flex-ui";
// @ts-ignore
import featureStrings from "../../feature-library/*/flex-hooks/strings/*";

export default (flex: typeof Flex, manager: Flex.Manager) => {
  let customStrings = {};
  
  if (typeof featureStrings !== 'undefined') {
    featureStrings.forEach((file: any) => {
      customStrings = {
        ...customStrings,
        ...file.default
      }
    });
  }
  
  manager.strings = {
    // -v- Add custom strings here -v-'
    ...customStrings,
    // -^---------------------------^-

    ...manager.strings,

    // -v- Modify strings provided by flex here -v-
    //WorkerDirectoryAgentsTabLabel: '<span style="font-size: 10px;">Agents</span>',
    //WorkerDirectoryQueuesTabLabel: '<span style="font-size: 10px;">Queues</span>',
    // -^----------------------------------------^-
  };
};
