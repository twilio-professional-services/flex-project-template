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
  ac.Other = { teamName: 'Other', totalAgentCount: 0, activities: { Idle: 0, Busy: 0 } };
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
    const teamName: string = wk.worker?.attributes?.team_name || 'Other';
    let tm = teamName;
    if (!teams.includes(teamName)) tm = 'Other';
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
    // Total Count for All Workers/Teams
    const allCount = ac.All.activities[workerStatus] ? ac.All.activities[workerStatus] : 0;
    ac.All.activities[workerStatus] = allCount + 1;
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
  const initTasks = { voice_inbound: 0, voice_outbound: 0, sms: 0, chat: 0, video: 0 };
  taskCounts.All = { teamName: 'All', totalTaskCount: 0, tasks: { ...initTasks } };
  taskCounts.Other = { teamName: 'Other', totalTaskCount: 0, tasks: { ...initTasks } };

  // Init task counts
  teams.forEach((team) => {
    taskCounts[team] = { teamName: team, totalTaskCount: 0, tasks: { ...initTasks } };
  });
  workers.forEach((wk) => {
    const teamName: string = wk.worker?.attributes?.team_name ? wk.worker.attributes.team_name : 'Other';
    let tm = teamName;
    if (!teams.includes(teamName)) tm = 'Other';
    let channel = '';
    const tasks = wk?.tasks || [];
    tasks.forEach((task) => {
      if (task.taskChannelUniqueName === TASK_CHANNEL_VOICE) {
        channel = `voice_${task.attributes?.direction || 'inbound'}`;
      } else {
        channel = task.taskChannelUniqueName;
      }
      const count = taskCounts[tm].tasks[channel] ? taskCounts[tm].tasks[channel] : 0;
      taskCounts[tm].tasks[channel] = count + 1;
      const total = taskCounts[tm].totalTaskCount ? taskCounts[tm].totalTaskCount : 0;
      taskCounts[tm].totalTaskCount = total + 1;

      const allCount = taskCounts.All.tasks[channel] ? taskCounts.All.tasks[channel] : 0;
      taskCounts.All.tasks[channel] = allCount + 1;
      const allTotal = taskCounts.All.totalTaskCount ? taskCounts.All.totalTaskCount : 0;
      taskCounts.All.totalTaskCount = allTotal + 1;
    });
  });
  return taskCounts;
}
