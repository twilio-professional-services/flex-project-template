terraform {
  required_providers {
    twilio = {
      source  = "twilio/twilio"
      version = ">=0.4.0"
    }
  }
}

resource "twilio_taskrouter_workspaces_workflows_v1" "chat_transfer" {
  workspace_sid = var.workspace_sid
  friendly_name = "Chat Transfer"
  configuration = templatefile("${path.module}/workflows/chat_transfer.json", {
    "QUEUE_SID_EVERYONE" = var.everyone_queue_sid
    "QUEUE_SID_TEMPLATE_EXAMPLE_SALES" = var.example_sales_queue_sid
    "QUEUE_SID_TEMPLATE_EXAMPLE_SUPPORT" = var.example_support_queue_sid
  })
}