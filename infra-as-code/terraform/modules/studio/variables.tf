# FEATURE: remove-all
variable "workflow_sid_assign_to_anyone" {
  type        = string
  description = "SID of the Assign To Anyone workflow"
  validation {
    condition     = length(var.workflow_sid_assign_to_anyone) > 2 && substr(var.workflow_sid_assign_to_anyone, 0, 2) == "WW"
    error_message = "workflow_sid_assign_to_anyone expected to start with \"WW\"."
  }
}
# END FEATURE: remove-all

# FEATURE: conversation-transfer
variable "workflow_sid_chat_transfer" {
  type        = string
  description = "SID of the Chat Transfer workflow"
  validation {
    condition     = length(var.workflow_sid_chat_transfer) > 2 && substr(var.workflow_sid_chat_transfer, 0, 2) == "WW"
    error_message = "workflow_sid_chat_transfer expected to start with \"WW\"."
  }
}
# END FEATURE: conversation-transfer

# FEATURE: callback-and-voicemail
variable "workflow_sid_callback" {
  type        = string
  description = "SID of the Callback workflow"
  validation {
    condition     = length(var.workflow_sid_callback) > 2 && substr(var.workflow_sid_callback, 0, 2) == "WW"
    error_message = "workflow_sid_callback expected to start with \"WW\"."
  }
}
# END FEATURE: callback-and-voicemail

# FEATURE: internal-call
variable "workflow_sid_internal_call" {
  type        = string
  description = "SID of the internal_call workflow"
  validation {
    condition     = length(var.workflow_sid_internal_call) > 2 && substr(var.workflow_sid_internal_call, 0, 2) == "WW"
    error_message = "workflow_sid_internal_call expected to start with \"WW\"."
  }
}
# END FEATURE: internal-call

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

variable "serverless_domain" {
  type        = string
  description = "serverless domain for flex plugin"
  validation {
    condition     = length(var.serverless_domain) > 34 && substr(var.serverless_domain, 0, 34) == "custom-flex-extensions-serverless-"
    error_message = "serverless_domain expected to start with \"custom-flex-extensions-serverless-\"."
  }
}

variable "serverless_sid" {
  type        = string
  description = "serverless sid"
  validation {
    condition     = length(var.serverless_sid) > 2 && substr(var.serverless_sid, 0, 2) == "ZS"
    error_message = "serverless_sid expected to start with \"ZS\"."
  }
}

variable "serverless_env_sid" {
  type        = string
  description = "serverless env sid"
  validation {
    condition     = length(var.serverless_env_sid) > 2 && substr(var.serverless_env_sid, 0, 2) == "ZE"
    error_message = "serverless_env_sid expected to start with \"ZE\"."
  }
}

# FEATURE: schedule-manager
variable "schedule_manager_domain" {
  type        = string
  description = "serverless domain schedule manager for flex plugin"
  validation {
    condition     = length(var.schedule_manager_domain) > 17 && substr(var.schedule_manager_domain, 0, 17) == "schedule-manager-"
    error_message = "schedule_manager_domain expected to start with \"schedule-manager-\"."
  }
}

variable "schedule_manager_sid" {
  type        = string
  description = "serverless sid"
  validation {
    condition     = length(var.schedule_manager_sid) > 2 && substr(var.schedule_manager_sid, 0, 2) == "ZS"
    error_message = "schedule_manager_sid expected to start with \"ZS\"."
  }
}

variable "schedule_manager_env_sid" {
  type        = string
  description = "schedule manager env sid"
  validation {
    condition     = length(var.schedule_manager_env_sid) > 2 && substr(var.schedule_manager_env_sid, 0, 2) == "ZE"
    error_message = "schedule_manager_env_sid expected to start with \"ZE\"."
  }
}

variable "function_check_schedule_sid" {
  type        = string
  description = "get customer by phone function sid"
  validation {
    condition     = length(var.function_check_schedule_sid) > 2 && substr(var.function_check_schedule_sid, 0, 2) == "ZH"
    error_message = "function_check_schedule_sid expected to start with \"ZH\"."
  }
}

# END FEATURE: schedule-manager

# FEATURE: callback-and-voicemail

variable "function_create_callback" {
  type        = string
  description = "create callback function sid"
  validation {
    condition     = length(var.function_create_callback) > 2 && substr(var.function_create_callback, 0, 2) == "ZH"
    error_message = "function_create_callback expected to start with \"ZH\"."
  }
}

# END FEATURE: callback-and-voicemail

