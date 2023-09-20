import { Manager } from '@twilio/flex-ui';
import { SupervisorWorkerState } from '@twilio/flex-ui/src/state/State.definition';

import { ActivityCounts, TaskCounts } from '../types';

const _manager = Manager.getInstance();
const workerActivities = _manager.store.getState().flex?.worker?.activities || new Map();

const STATUS_AVAILABLE = 'Available';
const TASK_CHANNEL_VOICE = 'voice';

export function getAgentStatusCounts(workers: SupervisorWorkerState[] = [], teams: string[] = []) {
  const ac: ActivityCounts = {};
  ac.All = { teamName: 'All', totalAgentCount: 0, activities: { Idle: 0, Busy: 0 } };
  // Init activity counts
  teams.forEach((team) => {
    ac[team] = { teamName: team, totalAgentCount: 0, activities: { Idle: 0, Busy: 0 } };
    workerActivities.forEach((value) => {
      ac[team].activities[value.name] = 0;
      ac.All.activities[value.name] = 0;
    });
  });

  // Aggregate Activity/Status by Team
  workers.forEach((wk) => {
    const workerStatus = wk.worker.activityName;
    const tasks = wk?.tasks || [];
    const tm: string = wk.worker?.attributes?.team_name || 'Other';
    if (teams.includes(tm)) {
      const count = ac[tm].activities[workerStatus] ? ac[tm].activities[workerStatus] : 0;
      ac[tm].activities[workerStatus] = count + 1;
      ac[tm].totalAgentCount += 1;
      if (workerStatus === STATUS_AVAILABLE) {
        if (tasks.length > 0) {
          const count = ac[tm].activities.Busy ? ac[tm].activities.Busy : 0;
          ac[tm].activities.Busy = count + 1;
        } else {
          const count = ac[tm].activities.Idle ? ac[tm].activities.Idle : 0;
          ac[tm].activities.Idle = count + 1;
        }
      }
    }
    // Total Count for All Workers/Teams
    const count = ac.All.activities[workerStatus] ? ac.All.activities[workerStatus] : 0;
    ac.All.activities[workerStatus] = count + 1;
    if (workerStatus === STATUS_AVAILABLE) {
      if (tasks.length > 0) {
        const count = ac.All.activities.Busy ? ac.All.activities.Busy : 0;
        ac.All.activities.Busy = count + 1;
      } else {
        const count = ac.All.activities.Idle ? ac.All.activities.Idle : 0;
        ac.All.activities.Idle = count + 1;
      }
    }
    ac.All.totalAgentCount += 1;
  });

  return ac;
}

export function getTasksByTeamCounts(workers: SupervisorWorkerState[] = [], teams: string[] = []) {
  const taskCounts: TaskCounts = {};
  taskCounts.All = { teamName: 'All', tasks: { voice_inbound: 0, voice_outbound: 0, sms: 0, chat: 0 } };
  // Init task counts
  teams.forEach((team) => {
    taskCounts[team] = { teamName: team, tasks: { voice_inbound: 0, voice_outbound: 0, sms: 0, chat: 0 } };
  });
  workers.forEach((wk) => {
    const tm: string = wk.worker?.attributes?.team_name ? wk.worker.attributes.team_name : 'Other';
    let channel = '';
    const tasks = wk?.tasks || [];
    tasks.forEach((task) => {
      if (task.taskChannelUniqueName === TASK_CHANNEL_VOICE) {
        channel = `voice_${task.attributes?.direction || 'inbound'}`;
      } else {
        channel = task.taskChannelUniqueName;
      }
      if (teams.includes(tm)) {
        const count = taskCounts[tm].tasks[channel] ? taskCounts[tm].tasks[channel] : 0;
        taskCounts[tm].tasks[channel] = count + 1;
      }
      const count = taskCounts.All.tasks[channel] ? taskCounts.All.tasks[channel] : 0;
      taskCounts.All.tasks[channel] = count + 1;
    });
  });
  return taskCounts;
}
