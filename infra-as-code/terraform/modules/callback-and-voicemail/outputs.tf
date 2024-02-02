output "callback_workflow_sid" {
  value = twilio_taskrouter_workspaces_workflows_v1.template_example_callback.sid
  description = "Callback workflow SID"
}

output "example_callback_flow_sid" {
  value = twilio_studio_flows_v2.template_example_callback_flow.sid
  description = "Example callback flow SID"
}