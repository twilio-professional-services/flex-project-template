import { Actions, Manager } from '@twilio/flex-ui';

import { CustomWorkerAttributes } from '../../../types/task-router/Worker';
import { isFeatureEnabled } from '../config';

export const canShowAdminUi = (manager: Manager) => {
  const { roles } = manager.user;
  return isFeatureEnabled() === true && roles.indexOf('admin') >= 0;
};

export const formatName = (name: string): string => {
  if (name.length > 0) {
    return name[0].toUpperCase() + name.slice(1).replaceAll('_', ' ');
  }

  return name;
};

export const formatDocsUrl = (name: string): string => {
  return `https://twilio-professional-services.github.io/flex-project-template/feature-library/flex-v2/${name.replaceAll(
    '_',
    '-',
  )}`;
};

export const updateWorkerSetting = async (feature: string, config: any) => {
  await Actions.invokeAction('SetWorkerAttributes', {
    mergeExisting: true,
    attributes: {
      custom_data: {
        features: {
          [feature]: config,
        },
      },
    },
  });
};

export const resetWorkerSetting = async (feature: string) => {
  const workerClient = Manager.getInstance().workerClient;

  if (!workerClient) {
    return;
  }

  const attributes = workerClient.attributes as CustomWorkerAttributes;

  if (attributes?.custom_data?.features && attributes.custom_data.features[feature]) {
    delete attributes.custom_data.features[feature];
  }

  await workerClient.setAttributes(attributes);
};
