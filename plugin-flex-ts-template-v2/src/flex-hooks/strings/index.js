import featureStrings from "../../feature-library/*/flex-hooks/strings/*";

export default (flex, manager) => {
  let customStrings = {};
  
  featureStrings.forEach((file) => {
    customStrings = {
      ...customStrings,
      ...file.default
    }
  });
  
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
