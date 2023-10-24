variable "TWILIO_ACCOUNT_SID" {
  type        = string
  sensitive   = true
  description = "Twilio Account SID"
  validation {
    condition     = length(var.TWILIO_ACCOUNT_SID) > 2 && substr(var.TWILIO_ACCOUNT_SID, 0, 2) == "AC"
    error_message = "TWILIO_ACCOUNT_SID expected to start with \"AC\"."
  }
}

variable "TWILIO_API_KEY" {
  type        = string
  sensitive   = true
  description = "Twilio API key"
  validation {
    condition     = length(var.TWILIO_API_KEY) > 2 && substr(var.TWILIO_API_KEY, 0, 2) == "SK"
    error_message = "TWILIO_API_KEY expected to start with \"SK\"."
  }
}

variable "TWILIO_API_SECRET" {
  type        = string
  sensitive   = true
  description = "Twilio API secret"
}

variable "SERVERLESS_DOMAIN" {
  type        = string
  description = "serverless domain"
  validation {
    condition     = length(var.SERVERLESS_DOMAIN) > 34 && substr(var.SERVERLESS_DOMAIN, 0, 34) == "custom-flex-extensions-serverless-"
    error_message = "SERVERLESS_DOMAIN expected to start with \"custom-flex-extensions-serverless-\"."
  }
}

variable "SERVERLESS_SID" {
  type        = string
  description = "serverless sid"
  validation {
    condition     = length(var.SERVERLESS_SID) > 2 && substr(var.SERVERLESS_SID, 0, 2) == "ZS"
    error_message = "SERVERLESS_SID expected to start with \"ZS\"."
  }
}

variable "SERVERLESS_ENV_SID" {
  type        = string
  description = "serverless env sid"
  validation {
    condition     = length(var.SERVERLESS_ENV_SID) > 2 && substr(var.SERVERLESS_ENV_SID, 0, 2) == "ZE"
    error_message = "SERVERLESS_ENV_SID expected to start with \"ZE\"."
  }
}

# FEATURE: schedule-manager

variable "SCHEDULE_MANAGER_DOMAIN" {
  type        = string
  description = "schedule manager domain"
  validation {
    condition     = length(var.SCHEDULE_MANAGER_DOMAIN) > 17 && substr(var.SCHEDULE_MANAGER_DOMAIN, 0, 17) == "schedule-manager-"
    error_message = "SCHEDULE_MANAGER_DOMAIN expected to start with \"schedule-manager-\"."
  }
}

variable "SCHEDULE_MANAGER_SID" {
  type        = string
  description = "schedule manager sid"
  validation {
    condition     = length(var.SCHEDULE_MANAGER_SID) > 2 && substr(var.SCHEDULE_MANAGER_SID, 0, 2) == "ZS"
    error_message = "SCHEDULE_MANAGER_SID expected to start with \"ZS\"."
  }
}

variable "SCHEDULE_MANAGER_ENV_SID" {
  type        = string
  description = "schedule manager env sid"
  validation {
    condition     = length(var.SCHEDULE_MANAGER_ENV_SID) > 2 && substr(var.SCHEDULE_MANAGER_ENV_SID, 0, 2) == "ZE"
    error_message = "SCHEDULE_MANAGER_ENV_SID expected to start with \"ZE\"."
  }
}

variable "FUNCTION_CHECK_SCHEDULE_SID" {
  type        = string
  description = "check schedule function sid"
  validation {
    condition     = length(var.FUNCTION_CHECK_SCHEDULE_SID) > 2 && substr(var.FUNCTION_CHECK_SCHEDULE_SID, 0, 2) == "ZH"
    error_message = "FUNCTION_CHECK_SCHEDULE_SID expected to start with \"ZH\"."
  }
}

# END FEATURE: schedule-manager

# FEATURE: callback-and-voicemail	
variable "FUNCTION_CREATE_CALLBACK" {
  type        = string
  description = "create callback function sid"
  validation {
    condition     = length(var.FUNCTION_CREATE_CALLBACK) > 2 && substr(var.FUNCTION_CREATE_CALLBACK, 0, 2) == "ZH"
    error_message = "FUNCTION_CREATE_CALLBACK expected to start with \"ZH\"."
  }
}
# END FEATURE: callback-and-voicemail	



