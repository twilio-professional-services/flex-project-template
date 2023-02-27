import * as Flex from "@twilio/flex-ui";
import { FeatureDefinition } from "../../types/feature-loader";
import * as Actions from "./actions";
import * as Channels from "./channels";
import * as ChatOrchestrator from "./chat-orchestrator";
import * as Components from "./components";
import * as CssOverrides from "./css-overrides";
import * as Events from "./events";
import * as JsClientEvents from "./jsclient-event-listeners";
import * as Notifications from "./notifications";
import * as NotificationEvents from "./notification-events";
import * as PasteElements from "./paste-elements";
import * as Reducers from "./reducers";
import * as Strings from "./strings";
import * as TeamsFilters from "./teams-filters";

// @ts-ignore
import features from "../../feature-library/*/index.ts";

export const initFeatures = (flex: typeof Flex, manager: Flex.Manager) => {
  if (typeof features === 'undefined') {
    // no features discovered; abort
    return;
  }
  
  for (const file of features) {
    // Each feature index file should export a `register` function for us to invoke
    if (!file.register) {
      console.error('Feature found, but its index file does not export a `register` function', file);
      return;
    }
    
    const { name, hooks } = file.register() as FeatureDefinition;
    
    if (name && hooks) {
      loadFeature(flex, manager, name, hooks);
    } else if (name) {
      console.error(`Feature ${name} found, but it did not return hooks to load`, file);
    }
  };
  
  // After all features have initialized, execute deferred hooks
  CssOverrides.init(manager);
  PasteElements.init(flex);
  Reducers.init(manager);
  Strings.init(manager);
  Components.init(flex, manager);
  TeamsFilters.init(flex, manager);
}

export const loadFeature = (flex: typeof Flex, manager: Flex.Manager, name: string, hooks: any[]) => {
  // Features invoke this function to register their hooks
  console.info(`%cFeature enabled: ${name}`, 'background: green; color: white;');
  
  for (const hook of hooks) {
    // Each hook exports a function or property for us to handle.
    // Register the hook based on the export(s) present.
    
    if (hook.actionHook) {
      Actions.addHook(flex, manager, name, hook);
    }
    
    if (hook.channelHook) {
      Channels.addHook(flex, manager, name, hook);
    }
    
    if (hook.chatOrchestratorHook) {
      ChatOrchestrator.addHook(flex, manager, name, hook);
    }
    
    if (hook.componentHook) {
      Components.addHook(flex, manager, name, hook);
    }
    
    if (hook.cssOverrideHook) {
      CssOverrides.addHook(flex, manager, name, hook);
    }
    
    if (hook.eventHook) {
      Events.addHook(flex, manager, name, hook);
    }
    
    if (hook.jsClientHook) {
      JsClientEvents.addHook(flex, manager, name, hook);
    }
    
    if (hook.notificationHook) {
      Notifications.addHook(flex, manager, name, hook);
    }
    
    if (hook.notificationEventHook) {
      NotificationEvents.addHook(flex, manager, name, hook);
    }
    
    if (hook.pasteElementHook) {
      PasteElements.addHook(flex, manager, name, hook);
    }
    
    if (hook.reducerHook) {
      Reducers.addHook(flex, manager, name, hook);
    }
    
    if (hook.stringHook) {
      Strings.addHook(flex, manager, name, hook);
    }
    
    if (hook.teamsFilterHook) {
      TeamsFilters.addHook(flex, manager, name, hook);
    }
    
  }
}