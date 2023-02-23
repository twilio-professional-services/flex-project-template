import * as Flex from "@twilio/flex-ui";

import * as CssOverrides from "./css-overrides";
import * as Events from "./events";
import * as JsClientEvents from "./jsclient-event-listeners";
import * as PasteElements from "./paste-elements";
import * as Reducers from "./reducers";
import * as Strings from "./strings";
import * as TeamsFilters from "./teams-filters";

// @ts-ignore
import features from "../../feature-library/*/index.ts";

const manager = Flex.Manager.getInstance();

export const initFeatures = () => {
  if (typeof features === 'undefined') {
    // no features discovered; abort
    return;
  }
  
  features.forEach((file: any) => {
    // Each feature index file should export a `register` function for us to invoke
    if (!file.register) {
      console.error('Feature found, but its index file does not export a `register` function', file);
      return;
    }
    
    file.register();
  });
  
  // After all features have initialized, execute deferred hooks
  CssOverrides.init(manager);
  PasteElements.init(Flex);
  Reducers.init(manager);
  Strings.init(manager);
  TeamsFilters.init(Flex);
}

export const loadFeature = (name: string, hooks: [any]) => {
  // Features invoke this function to register their hooks
  console.info(`Feature enabled: ${name}`);
  
  hooks.forEach((hook: any) => {
    // Each hook exports a function or property for us to handle.
    // Register the hook based on the export(s) present.
    
    if (hook.actionHook) {
      console.info(`Feature ${name} registered action hook: ${hook.actionHook.name}`);
      hook.actionHook(Flex, manager);
    }
    
    if (hook.channelsHook) {
      console.info(`Feature ${name} registered channels hook: ${hook.channelsHook.name}`);
      // returns a task channel to register
      const channel = hook.channelsHook(Flex, manager);
      Flex.TaskChannels.register(channel);
    }
    
    if (hook.chatOrchestratorHook) {
      console.info(`Feature ${name} registered chat orchestrator hook: ${hook.chatOrchestratorHook.name}`);
      // returns object with event and handler
      const { event, handler } = hook.chatOrchestratorHook(Flex, manager);
      Flex.ChatOrchestrator.setOrchestrations(event, handler);
    }
    
    if (hook.componentHook) {
      console.info(`Feature ${name} registered component hook: ${hook.componentHook.name}`);
      hook.componentHook(Flex, manager);
    }
    
    if (hook.cssOverrideHook) {
      CssOverrides.addHook(Flex, manager, name, hook);
    }
    
    if (hook.eventHook) {
      Events.addHook(Flex, manager, name, hook);
    }
    
    if (hook.jsClientHook) {
      JsClientEvents.addHook(Flex, manager, name, hook);
    }
    
    if (hook.notificationHook) {
      console.info(`Feature ${name} registered notification hook: ${hook.notificationHook.name}`);
      // Returns array of notification definitions to register
      const notifications = hook.notificationHook(Flex, manager) as [Flex.Notification];
      notifications.forEach(notification => {
        Flex.Notifications.registerNotification(notification);
      });
    }
    
    if (hook.pasteElementHook) {
      PasteElements.addHook(Flex, manager, name, hook);
    }
    
    if (hook.reducerHook) {
      Reducers.addHook(Flex, manager, name, hook);
    }
    
    if (hook.stringHook) {
      Strings.addHook(Flex, manager, name, hook);
    }
    
    if (hook.teamsFilterHook) {
      TeamsFilters.addHook(Flex, manager, name, hook);
    }
    
  })
}