resource "twilio_taskrouter_task_queue" "everyone" {
  provider             = twilio2
  workspace_sid        = twilio_taskrouter_workspaces_v1.flex.sid
  friendly_name        = "Everyone"
  target_workers       = "1==1"
  max_reserved_workers = 1
  task_order           = "FIFO"
}

resource "twilio_taskrouter_task_queue" "template_example_sales" {
  provider             = twilio2
  workspace_sid        = twilio_taskrouter_workspaces_v1.flex.sid
  friendly_name        = "Template Example Sales"
  target_workers       = "routing.skills HAS 'template_example_sales'"
  max_reserved_workers = 1
  task_order           = "FIFO"
}

resource "twilio_taskrouter_task_queue" "template_example_support" {
  provider             = twilio2
  workspace_sid        = twilio_taskrouter_workspaces_v1.flex.sid
  friendly_name        = "Template Example Support"
  target_workers       = "routing.skills HAS 'template_example_support'"
  max_reserved_workers = 1
  task_order           = "FIFO"
}

resource "twilio_taskrouter_task_queue" "internal_calls" {
  provider             = twilio2
  workspace_sid        = twilio_taskrouter_workspaces_v1.flex.sid
  friendly_name        = "Internal Calls"
  target_workers       = "1==1"
  max_reserved_workers = 1
  task_order           = "FIFO"
}
