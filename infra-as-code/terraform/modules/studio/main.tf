terraform {
  required_providers {
    twilio = {
      source  = "twilio/twilio"
      version = ">=0.4.0"
    }
  }
}

# FEATURE: remove-all

resource "twilio_studio_flows_v2" "chat" {
  friendly_name  = "Chat Flow"
  status         = "published"
  definition = templatefile("../../studio/chat-flow.json", local.params)
}

resource "twilio_studio_flows_v2" "messaging" {
  friendly_name  = "Messaging Flow"
  status         = "published"
  definition = templatefile("../../studio/messaging-flow.json", local.params)
}

# FEATURE: callback-and-voicemail
# FEATURE: schedule-manager
resource "twilio_studio_flows_v2" "voice" {
  friendly_name  = "Voice IVR"
  status         = "published"
  definition = templatefile("../../studio/voice-flow.json", local.params)
}
# END FEATURE: schedule-manager
# END FEATURE: callback-and-voicemail
# END FEATURE: remove-all

locals{
  params = {
    
# FEATURE: remove-all
    "WORKFLOW_SID_ASSIGN_TO_ANYONE" = var.workflow_sid_assign_to_anyone
# END FEATURE: remove-all

    "SERVERLESS_DOMAIN" = var.serverless_domain
    "SERVERLESS_SID" = var.serverless_sid
    "SERVERLESS_ENV_SID" = var.serverless_env_sid
    
# FEATURE: schedule-manager
    "SCHEDULE_MANAGER_DOMAIN" = var.schedule_manager_domain
    "SCHEDULE_MANAGER_SID" = var.schedule_manager_sid
    "SCHEDULE_MANAGER_ENV_SID" = var.schedule_manager_env_sid
    "FUNCTION_CHECK_SCHEDULE_SID" = var.function_check_schedule_sid
# END FEATURE: schedule-manager

# FEATURE: callback-and-voicemail
    "FUNCTION_CREATE_CALLBACK" = var.function_create_callback
# END FEATURE: callback-and-voicemail

    "CHAT_CHANNEL_SID" = var.chat_channel_sid
    "VOICE_CHANNEL_SID" = var.voice_channel_sid
  }
}
