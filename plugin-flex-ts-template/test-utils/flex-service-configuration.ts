import * as Flex from '@twilio/flex-ui';
import { UIAttributes } from '../src/types/manager/ServiceConfiguration';
import { mergeWith, unset } from 'lodash';

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

let mockedServiceConfiguration: ServiceConfiguration = {
  account_sid: 'mockAccountSid',
  attributes: {},
  call_recording_enabled: false,
  chat_service_instance_sid: 'mockChatServiceInstanceSid',
  crm_attributes: null,
  crm_callback_url: 'mockCrmCallbackUrl',
  crm_enabled: false,
  crm_fallback_url: 'mockCrmFallbackUrl',
  crm_type: 'mockCrmType',
  date_created: new Date().toISOString(),
  date_updated: new Date().toISOString(),
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
  ui_attributes: {
    serverless_functions_domain: 'mockServerlessFunctionsDomain',
    custom_data: {}
  },
  ui_language: 'mockUiLanguage',
  ui_version: 'mockUiVersion',
  url: 'mockUrl',
  markdown: {
    enabled: false,
    mode: 'readOnly'
  },
  notifications: {
    enabled: false,
    mode: 'whenNotInFocus'
  },
  call_recording_webhook_url: '',
  flex_service_instance_sid: '',
  plugin_service_enabled: false,
  public_attributes: undefined,
  serverless_service_sids: [],
  ui_dependencies: {}
};

export const getMockedServiceConfiguration = () => mockedServiceConfiguration as Flex.ServiceConfiguration;
export const resetServiceConfiguration = () => {
  mockedServiceConfiguration = {
    account_sid: 'mockAccountSid',
    attributes: {},
    call_recording_enabled: false,
    chat_service_instance_sid: 'mockChatServiceInstanceSid',
    crm_attributes: null,
    crm_callback_url: 'mockCrmCallbackUrl',
    crm_enabled: false,
    crm_fallback_url: 'mockCrmFallbackUrl',
    crm_type: 'mockCrmType',
    date_created: new Date().toISOString(),
    date_updated: new Date().toISOString(),
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
    ui_attributes: {
      serverless_functions_domain: 'mockServerlessFunctionsDomain',
      custom_data: {}
    },
    ui_language: 'mockUiLanguage',
    ui_version: 'mockUiVersion',
    url: 'mockUrl',
    markdown: {
      enabled: false,
      mode: 'readOnly'
    },
    notifications: {
      enabled: false,
      mode: 'whenNotInFocus'
    },
    call_recording_webhook_url: '',
    flex_service_instance_sid: '',
    plugin_service_enabled: false,
    public_attributes: undefined,
    serverless_service_sids: [],
    ui_dependencies: {}
  };
}
export const setServiceConfiguration = (serviceConfiguration: Partial<ServiceConfigurationUpdate>) => {
  mergeWith(mockedServiceConfiguration, serviceConfiguration, (objValue, srcValue, key, obj) => {
    if (srcValue === undefined) {
      unset(obj, key);
    }
  });
}