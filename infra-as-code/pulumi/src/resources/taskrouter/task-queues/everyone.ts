
export default () => ({
    resource: ["taskrouter", { "workspaces": process.env.FLEX_WORKSPACE_SID }, "taskQueues"],
    attributes: {
        targetWorkers: `1==1`,
        friendlyName: `Everyone`
    }
});
