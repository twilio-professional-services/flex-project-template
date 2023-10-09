import { Actions, Manager, Notifications } from '@twilio/flex-ui';

import { CustomWorkerAttributes } from '../../../types/task-router/Worker';
import { isFeatureEnabled } from '../config';
import { AdminUiNotification } from '../flex-hooks/notifications';
import AdminUiService from './AdminUiService';

const acronyms = ['id', 'ui', 'sip', 'pstn', 'sms', 'crm', 'sla', 'cbm', 'url'];
const hiddenFeatures = ['admin_ui'];
const docsBaseUrl = 'https://twilio-professional-services.github.io/flex-project-template';

// String to identify the 'common' feature
// Explicitly a value that is invalid per the 'add-feature' script
export const featureCommon = '_common_';

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

  if (feature === featureCommon) {
    updatePayload = {
      common: config,
    };
  } else {
    updatePayload = {
      features: {
        [feature]: config,
      },
    };
  }

  await Actions.invokeAction('SetWorkerAttributes', {
    mergeExisting: true,
    attributes: {
      config_overrides: updatePayload,
    },
  });
};

const resetWorkerSetting = async (feature: string) => {
  const workerClient = Manager.getInstance().workerClient;

  if (!workerClient) {
    return;
  }

  const attributes = workerClient.attributes as CustomWorkerAttributes;

  if (feature === featureCommon) {
    if (attributes?.config_overrides?.common) {
      delete attributes.config_overrides.common;
    }
  } else if (attributes?.config_overrides?.features && attributes.config_overrides.features[feature]) {
    delete attributes.config_overrides.features[feature];
  }

  await workerClient.setAttributes(attributes);
};

export const saveUserConfig = async (feature: string, config: any): Promise<boolean> => {
  try {
    if (config) {
      await updateWorkerSetting(feature, config);
    } else {
      await resetWorkerSetting(feature);
    }
  } catch (error) {
    Notifications.dismissNotificationById(AdminUiNotification.SAVE_SUCCESS);
    Notifications.showNotification(AdminUiNotification.SAVE_ERROR);
    console.error('admin-ui: Unable to update user config', error);
    return false;
  }

  Notifications.dismissNotificationById(AdminUiNotification.SAVE_ERROR);
  Notifications.dismissNotificationById(AdminUiNotification.SAVE_SUCCESS);
  Notifications.showNotification(AdminUiNotification.SAVE_SUCCESS);

  return true;
};

export const saveGlobalConfig = async (feature: string, config: any, mergeFeature: boolean): Promise<any> => {
  let returnVal = false;
  try {
    let updatePayload = {};

    if (feature === featureCommon) {
      updatePayload = {
        custom_data: {
          common: config,
        },
      };
    } else {
      updatePayload = {
        custom_data: {
          features: {
            [feature]: config,
          },
        },
      };
    }

    const updateResponse = await AdminUiService.updateUiAttributes(JSON.stringify(updatePayload), mergeFeature);
    if (updateResponse?.configuration?.custom_data) {
      returnVal = updateResponse.configuration.custom_data;
    } else {
      console.error('admin-ui: Unexpected response upon updating global config', updateResponse);
    }
  } catch (error) {
    console.error('admin-ui: Unable to update global config', error);
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
