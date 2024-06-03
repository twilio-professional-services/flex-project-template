import React from 'react';
import styled from '@emotion/styled';
import { EventEmitter } from 'events';
import { getMockedServiceConfiguration, getMockedUiAttributes } from '../../test-utils/flex-service-configuration';
import { getMockedReduxState } from '../../test-utils/flex-redux';

// We need to mock anything our plugin uses from @twilio/flex-ui here

class WorkerClient extends EventEmitter {
  constructor() {
    super();
    this.sid = 'mockWorkerSid';
    this.attributes = {};
    this.reservations = new Map();
  }
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

class ConferenceParticipant {
  constructor(source, callSid) {
    this.source = source;
    this.callSid = callSid;
    this.participantType = source.participant_type;
  }
}

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

class TaskHelper {
  constructor() {}

  canHold = jest.fn().mockReturnValue(true);
  isOutboundCallTask = jest.fn().mockReturnValue(true);
  isCallTask = jest.fn().mockReturnValue(true);
  isChatBasedTask = jest.fn().mockReturnValue(true);
  isCBMTask = jest.fn().mockReturnValue(false);
  getTaskByTaskSid = jest.fn();
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

class DynamicContentStore {
  add = jest.fn();
  remove = jest.fn();
  replace = jest.fn();
}

module.exports = {
  CRMContainer: {
    Content: new DynamicContentStore(),
  },
  CallCanvas: {
    Content: new DynamicContentStore(),
  },
  TaskCanvasHeader: {
    Content: new DynamicContentStore(),
  },
  TaskCanvasTabs: {
    Content: new DynamicContentStore(),
  },
  CallCanvasActions: {
    Content: new DynamicContentStore(),
  },
  ParticipantsCanvas: {
    Content: new DynamicContentStore(),
  },
  ParticipantCanvas: {
    Content: new DynamicContentStore(),
    ListItem: {
      Content: new DynamicContentStore(),
    },
  },
  AgentDesktopView: {
    defaultProps: {
      splitterOptions: {},
    },
  },
  WorkerDirectory: {
    Tabs: {
      Content: new DynamicContentStore(),
    },
  },
  Actions: new Actions(),
  Manager: new Manager(),
  Notifications: new Notifications(),
  TaskHelper: new TaskHelper(),
  NotificationType: {
    warning: 'warning',
    error: 'error',
  },
  templates: new Proxy(
    {},
    {
      get(_target, p) {
        return () => p;
      },
    },
  ),
  NotificationBar: {
    Action: () => <React.Fragment></React.Fragment>,
  },
  ChatOrchestrator: {
    orchestrateCompleteTask: jest.fn(),
  },
  StateHelper: {
    getTaskByTaskrouterTaskSid: (props) => jest.fn(),
    getConversationStateForTask: jest.fn(),
  },
  styled: styled,
  Template: ({ source }) => <span>{source()}</span>,
  SideLink: () => ({
    render() {
      return <React.Fragment />;
    },
  }),
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
  Icon: () => ({
    render() {
      return <React.Fragment />;
    },
  }),
  IconButton: (props) => <button {...props} />,
  FlexBox: () => ({
    render() {
      return <React.Fragment />;
    },
  }),
  FlexBoxColumn: () => ({
    render() {
      return <React.Fragment />;
    },
  }),
  Tab: () => ({
    render() {
      return <React.Fragment />;
    },
  }),
  ConferenceParticipant: ConferenceParticipant,
  Plugins: {
    plugins: [],
  },
  withTaskContext: (WrappedComponent) => {
    return () => ({
      render() {
        return <WrappedComponent />;
      },
    });
  },
  TaskContext: {
    Consumer: React.Fragment,
  },
  withTheme: (WrappedComponent) => {
    return () => ({
      render() {
        return <WrappedComponent theme={{}} />;
      },
    });
  },
};
