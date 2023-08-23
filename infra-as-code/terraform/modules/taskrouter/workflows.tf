resource "twilio_taskrouter_workspaces_workflows_v1" "assign_to_anyone" {
  workspace_sid = twilio_taskrouter_workspaces_v1.flex.sid
  friendly_name = "Assign to Anyone"
  configuration = templatefile("../../taskrouter/assign_to_anyone.json", local.params)
}

resource "twilio_taskrouter_workspaces_workflows_v1" "callback" {
  workspace_sid = twilio_taskrouter_workspaces_v1.flex.sid
  friendly_name = "Callback"
  configuration = templatefile("../../taskrouter/callback.json", local.params)
}

resource "twilio_taskrouter_workspaces_workflows_v1" "chat_transfer" {
  workspace_sid = twilio_taskrouter_workspaces_v1.flex.sid
  friendly_name = "Chat Transfer"
  configuration = templatefile("../../taskrouter/chat_transfer.json", local.params)
}

resource "twilio_taskrouter_workspaces_workflows_v1" "internal_call" {
  workspace_sid = twilio_taskrouter_workspaces_v1.flex.sid
  friendly_name = "Internal Call"
  configuration = templatefile("../../taskrouter/internal_call.json", local.params)
}


