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
}

variable "SERVERLESS_DOMAIN_SCHEDULE_MANAGER" {
  type        = string
  sensitive   = true
  description = "serverless domain schedule manager for flex plugin"
}
