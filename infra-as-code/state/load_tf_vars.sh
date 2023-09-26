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

services=$(twilio api:serverless:v1:services:list --no-limit -o json)

TF_VAR_SERVERLESS_SID=$(get_value_from_json "$services" "uniqueName" "custom-flex-extensions-serverless" "sid")
TF_VAR_SCHEDULE_MANAGER_SID=$(get_value_from_json "$services" "uniqueName" "schedule-manager" "sid")

schedule_manager=$(twilio api:serverless:v1:services:environments:list --service-sid "$TF_VAR_SCHEDULE_MANAGER_SID" --no-limit -o json)
serverless=$(twilio api:serverless:v1:services:environments:list --service-sid "$TF_VAR_SERVERLESS_SID" --no-limit -o json)

TF_VAR_SERVERLESS_DOMAIN=$(get_value_from_json "$serverless" "uniqueName" "dev-environment" "domainName")
TF_VAR_SERVERLESS_ENV_SID=$(get_value_from_json "$serverless" "uniqueName" "dev-environment" "sid")

TF_VAR_SCHEDULE_MANAGER_DOMAIN=$(get_value_from_json "$schedule_manager" "uniqueName" "dev-environment" "domainName")
TF_VAR_SCHEDULE_MANAGER_ENV_SID=$(get_value_from_json "$schedule_manager" "uniqueName" "dev-environment" "sid")

### Functions
serverless_functions=$(twilio api:serverless:v1:services:functions:list --service-sid "$TF_VAR_SERVERLESS_SID" --no-limit -o json)
schedule_manager_functions=$(twilio api:serverless:v1:services:functions:list --service-sid "$TF_VAR_SCHEDULE_MANAGER_SID" --no-limit -o json)

### SERVERLESS FUNCTIONS
TF_VAR_FUNCTION_CREATE_CALLBACK=$(get_value_from_json "$serverless_functions" "friendlyName" "/features/callback-and-voicemail/studio/create-callback" "sid")

### SCHEDULE MANAGER FUNCTIONS
TF_VAR_FUNCTION_CHECK_SCHEDULE_SID=$(get_value_from_json "$schedule_manager_functions" "friendlyName" "/check-schedule" "sid")

echo " - *Discovering Serverless Backends* " >>$GITHUB_STEP_SUMMARY

if [ -n "$TF_VAR_SERVERLESS_DOMAIN" ]; then
	echo "   - :white_check_mark: serverless backend: $TF_VAR_SERVERLESS_DOMAIN" >>$GITHUB_STEP_SUMMARY
else
	echo "   - :x: serverless backend not found" >>$GITHUB_STEP_SUMMARY
fi

if [ -n "$TF_VAR_SCHEDULE_MANAGER_DOMAIN" ]; then
	echo "   - :white_check_mark: schedule manager backend: $TF_VAR_SCHEDULE_MANAGER_DOMAIN" >>$GITHUB_STEP_SUMMARY
else
	echo "   - :x: schedule manager backend not found" >>$GITHUB_STEP_SUMMARY
fi

echo "TF_VAR_SERVERLESS_SID=$TF_VAR_SERVERLESS_SID" >> "$GITHUB_ENV"
echo "TF_VAR_SCHEDULE_MANAGER_SID=$TF_VAR_SCHEDULE_MANAGER_SID" >> "$GITHUB_ENV"
echo "TF_VAR_SERVERLESS_DOMAIN=$TF_VAR_SERVERLESS_DOMAIN" >> "$GITHUB_ENV"
echo "TF_VAR_SERVERLESS_ENV_SID=$TF_VAR_SERVERLESS_ENV_SID" >> "$GITHUB_ENV"
echo "TF_VAR_SCHEDULE_MANAGER_DOMAIN=$TF_VAR_SCHEDULE_MANAGER_DOMAIN" >> "$GITHUB_ENV"
echo "TF_VAR_SCHEDULE_MANAGER_ENV_SID=$TF_VAR_SCHEDULE_MANAGER_ENV_SID" >> "$GITHUB_ENV"
echo "TF_VAR_FUNCTION_CREATE_CALLBACK=$TF_VAR_FUNCTION_CREATE_CALLBACK" >> "$GITHUB_ENV"
echo "TF_VAR_FUNCTION_CHECK_SCHEDULE_SID=$TF_VAR_FUNCTION_CHECK_SCHEDULE_SID" >> "$GITHUB_ENV"

echo "JOB_FAILED=false" >>"$GITHUB_OUTPUT"
