import React from 'react';
import { EventEmitter } from 'events';
import { getMockedServiceConfiguration, getMockedUiAttributes } from '../../test-utils/flex-service-configuration';
import { getMockedReduxState } from '../../test-utils/flex-redux';

// We need to mock anything our plugin uses from @twilio/flex-ui here

class WorkerClient extends EventEmitter {
  constructor() {
    super();
    this.sid = 'mockWorkerSid';
    this.attributes = {

    };
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
    this.store = {
      addReducer: jest.fn(),
      dispatch: jest.fn(),
      getState: jest.fn(() => getMockedReduxState())
    };
    this.user = {
      token: 'mockedToken'
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
        this.eventListeners[`after${name}`] || []
      ];
      try {
        await Promise.all(lifecycle[0].map(listener => {
          return new Promise(async (resolve, reject) => {
            await listener(payload, () => {
              reject(`Action ${name} cancelled by before event`);
            });
            resolve();
          })
        }));
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

    this.removeAllListeners = jest.fn(event => {
      if (event) {
        delete this.eventListeners[event];
      } else {
        this.eventListeners = {};
      }
    });
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

module.exports = {
  CRMContainer: {
    Content: {
      replace: jest.fn()
    }
  },
  AgentDesktopView: {
    defaultProps: {
      splitterOptions: {}
    }
  },
  Actions: new Actions(),
  Manager: new Manager(),
  Notifications: new Notifications(),
  NotificationType: {
    warning: 'warning',
    error: 'error'
  },
  templates: {
    WorkerDirectorySearchPlaceholder: () => '',
    WarmTransferTooltip: () => '',
    ColdTransferTooltip: () => ''
  },
  NotificationBar: {
    Action: () => <React.Fragment></React.Fragment>
  },
  SideLink: () => ({
    render() {
      return <React.Fragment />;
    }
  }),
  Icon: () => ({
    render() {
      return <React.Fragment />;
    }
  }),
  IconButton: () => ({
    render() {
      return <React.Fragment />;
    }
  }),
  FlexBox: () => ({
    render() {
      return <React.Fragment />;
    }
  }),
  FlexBoxColumn: () => ({
    render() {
      return <React.Fragment />;
    }
  }),
  ConferenceParticipant: ConferenceParticipant,
  withTaskContext: (WrappedComponent) => {
    return () => ({
      render() {
        return <WrappedComponent />;
      }
    });
  },
  withTheme: (WrappedComponent) => {
    return () => ({
      render() {
        return <WrappedComponent theme={{}} />;
      }
    });
  }
};