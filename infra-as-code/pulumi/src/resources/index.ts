import { initDescription } from './utils';

const { workspaces, workflows } = initDescription({
    workspaces: {
        path: "./taskrouter/workspaces",
        sufix: "workspace"
    },
    queues: {
        path: "./taskrouter/task-queues",
        sufix: "queue"
    },
    workflows: {
        path: "./taskrouter/workflows",
        sufix: "workflow"
    },
    channels: {
        path: "./taskrouter/task-channels",
        sufix: "channel"
    },
    activities: {
        path: "./taskrouter/activities",
        sufix: "activity"
    }
});


export let output =  {
    flexWorkspaceSid: workspaces.flex.sid,
    workflowSid: workflows.ivr_handoff.sid
}
