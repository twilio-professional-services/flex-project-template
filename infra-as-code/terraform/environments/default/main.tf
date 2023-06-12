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
  workflow_sid = module.routing.workflow_sid
  chat_channel_sid = module.routing.chat_channel_sid
  voice_channel_sid = module.routing.voice_channel_sid
}

module "routing" {
  source           = "../../modules/routing"
}