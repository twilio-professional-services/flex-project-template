output "workspace_sid" {
  value = twilio_taskrouter_workspaces_v1.flex.sid
  description = "Default workspace SID"
}

output "workflow_sid" {
  value = twilio_taskrouter_workspaces_workflows_v1.default.sid
  description = "Default workflow SID"
}

output "chat_channel_sid" {
  value = twilio_taskrouter_workspaces_task_channels_v1.chat.sid
  description = "Chat channel SID"
}

output "voice_channel_sid" {
  value = twilio_taskrouter_workspaces_task_channels_v1.voice.sid
  description = "Voice channel SID"
}

