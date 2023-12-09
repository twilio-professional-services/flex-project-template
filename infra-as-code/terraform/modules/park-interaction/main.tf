terraform {
  required_providers {
    twilio = {
      source  = "twilio/twilio"
      version = ">=0.4.0"
    }
  }
}

resource "twilio_taskrouter_workspaces_task_channels_v1" "chat" {
  workspace_sid	= var.workspace_sid
  friendly_name	= "Chat"
  unique_name = "chat"
}

resource "twilio_taskrouter_workspaces_workflows_v1" "template_example_park_resume" {
  workspace_sid = var.workspace_sid
  friendly_name = "Template Example Park/Resume"
  configuration = templatefile("${path.module}/workflows/template_example_park_resume.json", {
    "QUEUE_SID_EVERYONE" = var.everyone_queue_sid
    "QUEUE_SID_TEMPLATE_EXAMPLE_SALES" = var.example_sales_queue_sid
    "QUEUE_SID_TEMPLATE_EXAMPLE_SUPPORT" = var.example_support_queue_sid
  })
}

resource "twilio_studio_flows_v2" "template_example_messaging_with_parking_flow" {
  friendly_name  = "Template Example Messaging with Parking Flow"
  status         = "published"
  definition     = templatefile("${path.module}/flows/template_example_messaging_with_parking_flow.json", {
    "CHAT_CHANNEL_SID" = twilio_taskrouter_workspaces_task_channels_v1.chat.sid
    "WORKFLOW_SID" = twilio_taskrouter_workspaces_workflows_v1.template_example_park_resume.sid
  })
}