output "workspace_sid" {
  value = twilio_taskrouter_workspaces_v1.flex.sid
  description = "Flex Task Assignment workspace SID"
}

# FEATURE: remove-all
output "workflow_sid_assign_to_anyone" {
  value = twilio_taskrouter_workspaces_workflows_v1.assign_to_anyone.sid
  description = "Assign To Anyone workflow SID"
}
# END FEATURE: remove-all

# FEATURE: conversation-transfer
output "workflow_sid_chat_transfer" {
  value = twilio_taskrouter_workspaces_workflows_v1.chat_transfer.sid
  description = "conversation-transfer feature workflow SID"
}
# END FEATURE: conversation-transfer


# FEATURE: callback-and-voicemail
output "workflow_sid_callback" {
  value = twilio_taskrouter_workspaces_workflows_v1.callback.sid
  description = "callback-and-voicemail feature workflow SID"
}
# END FEATURE: callback-and-voicemail


# FEATURE: internal-call
output "workflow_sid_internal_call" {
  value = twilio_taskrouter_workspaces_workflows_v1.internal_call.sid
  description = "internal call feature workflow SID"
}
# END FEATURE: internal-call

output "chat_channel_sid" {
  value = twilio_taskrouter_workspaces_task_channels_v1.chat.sid
  description = "Chat channel SID"
}

output "voice_channel_sid" {
  value = twilio_taskrouter_workspaces_task_channels_v1.voice.sid
  description = "Voice channel SID"
}

