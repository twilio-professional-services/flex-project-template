#!/bin/bash
# This script deletes the assets stored in the Twilio Function.
set -e
echo "Trying to Delete Terraform State for $ENVIRONMENT"

source ./config.sh

tfstate_sid=$(twilio serverless:list services --properties sid,unique_name | awk -v service_name="$tfstate_service_name" '$2==service_name {print $1}')

echo "TF State SID is $tfstate_sid"
echo "TF State service name is $tfstate_service_name"

twilio api:serverless:v1:services:remove --sid $tfstate_sid
