variable "workflow_sid_assign_to_anyone" {
  type        = string
  description = "SID of the Assign To Anyone workflow"
  validation {
    condition     = length(var.workflow_sid_assign_to_anyone) > 2 && substr(var.workflow_sid_assign_to_anyone, 0, 2) == "WW"
    error_message = "workflow_sid_assign_to_anyone expected to start with \"WW\"."
  }
}

variable "workflow_sid_chat_transfer" {
  type        = string
  description = "SID of the Chat Transfer workflow"
  validation {
    condition     = length(var.workflow_sid_chat_transfer) > 2 && substr(var.workflow_sid_chat_transfer, 0, 2) == "WW"
    error_message = "workflow_sid_chat_transfer expected to start with \"WW\"."
  }
}

variable "workflow_sid_callback" {
  type        = string
  description = "SID of the Callback workflow"
  validation {
    condition     = length(var.workflow_sid_callback) > 2 && substr(var.workflow_sid_callback, 0, 2) == "WW"
    error_message = "workflow_sid_callback expected to start with \"WW\"."
  }
}

variable "workflow_sid_internal_call" {
  type        = string
  description = "SID of the internal_call workflow"
  validation {
    condition     = length(var.workflow_sid_internal_call) > 2 && substr(var.workflow_sid_internal_call, 0, 2) == "WW"
    error_message = "workflow_sid_internal_call expected to start with \"WW\"."
  }
}

variable "chat_channel_sid" {
  type        = string
  description = "SID of the chat task channel"
  validation {
    condition     = length(var.chat_channel_sid) > 2 && substr(var.chat_channel_sid, 0, 2) == "TC"
    error_message = "chat_channel_sid expected to start with \"TC\"."
  }
}

variable "voice_channel_sid" {
  type        = string
  description = "SID of voice task channel"
  validation {
    condition     = length(var.voice_channel_sid) > 2 && substr(var.voice_channel_sid, 0, 2) == "TC"
    error_message = "voice_channel_sid expected to start with \"TC\"."
  }
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
