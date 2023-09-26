terraform {
  required_providers {
    twilio = {
      source  = "twilio/twilio"
      version = ">=0.4.0"
    }
    twilio2 = {
      source  = "RJPearson94/twilio"
      version = "0.23.0"
    }
  }
}

resource "twilio_taskrouter_workspaces_v1" "flex" {
  friendly_name = "Flex Task Assignment"
}