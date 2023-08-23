terraform {
  required_providers {
    twilio = {
      source  = "twilio/twilio"
      version = ">=0.4.0"
    }
  }
}

resource "twilio_taskrouter_workspaces_v1" "flex" {
  friendly_name = "Flex Task Assignment"
  event_callback_url = "https://${var.serverless_domain}/features/tr-events/event-handler"
  events_filter = "task-queue.created,task-queue.expression.updated,worker.attributes.update,worker.created"
}


locals{
  params = {
    "QUEUE_SID_EVERYONE" = twilio_taskrouter_workspaces_task_queues_v1.everyone.sid
    "QUEUE_SID_TEMPLATE_EXAMPLE_SALES" = twilio_taskrouter_workspaces_task_queues_v1.template_example_sales.sid
    "QUEUE_SID_TEMPLATE_EXAMPLE_SUPPORT" = twilio_taskrouter_workspaces_task_queues_v1.template_example_support.sid
    "QUEUE_SID_INTERNAL_CALLS" = twilio_taskrouter_workspaces_task_queues_v1.internal_calls.sid
    "SERVERLESS_DOMAIN" = var.serverless_domain
  }
}
