terraform {
  required_providers {
    twilio = {
      source  = "twilio/twilio"
      version = ">=0.4.0"
    }
  }
}

resource "twilio_taskrouter_workspaces_workflows_v1" "template_example_chat_transfer" {
  workspace_sid = var.workspace_sid
  friendly_name = "Template Example Chat Transfer"
  configuration = templatefile("${path.module}/workflows/template_example_chat_transfer.json", {
    "QUEUE_SID_EVERYONE" = var.everyone_queue_sid
    "QUEUE_SID_TEMPLATE_EXAMPLE_SALES" = var.example_sales_queue_sid
    "QUEUE_SID_TEMPLATE_EXAMPLE_SUPPORT" = var.example_support_queue_sid
  })
}