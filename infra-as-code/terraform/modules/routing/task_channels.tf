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

# resource "twilio_taskrouter_workspaces_task_channels_v1" "default" {
#   workspace_sid	= twilio_taskrouter_workspaces_v1.flex.sid
#   friendly_name	= "Default"
#   unique_name = "default"
# }

# resource "twilio_taskrouter_workspaces_task_channels_v1" "sms" {
#   workspace_sid	= twilio_taskrouter_workspaces_v1.flex.sid
#   friendly_name	= "SMS"
#   unique_name = "sms"
# }

# resource "twilio_taskrouter_workspaces_task_channels_v1" "video" {
#   workspace_sid	= twilio_taskrouter_workspaces_v1.flex.sid
#   friendly_name	= "Video"
#   unique_name = "video"
# }

# resource "twilio_taskrouter_workspaces_task_channels_v1" "email" {
#   workspace_sid	= twilio_taskrouter_workspaces_v1.flex.sid
#   friendly_name	= "Email"
#   unique_name = "email"
# }