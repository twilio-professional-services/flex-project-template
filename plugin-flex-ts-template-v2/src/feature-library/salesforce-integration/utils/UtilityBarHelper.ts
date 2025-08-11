import { ITask, templates } from '@twilio/flex-ui';
import { Activity } from 'types/task-router';

import { getOpenCti } from './SfdcHelper';
import logger from '../../../utils/logger';
import { StringTemplates } from '../flex-hooks/strings';

export const setSoftphonePanelVisibility = (visible: boolean) => {
  // Check current visibility, change it if not the desired value
  getOpenCti().isSoftphonePanelVisible({
    callback: (response: any) => {
      if (response.success && Boolean(response.returnValue?.visible) !== visible) {
        getOpenCti().setSoftphonePanelVisibility({
          visible,
          callback: (result: any) => {
            if (!result.success) {
              logger.error('[salesforce-integration] Failed to set softphone panel visibility', result);
            }
          },
        });
        return;
      }

      if (!response.success) {
        logger.error('[salesforce-integration] Failed to get softphone panel visibility', response);
      }
    },
  });
};

export const setSoftphoneItemIcon = (key: string) => {
  getOpenCti().setSoftphoneItemIcon({
    key,
    callback: (result: any) => {
      if (!result.success) {
        logger.error('[salesforce-integration] Failed to set softphone panel icon', result);
      }
    },
  });
};

export const setSoftphoneItemLabel = (label: string) => {
  getOpenCti().setSoftphoneItemLabel({
    label,
    callback: (result: any) => {
      if (!result.success) {
        logger.error('[salesforce-integration] Failed to set softphone panel icon', result);
      }
    },
  });
};

export const updateUtilityBar = (activity: Activity, tasks: Map<string, ITask<Record<string, any>>>) => {
  if (!getOpenCti()) {
    return;
  }

  // 1. If no tasks, display the current activity
  if (!tasks.size) {
    setSoftphoneItemIcon(activity.available ? 'circle' : 'away');
    setSoftphoneItemLabel(activity.name);
    return;
  }

  // 2. Display alert for any pending tasks
  for (const task of tasks.values()) {
    if (task.status === 'pending') {
      setSoftphoneItemIcon('alert');
      setSoftphoneItemLabel(templates[StringTemplates.IncomingTaskLabel]());
      return;
    }
  }

  // 3. Show task count
  setSoftphoneItemIcon('task');
  setSoftphoneItemLabel(
    templates[StringTemplates.TasksLabel]({
      numTasks: tasks.size,
      singular: tasks.size === 1,
    }),
  );
};
