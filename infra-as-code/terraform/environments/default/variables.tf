variable "TWILIO_ACCOUNT_SID" {
  type        = string
  sensitive   = true
  description = "Twilio Account SID"
}

variable "TWILIO_API_KEY" {
  type        = string
  sensitive   = true
  description = "Twilio API key"
}

variable "TWILIO_API_SECRET" {
  type        = string
  sensitive   = true
  description = "Twilio API secret"
}

variable "SERVERLESS_DOMAIN_CUSTOM_FLEX" {
  type        = string
  sensitive   = true
  description = "serverless domain for flex plugin"
  validation {
    condition     = length(var.SERVERLESS_DOMAIN_CUSTOM_FLEX) > 34 && substr(var.SERVERLESS_DOMAIN_CUSTOM_FLEX, 0, 34) == "custom-flex-extensions-serverless-"
    error_message = "SERVERLESS_DOMAIN_CUSTOM_FLEX expected to start with \"custom-flex-extensions-serverless-\"."
  }
}

variable "SERVERLESS_DOMAIN_SCHEDULE_MANAGER" {
  type        = string
  sensitive   = true
  description = "serverless domain schedule manager for flex plugin"
  validation {
    condition     = length(var.SERVERLESS_DOMAIN_SCHEDULE_MANAGER) > 17 && substr(var.SERVERLESS_DOMAIN_SCHEDULE_MANAGER, 0, 17) == "schedule-manager-"
    error_message = "SERVERLESS_DOMAIN_SCHEDULE_MANAGER expected to start with \"schedule-manager-\"."
  }
}


