import { Actions, Manager, Notifications } from '@twilio/flex-ui';
import merge from 'lodash/merge';

import { CustomWorkerAttributes } from '../../../types/task-router/Worker';
import { UIAttributes } from '../../../types/manager/ServiceConfiguration';
import { isFeatureEnabled, isAuditLoggingEnabled } from '../config';
import { AdminUiNotification } from '../flex-hooks/notifications';
import AdminUiService from './AdminUiService';
import { saveAuditEvent } from '../../../utils/helpers/AuditHelper';
import logger from '../../../utils/logger';

const acronyms = ['id', 'ui', 'sip', 'pstn', 'sms', 'crm', 'sla', 'cbm', 'url', 'ttl'];
const hiddenFeatures = ['admin_ui'];
const docsBaseUrl = 'https://twilio-professional-services.github.io/flex-project-template';

// String to identify the 'common' feature
// Explicitly a value that is invalid per the 'add-feature' script
export const featureCommon = '_common_';

let globalConfigCache = {} as UIAttributes;
export const getGlobalConfig = async () => {
  globalConfigCache = (await AdminUiService.fetchUiAttributes()).configuration || {};
  return globalConfigCache;
};

export const canShowAdminUi = (manager: Manager) => {
  const { roles } = manager.user;
  return isFeatureEnabled() === true && roles.indexOf('admin') >= 0;
};

export const formatName = (name: string): string => {
  let formatted = name;
  if (name.length > 0) {
    formatted = name[0].toUpperCase() + name.slice(1).replaceAll('_', ' ');
  }

  acronyms.forEach((acronym) => {
    if (name === acronym) {
      formatted = acronym.toUpperCase();
      return;
    }

    if (name.startsWith(`${acronym}_`)) {
      formatted = acronym.toUpperCase() + formatted.slice(acronym.length);
    }

    if (name.endsWith(`_${acronym}`)) {
      formatted = formatted.slice(0, formatted.length - acronym.length) + acronym.toUpperCase();
    }

    formatted = formatted.replaceAll(` ${acronym} `, ` ${acronym.toUpperCase()} `);
  });

  return formatted;
};

export const formatDocsUrl = (name: string): string => {
  if (name === featureCommon) {
    return `${docsBaseUrl}/building/template-utilities/configuration#common-configuration`;
  }

  return `${docsBaseUrl}/feature-library/${name.replaceAll('_', '-')}`;
};

const updateWorkerSetting = async (feature: string, config: any) => {
  let updatePayload = {};
  let originalConfig = {};

  // We need the original config for the audit log
  const workerClient = Manager.getInstance().workerClient;
  const attributes = workerClient?.attributes as CustomWorkerAttributes;

  if (feature === featureCommon) {
    updatePayload = {
      common: config,
    };
    if (attributes?.config_overrides?.common) {
      originalConfig = { common: { ...attributes?.config_overrides?.common } };
    }
  } else {
    updatePayload = {
      features: {
        [feature]: config,
      },
    };
    if (attributes?.config_overrides?.features && attributes?.config_overrides?.features[feature]) {
      originalConfig = { features: { [feature]: { ...attributes?.config_overrides?.features[feature] } } };
    }
  }

  await Actions.invokeAction('SetWorkerAttributes', {
    mergeExisting: true,
    attributes: {
      config_overrides: updatePayload,
    },
  });
  auditLog(false, originalConfig, merge({}, originalConfig, updatePayload));
};

const resetWorkerSetting = async (feature: string) => {
  const workerClient = Manager.getInstance().workerClient;

  if (!workerClient) {
    return;
  }

  const attributes = workerClient.attributes as CustomWorkerAttributes;
  // stringify the original config to preserve nested original objects
  const originalConfig = JSON.stringify(attributes?.config_overrides ?? {});

  if (feature === featureCommon) {
    if (attributes?.config_overrides?.common) {
      delete attributes.config_overrides.common;
    }
  } else if (attributes?.config_overrides?.features && attributes.config_overrides.features[feature]) {
    delete attributes.config_overrides.features[feature];
  }

  await workerClient.setAttributes(attributes);
  auditLog(false, JSON.parse(originalConfig), attributes?.config_overrides);
};

const auditLog = (global: boolean, oldValue: any, newValue: any) => {
  if (!isAuditLoggingEnabled()) {
    return;
  }
  saveAuditEvent('admin-ui', `update-${global ? 'global' : 'worker'}`, oldValue, newValue);
};

export const saveUserConfig = async (feature: string, config: any): Promise<boolean> => {
  try {
    if (config) {
      await updateWorkerSetting(feature, config);
    } else {
      await resetWorkerSetting(feature);
    }
  } catch (error: any) {
    Notifications.dismissNotificationById(AdminUiNotification.SAVE_SUCCESS);
    Notifications.showNotification(AdminUiNotification.SAVE_ERROR);
    logger.error('[admin-ui] Unable to update user config', error);
    return false;
  }

  Notifications.dismissNotificationById(AdminUiNotification.SAVE_ERROR);
  Notifications.dismissNotificationById(AdminUiNotification.SAVE_SUCCESS);
  Notifications.showNotification(AdminUiNotification.SAVE_SUCCESS);

  return true;
};

export const saveGlobalConfig = async (feature: string, config: any, mergeFeature: boolean): Promise<any> => {
  let returnVal;
  try {
    let updatePayload = {} as any;
    let originalConfig = {};

    if (feature === featureCommon) {
      updatePayload = {
        custom_data: {
          common: config,
        },
      };
      if (globalConfigCache.custom_data?.common) {
        originalConfig = { common: { ...globalConfigCache.custom_data?.common } };
      }
    } else {
      updatePayload = {
        custom_data: {
          features: {
            [feature]: config,
          },
        },
      };
      if (globalConfigCache.custom_data?.features && globalConfigCache.custom_data?.features[feature]) {
        originalConfig = { features: { [feature]: { ...globalConfigCache.custom_data?.features[feature] } } };
      }
    }

    const updateResponse = await AdminUiService.updateUiAttributes(JSON.stringify(updatePayload), mergeFeature);
    if (updateResponse?.configuration?.custom_data) {
      globalConfigCache.custom_data = updateResponse.configuration.custom_data;
      returnVal = globalConfigCache.custom_data;
      auditLog(true, originalConfig, merge({}, originalConfig, updatePayload.custom_data));
    } else {
      logger.error('[admin-ui] Unexpected response upon updating global config', updateResponse);
    }
  } catch (error: any) {
    logger.error('[admin-ui] Unable to update global config', error);
  }

  if (!returnVal) {
    Notifications.dismissNotificationById(AdminUiNotification.SAVE_SUCCESS);
    Notifications.showNotification(AdminUiNotification.SAVE_ERROR);
    return false;
  }

  Notifications.dismissNotificationById(AdminUiNotification.SAVE_ERROR);
  Notifications.dismissNotificationById(AdminUiNotification.SAVE_SUCCESS);
  Notifications.showNotification(AdminUiNotification.SAVE_SUCCESS);
  return returnVal;
};

export const shouldShowFeature = (feature: string): boolean => {
  if (hiddenFeatures.includes(feature)) {
    return false;
  }
  return true;
};
