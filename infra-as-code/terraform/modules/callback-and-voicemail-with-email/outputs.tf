output "callback_with_email_workflow_sid" {
  value = twilio_taskrouter_workspaces_workflows_v1.template_example_callback_with_email.sid
  description = "Callback with email workflow SID"
}

output "example_callback_with_email_flow_sid" {
  value = twilio_studio_flows_v2.template_example_callback_with_email_flow.sid
  description = "Example callback with email flow SID"
}