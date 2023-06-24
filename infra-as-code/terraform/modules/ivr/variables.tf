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

variable "domain_custom_flex" {
  type        = string
  description = "serverless domain for flex plugin"
  validation {
    condition     = length(var.domain_custom_flex) > 34 && substr(var.domain_custom_flex, 0, 34) == "custom-flex-extensions-serverless-"
    error_message = "domain_custom_flex expected to start with \"custom-flex-extensions-serverless-\"."
  }
}

variable "domain_schedule_manager" {
  type        = string
  description = "serverless domain schedule manager for flex plugin"
  validation {
    condition     = length(var.domain_schedule_manager) > 17 && substr(var.domain_schedule_manager, 0, 17) == "schedule-manager-"
    error_message = "domain_schedule_manager expected to start with \"schedule-manager-\"."
  }
}
