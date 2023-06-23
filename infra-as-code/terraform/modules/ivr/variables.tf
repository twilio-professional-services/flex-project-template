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

variable "chat_channel_sid" {
  type        = string
  description = "SID of the chat task channel"
}

variable "voice_channel_sid" {
  type        = string
  description = "SID of voice task channel"
}
