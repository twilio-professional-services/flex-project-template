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
  event_callback_url = "${SERVERLESS_DOMAIN}/features/tr-events/event-handler"
  events_filter = "task-queue.created,task-queue.expression.updated,worker.attributes.update,worker.created"
}
