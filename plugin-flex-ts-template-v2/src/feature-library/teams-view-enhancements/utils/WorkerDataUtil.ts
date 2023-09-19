import { Manager } from '@twilio/flex-ui';
import { SupervisorWorkerState } from '@twilio/flex-ui/src/state/State.definition';

import { ActivityCounts, TaskCounts } from '../types';

const _manager = Manager.getInstance();
const workerActivities = _manager.store.getState().flex?.worker?.activities || new Map();

const STATUS_AVAILABLE = 'Available';
const STATUS_BUSY = 'Busy';
const STATUS_IDLE = 'Idle';
const TASK_CHANNEL_VOICE = 'voice';

export function getAgentStatusCounts(workers: SupervisorWorkerState[] = [], teams: string[] = []) {
  // If task count == 0, Status = 'Idle'
  // If task count > 0, Status = 'Busy'
  const activityCounts: ActivityCounts = {};
  activityCounts.All = { teamName: 'All', totalAgentCount: 0, activities: { Idle: 0, Busy: 0 } };
  // Init activity counts
  teams.forEach((team) => {
    activityCounts[team] = { teamName: team, totalAgentCount: 0, activities: { Idle: 0, Busy: 0 } };
    workerActivities.forEach((value) => {
      activityCounts[team].activities[value.name] = 0;
      activityCounts.All.activities[value.name] = 0;
    });
  });

  // Aggregate Activity/Status by Team
  workers.forEach((wk) => {
    let workerStatus = wk.worker.activityName;
    const tm: string = wk.worker?.attributes?.team_name || 'Other';
    if (workerStatus === STATUS_AVAILABLE) {
      // Determine Busy status (1+ tasks) vs. Idle (0 tasks)
      const tasks = wk?.tasks || [];
      workerStatus = STATUS_IDLE;
      if (tasks.length > 0) workerStatus = STATUS_BUSY;
    }
    if (teams.includes(tm)) {
      const count = activityCounts[tm].activities[workerStatus] ? activityCounts[tm].activities[workerStatus] : 0;
      activityCounts[tm].activities[workerStatus] = count + 1;
      activityCounts[tm].totalAgentCount += 1;
    }
    // Total Count for All Workers/Teams
    const count = activityCounts.All.activities[workerStatus] ? activityCounts.All.activities[workerStatus] : 0;
    activityCounts.All.activities[workerStatus] = count + 1;
    activityCounts.All.totalAgentCount += 1;
  });

  return activityCounts;
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
