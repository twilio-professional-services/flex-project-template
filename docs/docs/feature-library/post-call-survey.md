---
sidebar_label: post-call-survey
title: post-call-survey
---

## Feature summary

This feature adds a a post call survey designer and IVR to Flex.  Users with an admin role will receive a new icon in the left Flex navigation bar. This will enable them to create, modify and delete both survey and survey activation rules.


## Flex User Experience
During the first run this screen will be shown, prompting the user to create a survey and an activation rule.
![Post call survey](/img/features/post-call-survey/pcs-first-run.png) 

Using the Survey designer you can create a short label that will be used in Flex Insights reporting.

On the first tab the start and end messages are captured, these will be read out using the default TTS voice configured on the account.
![Post call survey](/img/features/post-call-survey/pcs-desginer-questions.png) 

If the user is returning to edit a survey a warning will be displayed indicating that edits to the survey may cause data integrity issues due to changing survey design.
![Post call survey](/img/features/post-call-survey/pcs-designer-edit.png) 
![Post call survey](/img/features/post-call-survey/pcs-designer-edit-question.png) 

Once the survey is saved it will be immediately deployed and activated for the next caller (assuming an activation rule is already created)
![Post call survey](/img/features/post-call-survey/pcs-designer-save.png) 

If no rules have been created this will appear in the rules section
![Post call survey](/img/features/post-call-survey/pcs-no-rules.png) 

Activation rules are simply a mapping between the queue and the survey to activate. There can be a one to one or one to many relationship between surveys and queues.
![Post call survey](/img/features/post-call-survey/pcs-rules.png) 

A complete list of surveys and activation rules will be displayed once created, users can delete either item from this screen
![Post call survey](/img/features/post-call-survey/pcs-survey-list.png) 



## Setup and dependencies

To enable the parking feature, under your `flex-config` attributes set the `post_call_survey` `enabled` flag to `true`. 

Configure your environment file to point to a new Task Router workflow and a sync map (in the default Sync service).

```sh
# POST CALL SURVEY
TWILIO_FLEX_POST_CALL_SURVEY_WORKFLOW_SID=
TWILIO_FLEX_POST_CALL_SURVEY_SYNC_MAP_SID=
```
The workflow does not target any users, it is there so that Task Router can capture the task. If a caller abandons the task will time out, otherwise if they complete the survey the task will be cancelled and a reason inserted "Survey Completed"

![Post call survey](/img/features/post-call-survey/pcs-workflow.png)

