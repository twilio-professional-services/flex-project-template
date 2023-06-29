resource "twilio_taskrouter_workspaces_task_channels_v1" "voice" {
  workspace_sid	= twilio_taskrouter_workspaces_v1.flex.sid
  friendly_name	= "Voice"
  unique_name = "voice"
}

resource "twilio_taskrouter_workspaces_task_channels_v1" "chat" {
  workspace_sid	= twilio_taskrouter_workspaces_v1.flex.sid
  friendly_name	= "Chat"
  unique_name = "chat"
}

