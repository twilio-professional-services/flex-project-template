terraform {
  required_providers {
    twilio = {
      source  = "twilio/twilio"
      version = ">=0.4.0"
    }
  }
}

resource "twilio_taskrouter_workspaces_activities_v1" "on_a_task" {
  workspace_sid = var.workspace_sid
  friendly_name = "On a Task"
  available     = true
}

resource "twilio_taskrouter_workspaces_activities_v1" "on_a_task_no_acd" {
  workspace_sid = var.workspace_sid
  friendly_name = "On a Task, No ACD"
  available     = false
}

resource "twilio_taskrouter_workspaces_activities_v1" "wrap_up" {
  workspace_sid = var.workspace_sid
  friendly_name = "Wrap Up"
  available     = true
}

resource "twilio_taskrouter_workspaces_activities_v1" "wrap_up_no_acd" {
  workspace_sid = var.workspace_sid
  friendly_name = "Wrap Up, No ACD"
  available     = false
}

resource "twilio_taskrouter_workspaces_activities_v1" "extended_wrap_up" {
  workspace_sid = var.workspace_sid
  friendly_name = "Extended Wrap Up"
  available     = false
}