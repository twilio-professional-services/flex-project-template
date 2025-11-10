output "internal_call_workflow_sid" {
  value = twilio_taskrouter_workspaces_workflows_v1.template_example_internal_calls.sid
  description = "Internal call workflow SID"
}

output "internal_call_application_sid" {
  value = twilio_api_accounts_applications.internal_calls.sid
  description = "Internal call application SID"
}