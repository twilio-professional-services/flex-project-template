terraform {
  required_providers {
    twilio = {
      source  = "twilio/twilio"
      version = ">=0.4.0"
    }
  }
}

resource "twilio_taskrouter_workspaces_task_queues_v1" "internal_calls" {
  workspace_sid  = var.workspace_sid
  friendly_name  = "Internal Calls"
  target_workers = "1==1"
  max_reserved_workers = 1
  task_order = "FIFO"
}

resource "twilio_taskrouter_workspaces_workflows_v1" "internal_call" {
  workspace_sid = var.workspace_sid
  friendly_name = "Internal Call"
  configuration = templatefile("${path.module}/workflows/internal_call.json", {
    "QUEUE_SID" = twilio_taskrouter_workspaces_task_queues_v1.internal_calls.sid
  })
}