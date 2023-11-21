variable "voice_channel_sid" {
  type        = string
  description = "SID of voice task channel"
  validation {
    condition     = length(var.voice_channel_sid) > 2 && substr(var.voice_channel_sid, 0, 2) == "TC"
    error_message = "voice_channel_sid expected to start with \"TC\"."
  }
}

variable "workflow_sid" {
  type        = string
  description = "SID of workflow"
  validation {
    condition     = length(var.workflow_sid) > 2 && substr(var.workflow_sid, 0, 2) == "WW"
    error_message = "workflow_sid expected to start with \"WW\"."
  }
}

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