import { Manager, Notifications } from '@twilio/flex-ui';

import { NotificationIds } from '../flex-hooks/notifications/ScheduleManager';
import ScheduleManagerService from './ScheduleManagerService';
import { Rule, Schedule, ScheduleManagerConfig } from '../types/schedule-manager';
import { isFeatureEnabled } from '../config';

let config = {
  data: {
    rules: [],
    schedules: [],
  },
  version: '',
} as ScheduleManagerConfig;

const delay = async (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const canShowScheduleManager = (manager: Manager) => {
  const { roles } = manager.user;
  return isFeatureEnabled() === true && roles.indexOf('admin') >= 0;
};

export const loadScheduleData = async (): Promise<ScheduleManagerConfig | null> => {
  const listSchedulesResponse = await ScheduleManagerService.list();

  if (listSchedulesResponse) {
    config = listSchedulesResponse;
  }

  return listSchedulesResponse;
};

export const updateScheduleData = (newSchedule: Schedule | null, existingSchedule: Schedule | null): Schedule[] => {
  if (existingSchedule === null && newSchedule !== null) {
    // adding schedule
    config.data.schedules = [...config.data.schedules, newSchedule];
  } else if (existingSchedule !== null && newSchedule === null) {
    // removing existing schedule
    const existingIndex = config.data.schedules.indexOf(existingSchedule);

    if (existingIndex >= 0) {
      config.data.schedules.splice(existingIndex, 1);
    }
  } else if (existingSchedule !== null && newSchedule !== null) {
    // updating existing schedule
    const existingIndex = config.data.schedules.indexOf(existingSchedule);

    if (existingIndex >= 0) {
      config.data.schedules.splice(existingIndex, 1, newSchedule);
    }
  }

  return config.data.schedules;
};

export const updateRuleData = (newRule: Rule | null, existingRule: Rule | null): Rule[] => {
  if (existingRule === null && newRule !== null) {
    // adding rule
    config.data.rules = [...config.data.rules, newRule];
  } else if (existingRule !== null && newRule === null) {
    // removing existing rule
    const existingIndex = config.data.rules.indexOf(existingRule);

    if (existingIndex >= 0) {
      config.data.rules.splice(existingIndex, 1);
    }
  } else if (existingRule !== null && newRule !== null) {
    // updating existing rule
    const existingIndex = config.data.rules.indexOf(existingRule);

    if (existingIndex >= 0) {
      config.data.rules.splice(existingIndex, 1, newRule);
    }
  }

  return config.data.rules;
};

export const isScheduleUnique = (newSchedule: Schedule, existingSchedule: Schedule | null): boolean => {
  if (existingSchedule !== null) {
    const otherSchedules = config.data.schedules.filter((item) => existingSchedule.name !== item.name);
    const matchingSchedules = otherSchedules.filter((item) => newSchedule.name === item.name);
    return matchingSchedules.length === 0;
  }
  const matchingSchedules = config.data.schedules.filter((item) => newSchedule.name === item.name);
  return matchingSchedules.length === 0;
};

export const isRuleUnique = (newRule: Rule, existingRule: Rule | null): boolean => {
  if (existingRule !== null) {
    const otherRules = config.data.rules.filter((item) => existingRule.id !== item.id);
    const matchingRules = otherRules.filter((item) => newRule.name === item.name);
    return matchingRules.length === 0;
  }
  const matchingRules = config.data.rules.filter((item) => newRule.name === item.name);
  return matchingRules.length === 0;
};

export const publishSchedules = async (): Promise<number> => {
  // return values: 0=success, 2=version error, 3=failure, 4=in available activity
  if (Manager.getInstance().store.getState().flex.worker.activity.available === true) {
    Notifications.showNotification(NotificationIds.PUBLISH_FAILED_ACTIVITY);
    return 4;
  }

  const updateResponse = await ScheduleManagerService.update(config);

  if (!updateResponse.success) {
    console.log('Schedule update failed', updateResponse);

    if (updateResponse.buildSid === 'versionError') {
      Notifications.showNotification(NotificationIds.PUBLISH_FAILED_OTHER_UPDATE);
      return 2;
    }

    Notifications.showNotification(NotificationIds.PUBLISH_FAILED);
    return 3;
  }

  // the build will take several seconds. use delay and check in a loop.
  await delay(2000);
  let updateStatus = await ScheduleManagerService.updateStatus(updateResponse.buildSid);

  while (updateStatus.buildStatus !== 'completed') {
    if (updateStatus.buildStatus === 'failed' || updateStatus.buildStatus === 'error') {
      // oh no
      console.log('Schedule update build failed', updateStatus);
      Notifications.showNotification(NotificationIds.PUBLISH_FAILED);
      return 3;
    }

    await delay(2000);
    updateStatus = await ScheduleManagerService.updateStatus(updateResponse.buildSid);
  }

  const publishResponse = await ScheduleManagerService.publish(updateResponse.buildSid);

  if (!publishResponse.success) {
    console.log('Schedule publish failed', publishResponse);
    Notifications.showNotification(NotificationIds.PUBLISH_FAILED);
    return 3;
  }

  Notifications.showNotification(NotificationIds.PUBLISH_SUCCESS);
  return 0;
};
