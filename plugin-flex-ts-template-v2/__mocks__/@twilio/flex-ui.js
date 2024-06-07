import React from 'react';
import styled from '@emotion/styled';
import { EventEmitter } from 'events';
import { getMockedServiceConfiguration, getMockedUiAttributes } from '../../test-utils/flex-service-configuration';
import { getMockedReduxState } from '../../test-utils/flex-redux';

// We need to mock anything our plugin uses from @twilio/flex-ui here

class Actions {
  eventListeners = {};

  constructor() {
    this.invokeAction = jest.fn(async (name, payload) => {
      const lifecycle = [
        this.eventListeners[`before${name}`] || [],
        this.eventListeners[name] || [],
        this.eventListeners[`after${name}`] || [],
      ];
      try {
        await Promise.all(
          lifecycle[0].map((listener) => {
            return new Promise(async (resolve, reject) => {
              await listener(payload, () => {
                reject(`Action ${name} cancelled by before event`);
              });
              resolve();
            });
          }),
        );
      } catch (e) {
        throw new Error(e);
      }
      await Promise.all(lifecycle[1].map(async (listener) => await listener(payload)));
      await Promise.all(lifecycle[2].map(async (listener) => await listener(payload)));
    });

    this.addListener = jest.fn((event, listener) => {
      if (this.eventListeners[event]) {
        this.eventListeners[event].push(listener);
      } else {
        this.eventListeners[event] = [listener];
      }
    });

    this.removeAllListeners = jest.fn((event) => {
      if (event) {
        delete this.eventListeners[event];
      } else {
        this.eventListeners = {};
      }
    });

    this.removeListener = jest.fn((event, listener) => {
      if (this.eventListeners[event]) {
        delete this.eventListeners[event][listener];
      } else {
        this.eventListeners[event] = [];
      }
    });
  }
}

class ConferenceParticipant {
  constructor(source, callSid) {
    this.source = source;
    this.callSid = callSid;
    this.participantType = source.participant_type;
  }
}

class DynamicContentStore {
  add = jest.fn();
  remove = jest.fn();
  replace = jest.fn();
}

class Manager {
  get serviceConfiguration() {
    return getMockedServiceConfiguration();
  }

  get configuration() {
    return getMockedUiAttributes();
  }

  constructor() {
    this.events = new EventEmitter();
    this.workerClient = new WorkerClient();
    this.conversationsClient = {
      getConversationBySid: () =>
        Promise.resolve({
          attributes: {
            associatedTasks: { TAxxx: '' },
          },
        }),
    };
    this.store = {
      addReducer: jest.fn(),
      dispatch: jest.fn(),
      getState: jest.fn(() => getMockedReduxState()),
    };
    this.user = {
      token: 'mockedToken',
    };
  }
  getInstance() {
    return this;
  }
}

class Notifications {
  registeredNotifications = new Map();

  constructor() {}

  registerNotification(notification) {
    this.registeredNotifications.set(notification.id, notification);
  }

  showNotification = jest.fn();
  dismissNotificationById = jest.fn();
}

class StateHelper {
  constructor() {}

  getTaskByTaskrouterTaskSid = (props) => jest.fn();
  getConversationStateForTask = jest.fn();
}

class TaskHelper {
  constructor() {}

  canHold = jest.fn().mockReturnValue(true);
  isOutboundCallTask = jest.fn().mockReturnValue(true);
  isCallTask = jest.fn().mockReturnValue(true);
  isChatBasedTask = jest.fn().mockReturnValue(true);
  isCBMTask = jest.fn().mockReturnValue(false);
  getTaskByTaskSid = jest.fn();
}

class WorkerClient extends EventEmitter {
  constructor() {
    super();
    this.sid = 'mockWorkerSid';
    this.attributes = {};
    this.reservations = new Map();
  }
}

module.exports = {
  // Programmable components
  AgentDesktopView: {
    defaultProps: {
      splitterOptions: {},
    },
  },
  CallCanvas: {
    Content: new DynamicContentStore(),
  },
  CallCanvasActions: {
    Content: new DynamicContentStore(),
  },
  CRMContainer: {
    Content: new DynamicContentStore(),
  },
  ParticipantCanvas: {
    Content: new DynamicContentStore(),
    ListItem: {
      Content: new DynamicContentStore(),
    },
  },
  ParticipantsCanvas: {
    Content: new DynamicContentStore(),
  },
  TaskCanvasHeader: {
    Content: new DynamicContentStore(),
  },
  TaskCanvasTabs: {
    Content: new DynamicContentStore(),
  },
  WorkerDirectory: {
    Tabs: {
      Content: new DynamicContentStore(),
    },
  },
  // Flex components
  Template: ({ source }) => <span>{source()}</span>,
  SideLink: () => <React.Fragment />,
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
  Icon: () => <React.Fragment />,
  IconButton: (props) => <button {...props} />,
  FlexBox: () => <React.Fragment />,
  FlexBoxColumn: () => <React.Fragment />,
  Tab: () => <React.Fragment />,
  // Singleton classes
  Actions: new Actions(),
  Manager: new Manager(),
  Notifications: new Notifications(),
  StateHelper: new StateHelper(),
  TaskHelper: new TaskHelper(),
  // Misc
  ChatOrchestrator: {
    orchestrateCompleteTask: jest.fn(),
  },
  ConferenceParticipant,
  NotificationType: {
    success: 'success',
    warning: 'warning',
    error: 'error',
  },
  NotificationBar: {
    Action: () => <React.Fragment />,
  },
  Plugins: {
    plugins: [],
  },
  styled,
  TaskContext: {
    Consumer: React.Fragment,
  },
  templates: new Proxy(
    {},
    {
      get(_target, p) {
        return () => p;
      },
    },
  ),
  // Component wrappers
  withTaskContext: (WrappedComponent) => {
    return () => ({
      render() {
        return <WrappedComponent />;
      },
    });
  },
  withTheme: (WrappedComponent) => {
    return () => ({
      render() {
        return <WrappedComponent theme={{}} />;
      },
    });
  },
};
