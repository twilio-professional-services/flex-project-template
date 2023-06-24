variable "workflow_sid_assign_to_anyone" {
  type        = string
  description = "SID of the Assign To Anyone workflow"
}

variable "workflow_sid_chat_transfer" {
  type        = string
  description = "SID of the Chat Transfer workflow"
}

variable "workflow_sid_callback" {
  type        = string
  description = "SID of the Callback workflow"
}

variable "workflow_sid_internal_call" {
  type        = string
  description = "SID of the internal_call workflow"
}

variable "chat_channel_sid" {
  type        = string
  description = "SID of the chat task channel"
}

variable "voice_channel_sid" {
  type        = string
  description = "SID of voice task channel"
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
    error_message = "SERVERLESS_DOMAIN_SCHEDULE_MANAGER expected to start with \"custom-flex-extensions-serverless-\"."
  }
}
