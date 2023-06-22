output "workspace_sid" {
  value = module.routing.workspace_sid
  description = "Flex TR Workspace SID"
}

output "chat_flow_sid" {
  value = module.ivr.chat_flow_sid
  description = "Chat Flow SID"
}

output "messaging_flow_sid" {
  value = module.ivr.messaging_flow_sid
  description = "Messaging Flow SID"
}

output "voice_flow_sid" {
  value = module.ivr.voice_flow_sid
  description = "Voice Flow"
}