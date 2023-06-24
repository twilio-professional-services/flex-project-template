provider "twilio" {
  account_sid = var.TWILIO_ACCOUNT_SID
  username     = var.TWILIO_API_KEY
  password  = var.TWILIO_API_SECRET
}

terraform {
  required_providers {
    twilio = {
      source  = "twilio/twilio"
      version = ">=0.4.0"
    }
  }

  required_version = ">= 1.1.0"

  backend "local" {}
}

module "ivr" {
  source           = "../../modules/ivr"
  workflow_sid_assign_to_anyone = module.routing.workflow_sid_assign_to_anyone
  workflow_sid_chat_transfer = module.routing.workflow_sid_chat_transfer
  workflow_sid_callback = module.routing.workflow_sid_callback
  workflow_sid_internal_call = module.routing.workflow_sid_internal_call
  chat_channel_sid = module.routing.chat_channel_sid
  voice_channel_sid = module.routing.voice_channel_sid
  domain_custom_flex = var.SERVERLESS_DOMAIN_CUSTOM_FLEX
  domain_schedule_manager = var.SERVERLESS_DOMAIN_SCHEDULE_MANAGER

}

module "routing" {
  source           = "../../modules/routing"
}
