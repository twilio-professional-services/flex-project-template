resource "twilio_taskrouter_workspaces_task_queues_v1" "everyone" {
  workspace_sid  = twilio_taskrouter_workspaces_v1.flex.sid
  friendly_name  = "Everyone"
  target_workers = "1==1"
  max_reserved_workers = 1
  task_order = "FIFO"
}

resource "twilio_taskrouter_workspaces_task_queues_v1" "sales" {
  workspace_sid  = twilio_taskrouter_workspaces_v1.flex.sid
  friendly_name  = "Sales"
  target_workers = "routing.skills HAS 'sales'"
  max_reserved_workers = 2
  task_order = "FIFO"
}

resource "twilio_taskrouter_workspaces_task_queues_v1" "support" {
  workspace_sid  = twilio_taskrouter_workspaces_v1.flex.sid
  friendly_name  = "Support"
  target_workers = "routing.skills HAS 'support'"
  max_reserved_workers = 2
  task_order = "FIFO"
}
