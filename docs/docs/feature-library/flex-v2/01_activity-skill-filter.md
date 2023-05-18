---
sidebar_label: activity-skill-filter
sidebar_position: 2
title: activity-skill-filter
---

This is a plugin for Twilio Flex that provides a configuration feature for Worker Activities such that:

- they can be ordered
- visibility of activities can be filtered by worker skills

## Known issue

On older Twilio Flex accounts a TaskRouter Activity of "Reserved" may be present. This Activity is automatically hidden by the Flex UI and breaks the logic of the plugin. In this scenario it is advised you remove any TaskQueue references to the "Reserved" activity (which will likely be the activity to use when task is assigned on the TaskQueue and as such isn't actually used by Flex) and then delete the "Reserved" Activity.

## Disclaimer

The Flex Component "Activity" which is the activity selector and current status indicator at the top right of the flex screen, lacks appropriate properties or hooks to modify the OOTB behavior without completely replacing the component.

This plugin uses a wrapper around the Activity component to apply CSS to the underlying component to order and hide the activity elements. This is not an ideal approach but is a tidy solution until appropriate hooks become available. An alternative approach would be to completely rewrite the underlying components but this would be a lot more invasive and magnitudes of effort greater.

## Configuration

This plugin relies on custom configuration being applied to your underlying [Flex configuration](https://www.twilio.com/docs/flex/developer/ui/configuration#modifying-configuration-for-flextwiliocom). This is accomplished using the [Flex Configuration Updater](https://github.com/twilio-professional-services/twilio-proserv-flex-project-template/tree/main/flex-config) package in this repository.

In your `ui_attributes.{environment}.json` file, enable the "activity_skill_filter" feature and add a rule for each activity SID you want to configure:

```
"activity_skill_filter": {
  "enabled": true, // controls whether this feature is enabled
  "filter_teams_view": true, // controls whether this feature affects the Teams view
  "rules": {
    "<ACTIVITY_SID>": {
      "required_skill": "skill_name", // name of skill required to allow this activity, or null to allow all workers
      "sort_order": order // zero-based integer
    }
  }
}
```

As an example:

```
"activity_skill_filter": {
  "enabled": true,
  "filter_teams_view": true,
  "rules": {
    "WA845ba1c86cb933b0806deabb39784c66": {
      "required_skill": null,
      "sort_order": 0
    },
    "WA6af363ff8880786f37c453bfa297dca1": {
      "required_skill": null,
      "sort_order": 1
    },
    "WAeee0165b5d13a7d246401dc7771c04f0": {
      "required_skill": "Retention",
      "sort_order": 2
    }
  }
}
```

NOTE: **Any activities that are not configured will not show.**
