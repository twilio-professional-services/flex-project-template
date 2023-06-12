export default () => ({
    resource: ["taskrouter", { "workspaces" : process.env.FLEX_WORKSPACE_SID }, "taskChannels"],
    attributes: {
        friendlyName: 'Workflow Query',
        uniqueName: 'workflow-query'
    }
});


