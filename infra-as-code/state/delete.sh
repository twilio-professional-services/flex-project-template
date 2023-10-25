#!/bin/bash
# This script deletes the assets stored in the Twilio Function.
set -e
echo "Trying to Delete Terraform State for $ENVIRONMENT"

source ./config.sh


tfstate_sid=$(twilio serverless:list services --properties sid,unique_name | awk '$2 == $tfstate_service_name {print $1}')

echo "TF State SID is $tfstate_sid"

twilio api:serverless:v1:services:remove --sid $tfstate_sid
