# Automatic End Chat Message

Sends an automatic closing message right before a chat, web, or WhatsApp task is
completed.

## Configuration

```json
{
  "automatic_end_chat_message": {
    "enabled": true,
    "message": "Thank you for contacting us!\nSee you next time!"
  }
}
```

- `enabled`: turns the feature on/off.
- `message`: text sent through the `SendMessage` action. `\n` produces a line break.

Only sent for tasks whose `channelType` is `chat`, `web`, or `whatsapp` (voice tasks are
skipped). Editable through the Feature Settings admin screen, on this feature's card.
