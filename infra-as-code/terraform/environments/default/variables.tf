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

variable "serverless_domain_custom_flex" {
  type        = string
  sensitive   = true
  description = "serverless domain for flex plugin"
}

variable "serverless_domain_schedule_manager" {
  type        = string
  sensitive   = true
  description = "serverless domain schedule manager for flex plugin"
}
