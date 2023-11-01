---
title: Terraform
---

The Terraform solution uses a combination of

- Twilio Serverless assets to store the Terraform state using an encryption key
- Twilio CLI to identify known and critical SIDs that can be injected into the Terraform definition and import existing state
- Terraform configuration to manage Studio flows and TaskRouter configuration that the features depend on.

It uses the [Twilio Terraform provider](https://github.com/twilio/terraform-provider-twilio) which at time of writing does not support data sources.

The main ambition with this setup is to lower the barrier for entry and get development off the ground, the persistence of the Terraform provider can be moved to another storage location as desired. Instructions on that piece still to come.

When running the release pipeline it will import and generate the state based on what is on the account but only with relation to resources declared in the configuration. Any resources not in the configuration will be ignored.

This solution pushes the configuration and will overwrite anything in your environment so please use with care.

## Adding resources

When adding resources in the usual way to the Terraform config, its also necessary to add an associated entry into the action.yaml file in the `infra-as-code/terraform/environments/default/import_internal_state.sh` file that identifies this resource for import. Examples are given for each type of resource. Failure to do so may result in a collision on successive releases.