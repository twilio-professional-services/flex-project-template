variable "workspace_sid" {
  type        = string
  description = "TaskRouter workspace SID"
  validation {
    condition     = length(var.workspace_sid) > 2 && substr(var.workspace_sid, 0, 2) == "WS"
    error_message = "workspace_sid expected to start with \"WS\"."
  }
}

variable "everyone_queue_sid" {
  type        = string
  description = "SID of everyone queue"
  validation {
    condition     = length(var.everyone_queue_sid) > 2 && substr(var.everyone_queue_sid, 0, 2) == "WQ"
    error_message = "everyone_queue_sid expected to start with \"WQ\"."
  }
}

variable "example_sales_queue_sid" {
  type        = string
  description = "SID of example sales queue"
  validation {
    condition     = length(var.example_sales_queue_sid) > 2 && substr(var.example_sales_queue_sid, 0, 2) == "WQ"
    error_message = "example_sales_queue_sid expected to start with \"WQ\"."
  }
}

variable "example_support_queue_sid" {
  type        = string
  description = "SID of example support queue"
  validation {
    condition     = length(var.example_support_queue_sid) > 2 && substr(var.example_support_queue_sid, 0, 2) == "WQ"
    error_message = "example_support_queue_sid expected to start with \"WQ\"."
  }
}