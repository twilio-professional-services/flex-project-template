---
sidebar_label: infra-as-code
sidebar_position: 3
title: infra-as-code
---

This package contains the available infastructure as code solutions, right now the only one in use is terraform, which is the default.

---

## Terraform

The terraform solution uses a combination of

- Twilio Functions Assets to store the terraform state using an encryption key
- twilio cli to identify known and critical sids that can be injected into the terraform definition and import existing state
- terraform configuration to manage studio flows and task router configuration that the features depend on.

It uses the [twilio terraform provider](https://github.com/twilio/terraform-provider-twilio) which at time of writing does not support data sources.

The main ambition with this setup is to lower the barrrier for entry and get development off the ground, the persistence of the terraform provider can be moved to another storage location as desired. Instructions on that piece still to come.

When running the release pipeline it will import and generate the state based on what is on the account but only with relation to resources declared in the configuration. Any resources not in the configuration will be ignored.

This solution pushes the configuration and will overwrite anything in your environment so please use with care.

### Adding resources

When adding resources in the usual way to the terraform config, its also to add an associated entry into the action.yaml file in the `infra-as-code/terraform/environments/default/import_internal_state.sh' file that identifies this resource for import. Examples are given for each type of resource. Failure to do so may result in a collision on successive releases.
