import { WorkerQueue } from '@twilio/flex-ui/src/state/QueuesState';
import { WorkerQueueChannel } from '@twilio/flex-ui/src/state/QueuesState/QueuesStateTypes';

import { SLMetrics, TaskCounts } from '../types';

class QueueDataUtil {
  getTasksByGroup = (queues: WorkerQueue[] = [], group = '') => {
    let activeTasks = 0;
    let waitingTasks = 0;
    if (queues && queues.length > 0) {
      queues.forEach((q) => {
        const qParts = q.friendly_name.toLowerCase().split('.');
        if (group === qParts[0] && q.tasks_by_status) {
          activeTasks += q.tasks_by_status.assigned + q.tasks_by_status.wrapping;
          waitingTasks += q.tasks_by_status.pending + q.tasks_by_status.reserved;
        }
      });
    }
    return { activeTasks, waitingTasks };
  };

  getTasksByQueueGroups = (queues: WorkerQueue[] = [], queueGroups = []) => {
    const taskCounts: TaskCounts = {};
    queueGroups.forEach((group) => {
      taskCounts[group] = { activeTasks: 0, assignedTasks: 0, wrappingTasks: 0, waitingTasks: 0 };
    });
    if (queues && queues.length > 0) {
      queues.forEach((q) => {
        queueGroups.forEach((group) => {
          if (q.friendly_name.toLowerCase().includes(group) && q.tasks_by_status) {
            taskCounts[group].activeTasks += q.tasks_by_status.assigned + q.tasks_by_status.wrapping;
            taskCounts[group].waitingTasks += q.tasks_by_status.pending + q.tasks_by_status.reserved;
          }
        });
      });
    }
    return taskCounts;
  };

  getTaskCountsByChannel = (queues: WorkerQueue[] = [], channelList: string[]) => {
    const initCounts = { activeTasks: 0, assignedTasks: 0, wrappingTasks: 0, waitingTasks: 0 };
    const taskCounts: TaskCounts = {};
    if (queues.length === 0) return taskCounts;
    queues.forEach((q) => {
      if (q.channels) {
        q.channels.forEach((ch: WorkerQueueChannel) => {
          const wqChannelName = ch.unique_name ? ch.unique_name : 'unknown';
          if (channelList.includes(wqChannelName) && ch.tasks_now) {
            if (!taskCounts[wqChannelName]) taskCounts[wqChannelName] = { ...initCounts };
            const assignedTasks = ch?.tasks_now?.assigned_tasks;
            const wrappingTasks = ch?.tasks_now?.wrapping_tasks;
            taskCounts[wqChannelName].assignedTasks += assignedTasks;
            taskCounts[wqChannelName].wrappingTasks += wrappingTasks;
            // active = assigned + wrapping
            taskCounts[wqChannelName].activeTasks += assignedTasks + wrappingTasks;
            // waiting = pending + reserved
            taskCounts[wqChannelName].waitingTasks += ch?.tasks_now?.pending_tasks;
            taskCounts[wqChannelName].waitingTasks += ch?.tasks_now?.reserved_tasks;
          }
        });
      }
    });
    return taskCounts;
  };

  getSLTodayByChannel = (queues: WorkerQueue[] = [], channelList: string[]) => {
    const initSLMetrics = { handledTasks: 0, handledTasksWithinSL: 0, serviceLevelPct: 0 };
    const slMetrics: SLMetrics = {};
    if (queues.length === 0) return slMetrics;
    queues.forEach((q) => {
      if (q.channels) {
        q.channels.forEach((ch: WorkerQueueChannel) => {
          const wqChannelName = ch.unique_name ? ch.unique_name : 'unknown';
          if (channelList.includes(wqChannelName) && ch.sla_today) {
            if (!slMetrics[wqChannelName]) slMetrics[wqChannelName] = { ...initSLMetrics };
            slMetrics[wqChannelName].handledTasks += ch?.sla_today?.handled_tasks_count;
            slMetrics[wqChannelName].handledTasksWithinSL += ch?.sla_today?.handled_tasks_within_sl_threshold_count;
          }
        });
      }
    });
    channelList.forEach((ch) => {
      if (slMetrics[ch]?.handledTasks > 0)
        slMetrics[ch].serviceLevelPct = Math.floor(
          (slMetrics[ch].handledTasksWithinSL / slMetrics[ch].handledTasks) * 100,
        );
    });
    return slMetrics;
  };

  getSLTodayByGroup = (queues: WorkerQueue[] = [], group = '') => {
    let handledTasks = 0;
    let handledTasksWithinSL = 0;
    let serviceLevelPct = 0;
    if (queues && queues.length > 0) {
      queues.forEach((q) => {
        if (q.friendly_name.toLowerCase().includes(group) && q.sla_today) {
          handledTasks += q?.sla_today?.handled_tasks_count;
          handledTasksWithinSL += q?.sla_today?.handled_tasks_within_sl_threshold_count;
        }
      });
    }
    if (handledTasks > 0) {
      serviceLevelPct = Math.floor((handledTasksWithinSL / handledTasks) * 100);
    }
    return { handledTasks, handledTasksWithinSL, serviceLevelPct };
  };

  getSLTodayByQueueGroups = (queues: WorkerQueue[] = [], queueGroups: string[] = []) => {
    const slMetrics: SLMetrics = {};
    queueGroups.forEach((group) => {
      slMetrics[group] = { handledTasks: 0, handledTasksWithinSL: 0, serviceLevelPct: 0 };
    });
    if (queues.length === 0) return slMetrics;
    queues.forEach((q) => {
      queueGroups.forEach((group) => {
        if (q.friendly_name.toLowerCase().includes(group) && q.sla_today) {
          slMetrics[group].handledTasks += q?.sla_today?.handled_tasks_count;
          slMetrics[group].handledTasksWithinSL += q?.sla_today?.handled_tasks_within_sl_threshold_count;
        }
      });
    });
    queueGroups.forEach((group) => {
      if (slMetrics[group].handledTasks > 0)
        slMetrics[group].serviceLevelPct = Math.floor(
          (slMetrics[group].handledTasksWithinSL / slMetrics[group].handledTasks) * 100,
        );
    });
    return slMetrics;
  };
}

const queueDataUtil = new QueueDataUtil();

export default queueDataUtil;
