# FEATURE: remove-all
output "chat_flow_sid" {
  value = twilio_studio_flows_v2.chat.sid
  description = "Chat Flow SID"
}

output "messaging_flow_sid" {
  value = twilio_studio_flows_v2.messaging.sid
  description = "Messaging Flow SID"
}

# FEATURE: callback-and-voicemail	
# FEATURE: schedule-manager
output "voice_flow_sid" {
  value = twilio_studio_flows_v2.voice.sid
  description = "Voice Flow SID"
}

# END FEATURE: schedule-manager
# END FEATURE: callback-and-voicemail
# END FEATURE: remove-all