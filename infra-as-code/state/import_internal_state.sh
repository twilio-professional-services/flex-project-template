#!/bin/bash
# This script will import the project workflows, queues, channels, activities, and flows for the first time and apply them with Terraform.
set -e

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
			terraform -chdir="../terraform/environments/default" import -input=false "$resource" "$TF_WORKSPACE_SID"/"$result" || exit
		else
			terraform -chdir="../terraform/environments/default" import -input=false "$resource" "$result" || exit
		fi
	fi

}

importInternalState() {
	echo " - Discovering and importing existing state for known definitions" >>$GITHUB_STEP_SUMMARY
	import_resource "$workspaces" "Flex Task Assignment" "module.taskrouter.twilio_taskrouter_workspaces_v1.flex" "friendlyName" false
	echo "   - :white_check_mark: Task Router - Workspaces" >>$GITHUB_STEP_SUMMARY

	workflows=$(twilio api:taskrouter:v1:workspaces:workflows:list --workspace-sid "$TF_WORKSPACE_SID" --no-limit -o json | jq 'map(del(.configuration))')
	import_resource "$workflows" "Assign to Anyone" "module.taskrouter.twilio_taskrouter_workspaces_workflows_v1.assign_to_anyone" "friendlyName"
	import_resource "$workflows" "Chat Transfer" "module.taskrouter.twilio_taskrouter_workspaces_workflows_v1.chat_transfer" "friendlyName"
	import_resource "$workflows" "Callback" "module.taskrouter.twilio_taskrouter_workspaces_workflows_v1.callback" "friendlyName"
	import_resource "$workflows" "Internal Call" "module.taskrouter.twilio_taskrouter_workspaces_workflows_v1.internal_call" "friendlyName"
	echo "   - :white_check_mark: Task Router - Workflows" >>$GITHUB_STEP_SUMMARY

	queues=$(twilio api:taskrouter:v1:workspaces:task-queues:list --workspace-sid "$TF_WORKSPACE_SID" --no-limit -o json)
	import_resource "$queues" "Everyone" "module.taskrouter.twilio_taskrouter_workspaces_task_queues_v1.everyone" "friendlyName"
	import_resource "$queues" "Template Example Sales" "module.taskrouter.twilio_taskrouter_workspaces_task_queues_v1.template_example_sales" "friendlyName"
	import_resource "$queues" "Template Example Support" "module.taskrouter.twilio_taskrouter_workspaces_task_queues_v1.template_example_support" "friendlyName"
	import_resource "$queues" "Internal Calls" "module.taskrouter.twilio_taskrouter_workspaces_task_queues_v1.internal_calls" "friendlyName"
	echo "   - :white_check_mark: Task Router - Queues" >>$GITHUB_STEP_SUMMARY

	channels=$(twilio api:taskrouter:v1:workspaces:task-channels:list --workspace-sid "$TF_WORKSPACE_SID" --no-limit -o json)
	import_resource "$channels" "voice" "module.taskrouter.twilio_taskrouter_workspaces_task_channels_v1.voice" "uniqueName"
	import_resource "$channels" "chat" "module.taskrouter.twilio_taskrouter_workspaces_task_channels_v1.chat" "uniqueName"
	echo "   - :white_check_mark: Task Router - Channels" >>$GITHUB_STEP_SUMMARY

	activities=$(twilio api:taskrouter:v1:workspaces:activities:list --workspace-sid "$TF_WORKSPACE_SID" --no-limit -o json)
	import_resource "$activities" "Offline" "module.taskrouter.twilio_taskrouter_workspaces_activities_v1.offline" "friendlyName"
	import_resource "$activities" "Available" "module.taskrouter.twilio_taskrouter_workspaces_activities_v1.available" "friendlyName"
	import_resource "$activities" "Unavailable" "module.taskrouter.twilio_taskrouter_workspaces_activities_v1.unavailable" "friendlyName"
	import_resource "$activities" "Break" "module.taskrouter.twilio_taskrouter_workspaces_activities_v1.break" "friendlyName"

	import_resource "$activities" "On a Task" "module.taskrouter.twilio_taskrouter_workspaces_activities_v1.on_a_task" "friendlyName"
	import_resource "$activities" "On a Task, No ACD" "module.taskrouter.twilio_taskrouter_workspaces_activities_v1.on_a_task_no_acd" "friendlyName"
	import_resource "$activities" "Wrap Up" "module.taskrouter.twilio_taskrouter_workspaces_activities_v1.wrap_up" "friendlyName"
	import_resource "$activities" "Wrap Up, No ACD" "module.taskrouter.twilio_taskrouter_workspaces_activities_v1.wrap_up_no_acd" "friendlyName"
	echo "   - :white_check_mark: Task Router - Activities" >>$GITHUB_STEP_SUMMARY

	flows=$(twilio api:studio:v2:flows:list --no-limit -o json)
	import_resource "$flows" "Voice IVR" "module.studio.twilio_studio_flows_v2.voice" "friendlyName" false
	import_resource "$flows" "Messaging Flow" "module.studio.twilio_studio_flows_v2.messaging" "friendlyName" false
	import_resource "$flows" "Chat Flow" "module.studio.twilio_studio_flows_v2.chat" "friendlyName" false
	echo "   - :white_check_mark: Studio - Flows" >>$GITHUB_STEP_SUMMARY
	echo "   - :white_check_mark: Studio - Flows" >>$GITHUB_STEP_SUMMARY

}


workspaces=$(twilio api:taskrouter:v1:workspaces:list --no-limit -o json)
export workspaces
TF_WORKSPACE_SID=$(get_value_from_json "$workspaces" "friendlyName" "Flex Task Assignment" "sid")
export TF_WORKSPACE_SID

importInternalState

echo "JOB_FAILED=false" >>"$GITHUB_OUTPUT"
