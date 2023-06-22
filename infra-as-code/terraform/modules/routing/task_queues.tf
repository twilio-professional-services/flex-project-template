resource "twilio_taskrouter_workspaces_task_queues_v1" "everyone" {
  workspace_sid  = twilio_taskrouter_workspaces_v1.flex.sid
  friendly_name  = "Everyone"
}