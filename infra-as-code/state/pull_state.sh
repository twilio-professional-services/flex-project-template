#!/bin/bash
# This script will try to import the Terraform State from the Twilio Function assets.
set -e
echo "Trying to import Terraform State for $ENVIRONMENT"
echo "### Job Results "

IFS="|" read -ra tf_state_files <<<"$TF_STATE_FILES"

tfstate_bucket=$(twilio api:serverless:v1:services:fetch --sid tfstate -o json | jq -c '.[].domainBase // empty' | sed 's/"//g')

if [ -n "$tfstate_bucket" ]; then
	tfstate_bucket_url="$tfstate_bucket.twil.io"
	echo "Bucket URL is!: $tfstate_bucket_url"
	full_link="https://$tfstate_bucket_url/verify-function"
	echo "Full Link is: $full_link"
	response=$(curl -s -o /dev/null -w "%{http_code}" $full_link)

	if [ "$response" -eq 401 ]; then
		for item in "${tf_state_files[@]}"; do
			full_item_name="$item.tar.gz"
			curl --location "$full_link" \
				-o $full_item_name \
				--header 'Content-Type: application/json' \
				--data '{
							"apiKey": "'"$TWILIO_API_KEY"'",
							"apiSecret": "'"$TWILIO_API_SECRET"'",
							"assetKey": "'"$full_item_name"'"
			}'
			tar -xzvf "$full_item_name"
			openssl enc -d -in "$item.enc" -aes-256-cbc -pbkdf2 -k "$ENCRYPTION_KEY" -out "../terraform/environments/default/$item"
			rm -f "$full_item_name"
			rm -f "$item.enc"
		done
	else
		echo "JOB_FAILED=true" >>"$GITHUB_OUTPUT"
		echo "$full_link not found" >>"$GITHUB_STEP_SUMMARY"
		exit 0
	fi
else
	echo "JOB_FAILED=true" >>"$GITHUB_OUTPUT"
	exit 0
fi
echo "   - :white_check_mark: Terraform imported" >>$GITHUB_STEP_SUMMARY
