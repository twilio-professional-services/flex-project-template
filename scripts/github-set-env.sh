#!/bin/bash

# Simple solution for extracting secrets and vars from the GitHub environment
# and setting them all as environment variables for the setup scripts to use
# This allows passing of secrets to env files as defined in .env.example
# https://stackoverflow.com/a/75789640

# Create string to use as a delimiter
EOF=_PS_TEMPLATE_VAR_EOF_

# Outputs the name/value pairs in the required format for multiline strings
# https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#multiline-strings
to_envs() { jq -r "to_entries[] | \"\(.key)<<$EOF\n\(.value)\n$EOF\n\""; }

# https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#setting-an-environment-variable
[[ -n "$VARS_CONTEXT" ]] && echo "$VARS_CONTEXT" | to_envs >> $GITHUB_ENV
echo "$SECRETS_CONTEXT" | to_envs >> $GITHUB_ENV