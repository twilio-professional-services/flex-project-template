resource "twilio_taskrouter_workspaces_workflows_v1" "assign_to_anyone" {
  workspace_sid = twilio_taskrouter_workspaces_v1.flex.sid
  friendly_name = "Assign to Anyone"
  configuration = templatefile("../../taskrouter/assign_to_anyone.json", local.params)
}

resource "twilio_taskrouter_workspaces_workflows_v1" "chat_transfer" {
  workspace_sid = twilio_taskrouter_workspaces_v1.flex.sid
  friendly_name = "Chat Transfer"
  configuration = templatefile("../../taskrouter/chat_transfer.json", local.params)
}

locals{
  params = {
    "QUEUE_SID_EVERYONE" = twilio_taskrouter_workspaces_task_queues_v1.everyone.sid
    "QUEUE_SID_SALES" = twilio_taskrouter_workspaces_task_queues_v1.sales.sid
    "QUEUE_SID_SUPPORT" = twilio_taskrouter_workspaces_task_queues_v1.support.sid
  }
}
