output "park_resume_workflow_sid" {
  value = twilio_taskrouter_workspaces_workflows_v1.template_example_park_resume.sid
  description = "Park/resume workflow SID"
}

output "example_parking_flow_sid" {
  value = twilio_studio_flows_v2.template_example_messaging_with_parking_flow.sid
  description = "Example messaging with parking flow SID"
}