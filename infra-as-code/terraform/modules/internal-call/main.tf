terraform {
  required_providers {
    twilio = {
      source  = "twilio/twilio"
      version = ">=0.4.0"
    }
  }
}

resource "twilio_taskrouter_workspaces_task_queues_v1" "template_example_internal_calls" {
  workspace_sid  = var.workspace_sid
  friendly_name  = "Template Example Internal Calls"
  target_workers = "1==1"
  max_reserved_workers = 1
  task_order = "FIFO"
}

resource "twilio_taskrouter_workspaces_workflows_v1" "template_example_internal_calls" {
  workspace_sid = var.workspace_sid
  friendly_name = "Template Example Internal Calls"
  configuration = templatefile("${path.module}/workflows/template_example_internal_calls.json", {
    "QUEUE_SID" = twilio_taskrouter_workspaces_task_queues_v1.template_example_internal_calls.sid
  })
}