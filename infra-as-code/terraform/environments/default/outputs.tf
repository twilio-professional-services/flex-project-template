# these aren't used for anything other than debug output within the CI workflow.

output "workspace_sid" {
  value = twilio_taskrouter_workspaces_v1.flex_task_assignment.sid
  description = "Flex Task Assignment workspace SID"
}

# FEATURE: remove-all
output "template_example_workflow_sid" {
  value = twilio_taskrouter_workspaces_workflows_v1.template_example.sid
  description = "Template example workflow SID"
}
# END FEATURE: remove-all

# FEATURE: callback-and-voicemail
output "callback_workflow_sid" {
  value = module.callback-and-voicemail.callback_workflow_sid
  description = "Callback workflow SID"
}

output "example_callback_flow_sid" {
  value = module.callback-and-voicemail.example_callback_flow_sid
  description = "Example callback flow SID"
}
# END FEATURE: callback-and-voicemail

# FEATURE: conversation-transfer
output "chat_transfer_workflow_sid" {
  value = module.conversation-transfer.chat_transfer_workflow_sid
  description = "Chat transfer workflow SID"
}
# END FEATURE: conversation-transfer

# FEATURE: internal-call
output "internal_call_workflow_sid" {
  value = module.internal-call.internal_call_workflow_sid
  description = "Internal call workflow SID"
}
# END FEATURE: internal-call

# FEATURE: schedule-manager
output "example_schedule_flow_sid" {
  value = module.schedule-manager.example_schedule_flow_sid
  description = "Example schedule flow SID"
}
# END FEATURE: schedule-manager