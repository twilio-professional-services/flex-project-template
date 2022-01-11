export default () => ({
    resource: ["taskrouter", { "workspaces" : process.env.FLEX_WORKSPACE_SID }, "activities"],
    attributes: {
        friendlyName: 'Break'
    }
});