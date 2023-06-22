export default () => ({
    resource: ["taskrouter", "workspaces"],
    attributes: {
        sid: process.env.FLEX_WORKSPACE_SID
    }
})