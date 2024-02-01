import * as Flex from '@twilio/flex-ui';
import mergeWith from 'lodash/mergeWith';
import unset from 'lodash/unset';

import { UIAttributes } from '../src/types/manager/ServiceConfiguration';

// NOTE: Not sure a great way to "set" the Flex serviceConfiguration value per test
//       So the __mocks__/@twilio/flex-ui.js file will use this variable as value
//       And tests can use these functions to set value (will automatically get reset after each test)

interface ServiceConfiguration extends Flex.ServiceConfiguration {
  ui_attributes: UIAttributes;
}

// Create an interface so we can set ui_attributes with our custom data and intellisense
// Make ui_attributes Partial for ease of testing code (only provide what you need in test)
interface ServiceConfigurationUpdate extends Flex.ServiceConfiguration {
  ui_attributes: Partial<UIAttributes>;
}

const mockedUiAttributes: UIAttributes = {
  custom_data: {
    serverless_functions_protocol: 'https',
    serverless_functions_port: '443',
    serverless_functions_domain: 'mockServerlessFunctionsDomain',
    language: 'default',
    features: {},
  },
};

let mockedServiceConfiguration: ServiceConfiguration = {
  account_sid: 'mockAccountSid',
  attributes: {},
  call_recording_enabled: false,
  channel_configs: [],
  chat_service_instance_sid: 'mockChatServiceInstanceSid',
  crm_attributes: null,
  crm_callback_url: 'mockCrmCallbackUrl',
  crm_enabled: false,
  crm_fallback_url: 'mockCrmFallbackUrl',
  crm_type: 'mockCrmType',
  date_created: new Date().toISOString(),
  date_updated: new Date().toISOString(),
  debugger_integration: {
    enabled: true,
  },
  flex_ui_status_report: {
    enabled: true,
  },
  messaging_service_instance_sid: 'mockMessagingServiceInstanceSid',
  outbound_call_flows: {},
  plugin_service_attributes: {},
  queue_stats_configuration: null,
  runtime_domain: 'mockRuntimeDomain',
  service_version: 'mockServiceVersion',
  status: 'mockStatus',
  taskrouter_offline_activity_sid: 'mockTaskrouterOfflineActivitySid',
  taskrouter_skills: [],
  taskrouter_target_taskqueue_sid: 'mockTaskrouterTargetTaskqueueSid',
  taskrouter_target_workflow_sid: 'mockTaskrouterTargetWorkflowSid',
  taskrouter_taskqueues: null,
  taskrouter_worker_attributes: null,
  taskrouter_worker_channels: null,
  taskrouter_workspace_sid: 'mockTaskrouterWorkspaceSid',
  ui_attributes: mockedUiAttributes,
  ui_language: 'mockUiLanguage',
  ui_version: 'mockUiVersion',
  url: 'mockUrl',
  markdown: {
    enabled: false,
    mode: 'readOnly',
  },
  notifications: {
    enabled: false,
    mode: 'whenNotInFocus',
  },
  call_recording_webhook_url: '',
  flex_service_instance_sid: '',
  plugin_service_enabled: false,
  public_attributes: {},
  serverless_service_sids: [],
  ui_dependencies: {},
};

export const getMockedServiceConfiguration = () => mockedServiceConfiguration as Flex.ServiceConfiguration;
export const getMockedUiAttributes = () => mockedUiAttributes as Flex.Config;
export const resetServiceConfiguration = () => {
  mockedServiceConfiguration = {
    account_sid: 'mockAccountSid',
    attributes: {},
    call_recording_enabled: false,
    channel_configs: [],
    chat_service_instance_sid: 'mockChatServiceInstanceSid',
    crm_attributes: null,
    crm_callback_url: 'mockCrmCallbackUrl',
    crm_enabled: false,
    crm_fallback_url: 'mockCrmFallbackUrl',
    crm_type: 'mockCrmType',
    date_created: new Date().toISOString(),
    date_updated: new Date().toISOString(),
    debugger_integration: {
      enabled: true,
    },
    flex_ui_status_report: {
      enabled: true,
    },
    messaging_service_instance_sid: 'mockMessagingServiceInstanceSid',
    outbound_call_flows: {},
    plugin_service_attributes: {},
    queue_stats_configuration: null,
    runtime_domain: 'mockRuntimeDomain',
    service_version: 'mockServiceVersion',
    status: 'mockStatus',
    taskrouter_offline_activity_sid: 'mockTaskrouterOfflineActivitySid',
    taskrouter_skills: [],
    taskrouter_target_taskqueue_sid: 'mockTaskrouterTargetTaskqueueSid',
    taskrouter_target_workflow_sid: 'mockTaskrouterTargetWorkflowSid',
    taskrouter_taskqueues: null,
    taskrouter_worker_attributes: null,
    taskrouter_worker_channels: null,
    taskrouter_workspace_sid: 'mockTaskrouterWorkspaceSid',
    ui_attributes: mockedUiAttributes,
    ui_language: 'mockUiLanguage',
    ui_version: 'mockUiVersion',
    url: 'mockUrl',
    markdown: {
      enabled: false,
      mode: 'readOnly',
    },
    notifications: {
      enabled: false,
      mode: 'whenNotInFocus',
    },
    call_recording_webhook_url: '',
    flex_service_instance_sid: '',
    plugin_service_enabled: false,
    public_attributes: {},
    serverless_service_sids: [],
    ui_dependencies: {},
  };
};
export const setServiceConfiguration = (serviceConfiguration: Partial<ServiceConfigurationUpdate>) => {
  mergeWith(mockedServiceConfiguration, serviceConfiguration, (_objValue, srcValue, key, obj) => {
    if (srcValue === undefined) {
      unset(obj, key);
    }
  });
};
