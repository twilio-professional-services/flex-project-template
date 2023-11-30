terraform {
  required_providers {
    twilio = {
      source  = "twilio/twilio"
      version = ">=0.4.0"
    }
  }
}

resource "twilio_taskrouter_workspaces_workflows_v1" "template_example_callback" {
  workspace_sid = var.workspace_sid
  friendly_name = "Template Example Callback"
  configuration = templatefile("${path.module}/workflows/template_example_callback.json", {
    "QUEUE_SID" = var.queue_sid
  })
}

resource "twilio_studio_flows_v2" "template_example_callback_flow" {
  friendly_name  = "Template Example Callback Flow"
  status         = "published"
  definition     = templatefile("${path.module}/flows/template_example_callback_flow.json", {
    "SERVERLESS_DOMAIN" = var.serverless_domain
    "SERVERLESS_SID" = var.serverless_sid
    "SERVERLESS_ENV_SID" = var.serverless_env_sid
    "FUNCTION_CREATE_CALLBACK" = var.function_create_callback
    "VOICE_CHANNEL_SID" = var.voice_channel_sid
    "WORKFLOW_SID" = var.workflow_sid
  })
}