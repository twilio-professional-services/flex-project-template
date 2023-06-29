---
sidebar_label: custom-hold-music
title: custom-hold-music
---

This feature allows customization of the hold music used when an agent places a call or conference participant on hold, including when initiating a transfer.

# setup and dependencies

## Hold experience TwiML

To use this feature, you will need to provide the URL of [TwiML to execute](https://www.twilio.com/docs/voice/twiml) during hold. This TwiML can be hosted anywhere, such as TwiML Bins, Twilio Functions & Assets, or on your own infrastructure. Here is example TwiML that will loop an audio file continuously:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Play loop="0">http://com.twilio.music.soft-rock.s3.amazonaws.com/_ghost_-_promo_2_sample_pack.mp3</Play>
</Response>
```

Here is how you can create and use a TwiML Bin for this functionality:

1. Open Twilio Console and navigate to TwiML Bins > My TwiML Bins
2. Create a new TwiML Bin and give it a name
3. Paste in the above TwiML, or write your own
4. Save the TwiML Bin
5. Copy the URL that is provided after saving.

## Configuring the feature

Within your `ui_attributes` file, you must set two settings for the `custom-hold-music` feature:

- `enable` - set this to true to enable the feature
- `url` - set this to the URL of the TwiML containing the desired hold experience

> **Note**
> When using TwiML Bins, you must append your account SID to the URL, like so: `https://handler.twilio.com/twiml/EHxxxxx?AccountSid=ACxxxxx`

> **Warning**
> While you may provide a direct URL to an audio file rather than using TwiML, it will play only once and not loop.

Once your updated flex-config is deployed, the feature is enabled and ready to use.

# how does it work?

This feature adds listeners to the `beforeHoldCall`, `beforeHoldParticipant`, and `beforeTransferTask` actions to set the hold music URL. The TwiML at that URL will be played while the call is held.
