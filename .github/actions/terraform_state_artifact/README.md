# terraform_state_artifact 
[![Terraform State Artifact](https://github.com/sturlabragason/terraform_state_artifact/actions/workflows/terraform.yml/badge.svg)](https://github.com/sturlabragason/terraform_state_artifact/actions/workflows/terraform.yml)
  `#actionshackathon21`

The [`sturlabragason/terraform_state_artifact`](https://github.com/sturlabragason/terraform_state_artifact) action is a composite action that stores your Terraform state file as an encrypted Github workflow artifact and downloads and decrypts the state on subsequent runs. Built-in are the actions: [`actions/checkout@v2`](https://github.com/actions/checkout), [`hashicorp/setup-terraform@v1`](https://github.com/hashicorp/setup-terraform) and [`actions/upload-artifact@v2`](https://github.com/actions/upload-artifact).

Be aware that [Github delets artifacts older then 90 days](https://docs.github.com/en/organizations/managing-organization-settings/configuring-the-retention-period-for-github-actions-artifacts-and-logs-in-your-organization) by default. You can [run your pipeline on a schedule](https://docs.github.com/en/actions/learn-github-actions/events-that-trigger-workflows#scheduled-events) to create a new artifact at least once every 90 days.

## [:rocket: What this action does: :rocket:](https://dev.to/sturlabragason/terraformstateartifact-github-action-keeping-the-statefile-with-to-your-code-4d3b)

- 🛠️ First off, it downloads your repository with [`actions/checkout@v2`](https://github.com/actions/checkout) and then installs terraform using [`hashicorp/setup-terraform@v1`](https://github.com/hashicorp/setup-terraform).
- :inbox_tray: Using [environment variables](https://docs.github.com/en/actions/learn-github-actions/environment-variables) it downloads the most recent [workflow artifact](https://docs.github.com/en/actions/advanced-guides/storing-workflow-data-as-artifacts) called `terraformstatefile` and decrypts using the user input variable `encryptionkey`.
  - If no artifact with that name is found (maybe it's your first run) then it proceeds with the following.
- :building_construction: It then proceeds to run `terraform plan` with any flags from the optional variable `custom_plan_flags`
- 🏢 Next it runs `terraform apply` with any flags from the optional variable`custom_apply_flags`.
  - This can be skipped by setting the optional variable `apply` to `false`.
- 🗃️ If all is well then Terraform has now produced a statefile `./terraform.tfstate`. This file is encrypted using the provided `encryptionkey`.
    - 🤫 I'd recommend getting this from a [`${{secret.variable}}`](https://docs.github.com/en/actions/security-guides/encrypted-secrets) since the output isn't hidden.
- 💾 Finally the new statefile is uploaded as an artifact!
#### - :tada: Lather, rinse, repeat! :tada:


## Usage

```yaml
steps:
- uses: sturlabragason/terraform_state_artifact@v1
    with:
        encryptionkey: ${{ secrets.encryptionkey }}
```

You can choose to skip `terraform apply`:

```yaml
steps:
- uses: sturlabragason/terraform_state_artifact@v1
    with:
        encryptionkey: ${{ secrets.encryptionkey }}
        apply: false
```

You can choose to add custom flags to `terraform plan`:

```yaml
steps:
- uses: sturlabragason/terraform_state_artifact@v1
    with:
        encryptionkey: ${{ secrets.encryptionkey }}
        apply: false
        custom_plan_flags: '-refresh-only'
```

You can choose to add custom flags to `terraform apply`:

```yaml
steps:
- uses: sturlabragason/terraform_state_artifact@v1
    with:
        encryptionkey: ${{ secrets.encryptionkey }}
        custom_apply_flags: '-no-color'
```

## Inputs

The action supports the following inputs:

| Variable        | Description                                                                                                                             | Default |
|-----------------|-----------------------------------------------------------------------------------------------------------------------------------------|---------|
| `encryptionkey` | An encryption key to use when encrypting the statefile. Recommended to use a secret value.                                              |   N/A   |
| `apply`         | (optional) Whether to run the `terraform apply` command.               | `true`  |
| `custom_plan_flags`         | (optional) Add a custom flag to the `terraform plan` command.               | `''`  |
| `custom_apply_flags`         | (optional) Add a custom flag to the `terraform apply` command.               | `''`  |

## License

[GNU General Public License v3.0](https://github.com/sturlabragason/terraform_state_artifact/blob/main/LICENSE)
