#!/bin/bash
# This script will import the project workflows, queues, channels, activities, and flows for the first time and apply them with Terraform.
set -e

terraform -chdir="../terraform/environments/default" init -input=false

get_value_from_json() {
	input_json="$1"
	key="$2"
	value="$3"
	property="$4"

	filtered_output=$(echo "$input_json" | jq --arg key "$key" --arg value "$value" '.[] | select(.[$key] == $value) // empty' | jq -r ".$property// \"\"")
	echo "$filtered_output"

}

import_resource() {
	input_json="$1"
	name="$2"
	resource="$3"
	key="$4"
	has_sid=${5:-true}

	result=$(get_value_from_json "$input_json" "$key" "$name" "sid")
	if [ -n "$result" ]; then
		if $has_sid; then
			terraform -chdir="../terraform/environments/default" import -input=false -var-file="${ENVIRONMENT:-local}.tfvars" "$resource" "$TF_WORKSPACE_SID"/"$result" || exit
		else
			terraform -chdir="../terraform/environments/default" import -input=false -var-file="${ENVIRONMENT:-local}.tfvars" "$resource" "$result" || exit
		fi
	fi

}

importInternalState() {
	echo " - Discovering and importing existing Twilio state for known definitions into a new terraform state file" >>$GITHUB_STEP_SUMMARY
	workspaces=$(npx twilio api:taskrouter:v1:workspaces:list --no-limit -o json)
	TF_WORKSPACE_SID=$(get_value_from_json "$workspaces" "friendlyName" "Flex Task Assignment" "sid")
	import_resource "$workspaces" "Flex Task Assignment" "module.taskrouter.twilio_taskrouter_workspaces_v1.flex" "friendlyName" false
	echo "   - :white_check_mark: Task Router - Workspaces" >>$GITHUB_STEP_SUMMARY

	workflows=$(npx twilio api:taskrouter:v1:workspaces:workflows:list --workspace-sid "$TF_WORKSPACE_SID" --no-limit -o json | jq 'map(del(.configuration))')

# FEATURE: remove-all
	import_resource "$workflows" "Assign to Anyone" "module.taskrouter.twilio_taskrouter_workspaces_workflows_v1.assign_to_anyone" "friendlyName"
# END FEATURE: remove-all

# FEATURE: conversation-transfer
	import_resource "$workflows" "Chat Transfer" "module.taskrouter.twilio_taskrouter_workspaces_workflows_v1.chat_transfer" "friendlyName"
# END FEATURE: conversation-transfer

# FEATURE: callback-and-voicemail
	import_resource "$workflows" "Callback" "module.taskrouter.twilio_taskrouter_workspaces_workflows_v1.callback" "friendlyName"
# END FEATURE: callback-and-voicemail

# FEATURE: internal-call
	import_resource "$workflows" "Internal Call" "module.taskrouter.twilio_taskrouter_workspaces_workflows_v1.internal_call" "friendlyName"
# END FEATURE: internal-call

	echo "   - :white_check_mark: Task Router - Workflows" >>$GITHUB_STEP_SUMMARY

	queues=$(npx twilio api:taskrouter:v1:workspaces:task-queues:list --workspace-sid "$TF_WORKSPACE_SID" --no-limit -o json)
# FEATURE: remove-all
	import_resource "$queues" "Everyone" "module.taskrouter.twilio_taskrouter_workspaces_task_queues_v1.everyone" "friendlyName"
	import_resource "$queues" "Template Example Sales" "module.taskrouter.twilio_taskrouter_workspaces_task_queues_v1.template_example_sales" "friendlyName"
	import_resource "$queues" "Template Example Support" "module.taskrouter.twilio_taskrouter_workspaces_task_queues_v1.template_example_support" "friendlyName"
# END FEATURE: remove-all

# FEATURE: internal-call
	import_resource "$queues" "Internal Calls" "module.taskrouter.twilio_taskrouter_workspaces_task_queues_v1.internal_calls" "friendlyName"
# END FEATURE: internal-call

	echo "   - :white_check_mark: Task Router - Queues" >>$GITHUB_STEP_SUMMARY

	channels=$(npx twilio api:taskrouter:v1:workspaces:task-channels:list --workspace-sid "$TF_WORKSPACE_SID" --no-limit -o json)
	import_resource "$channels" "voice" "module.taskrouter.twilio_taskrouter_workspaces_task_channels_v1.voice" "uniqueName"
	import_resource "$channels" "chat" "module.taskrouter.twilio_taskrouter_workspaces_task_channels_v1.chat" "uniqueName"
	echo "   - :white_check_mark: Task Router - Channels" >>$GITHUB_STEP_SUMMARY

	activities=$(npx twilio api:taskrouter:v1:workspaces:activities:list --workspace-sid "$TF_WORKSPACE_SID" --no-limit -o json)
	import_resource "$activities" "Offline" "module.taskrouter.twilio_taskrouter_workspaces_activities_v1.offline" "friendlyName"
	import_resource "$activities" "Available" "module.taskrouter.twilio_taskrouter_workspaces_activities_v1.available" "friendlyName"
	import_resource "$activities" "Unavailable" "module.taskrouter.twilio_taskrouter_workspaces_activities_v1.unavailable" "friendlyName"
	import_resource "$activities" "Break" "module.taskrouter.twilio_taskrouter_workspaces_activities_v1.break" "friendlyName"

# FEATURE: activity-reservation-handler
	import_resource "$activities" "On a Task" "module.taskrouter.twilio_taskrouter_workspaces_activities_v1.on_a_task" "friendlyName"
	import_resource "$activities" "On a Task, No ACD" "module.taskrouter.twilio_taskrouter_workspaces_activities_v1.on_a_task_no_acd" "friendlyName"
	import_resource "$activities" "Wrap Up" "module.taskrouter.twilio_taskrouter_workspaces_activities_v1.wrap_up" "friendlyName"
	import_resource "$activities" "Wrap Up, No ACD" "module.taskrouter.twilio_taskrouter_workspaces_activities_v1.wrap_up_no_acd" "friendlyName"
# END FEATURE: activity-reservation-handler
	echo "   - :white_check_mark: Task Router - Activities" >>$GITHUB_STEP_SUMMARY

	flows=$(npx twilio api:studio:v2:flows:list --no-limit -o json)
# FEATURE: remove-all
# FEATURE: callback-and-voicemail	
# FEATURE: schedule-manager
	import_resource "$flows" "Voice IVR" "module.studio.twilio_studio_flows_v2.voice" "friendlyName" false
# END FEATURE: schedule-manager
# END FEATURE: callback-and-voicemail
	import_resource "$flows" "Messaging Flow" "module.studio.twilio_studio_flows_v2.messaging" "friendlyName" false
	import_resource "$flows" "Chat Flow" "module.studio.twilio_studio_flows_v2.chat" "friendlyName" false
# END FEATURE: remove-all
	echo "   - :white_check_mark: Studio - Flows" >>$GITHUB_STEP_SUMMARY

}

# populate tfvars
(cd ../.. && npm run postinstall -- --skip-packages --files=infra-as-code/terraform/environments/default/example.tfvars)

### only if existing state file does not exist
### do we want to import the internal state
if ! [ -f ../terraform/environments/default/terraform.tfstate ]; then
  importInternalState
fi

terraform -chdir="../terraform/environments/default" apply -input=false -auto-approve -var-file="${ENVIRONMENT:-local}.tfvars"
echo " - Applying terraform configuration complete" >>$GITHUB_STEP_SUMMARY
echo "JOB_FAILED=false" >>"$GITHUB_OUTPUT"
