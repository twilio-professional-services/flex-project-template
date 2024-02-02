import * as Flex from '@twilio/flex-ui';

import { FeatureDefinition } from '../../types/feature-loader';
import * as Actions from './actions';
import * as Channels from './channels';
import * as ChatOrchestrator from './chat-orchestrator';
import * as Components from './components';
import * as CssOverrides from './css-overrides';
import * as Events from './events';
import * as JsClientEvents from './jsclient-event-listeners';
import * as Notifications from './notifications';
import * as NotificationEvents from './notification-events';
import * as PasteElements from './paste-elements';
import * as Reducers from './reducers';
import * as Strings from './strings';
import * as TeamsFilters from './teams-filters';
import * as SyncClientTokenUpdated from '../sdk-clients/sync/tokenUpdated';
import * as TaskRouterReplaceCompleteTask from '../serverless/TaskRouter/CompleteTask';
import * as Logger from './logger';
import * as SendLogsToBrowserConsole from '../logger/sendLogsToBrowserConsole';
// @ts-ignore
// eslint-disable-next-line import/no-useless-path-segments
import features from '../../feature-library/*/index.ts';

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

    try {
      const feature = file.register() as FeatureDefinition;

      if (feature && feature.name) {
        loadFeature(flex, manager, feature);
      }
    } catch (error) {
      console.error('Error loading feature:', error);
    }
  }

  // Register built-in hooks
  Actions.addHook(flex, manager, 'built-in TaskRouterService', TaskRouterReplaceCompleteTask);
  Events.addHook(flex, manager, 'built-in Sync client', SyncClientTokenUpdated);
  Logger.addHook(flex, manager, 'built-in logger to browser console', SendLogsToBrowserConsole);

  // After all features have initialized, execute deferred hooks
  Logger.init(manager);
  CssOverrides.init(manager);
  PasteElements.init(flex);
  Reducers.init(manager);
  Strings.init(manager);
  Components.init(flex, manager);
  TeamsFilters.init(flex, manager);
};

export const loadFeature = (flex: typeof Flex, manager: Flex.Manager, feature: FeatureDefinition) => {
  // Features invoke this function to register their hooks
  const name = feature.name ?? 'unknown';
  const hooks = feature.hooks ?? [];
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

    if (hook.loggerHook) {
      Logger.addHook(flex, manager, name, hook);
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

    if (hook.systemStringHook) {
      Strings.addSystemHook(flex, manager, name, hook);
    }

    if (hook.teamsFilterHook) {
      TeamsFilters.addHook(flex, manager, name, hook);
    }
  }
};
