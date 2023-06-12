resource "twilio_taskrouter_workspaces_workflows_v1" "default" {
  workspace_sid = twilio_taskrouter_workspaces_v1.flex.sid
  friendly_name = "Assign to Anyone"
  configuration = templatefile("../../taskrouter/workflow.json", local.params)
}

locals{
  params = {
    "QUEUE_SID" = twilio_taskrouter_workspaces_task_queues_v1.everyone.sid
  }
}