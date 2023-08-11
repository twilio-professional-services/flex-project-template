resource "twilio_taskrouter_workspaces_activities_v1" "offline" {
  workspace_sid = twilio_taskrouter_workspaces_v1.flex.sid
  friendly_name = "Offline"
  available     = false
}

resource "twilio_taskrouter_workspaces_activities_v1" "available" {
  workspace_sid = twilio_taskrouter_workspaces_v1.flex.sid
  friendly_name = "Available"
  available     = true
}

resource "twilio_taskrouter_workspaces_activities_v1" "unavailable" {
  workspace_sid = twilio_taskrouter_workspaces_v1.flex.sid
  friendly_name = "Unavailable"
  available     = false
}

resource "twilio_taskrouter_workspaces_activities_v1" "break" {
  workspace_sid = twilio_taskrouter_workspaces_v1.flex.sid
  friendly_name = "Break"
  available     = false
}

# these activities are for the activity-reservation-handler 


resource "twilio_taskrouter_workspaces_activities_v1" "on_a_task" {
  workspace_sid = twilio_taskrouter_workspaces_v1.flex.sid
  friendly_name = "On a Task"
  available     = false
}

resource "twilio_taskrouter_workspaces_activities_v1" "on_a_task_no_acd" {
  workspace_sid = twilio_taskrouter_workspaces_v1.flex.sid
  friendly_name = "On a Task, No ACD"
  available     = false
}

resource "twilio_taskrouter_workspaces_activities_v1" "wrap_up" {
  workspace_sid = twilio_taskrouter_workspaces_v1.flex.sid
  friendly_name = "Wrap Up"
  available     = false
}

resource "twilio_taskrouter_workspaces_activities_v1" "wrap_up_no_acd" {
  workspace_sid = twilio_taskrouter_workspaces_v1.flex.sid
  friendly_name = "Wrap Up, No ACD"
  available     = false
} 



