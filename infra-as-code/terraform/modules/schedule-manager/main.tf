terraform {
  required_providers {
    twilio = {
      source  = "twilio/twilio"
      version = ">=0.4.0"
    }
  }
}

resource "twilio_studio_flows_v2" "template_example_schedule_flow" {
  friendly_name  = "Template Example Schedule Flow"
  status         = "published"
  definition     = templatefile("${path.module}/flows/template_example_schedule_flow.json", {
    "VOICE_CHANNEL_SID" = var.voice_channel_sid
    "WORKFLOW_SID" = var.workflow_sid
    "SCHEDULE_MANAGER_DOMAIN" = var.schedule_manager_domain
    "SCHEDULE_MANAGER_SID" = var.schedule_manager_sid
    "SCHEDULE_MANAGER_ENV_SID" = var.schedule_manager_env_sid
    "FUNCTION_CHECK_SCHEDULE_SID" = var.function_check_schedule_sid
  })
}