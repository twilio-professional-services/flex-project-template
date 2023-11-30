provider "twilio" {
  account_sid = var.TWILIO_ACCOUNT_SID
  username    = var.TWILIO_API_KEY
  password    = var.TWILIO_API_SECRET
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