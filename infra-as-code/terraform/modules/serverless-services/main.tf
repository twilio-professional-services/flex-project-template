terraform {
  required_providers {
    twilio = {
      source  = "RJPearson94/twilio"
      version = "0.23.0"
    }
  }
}

resource "twilio_serverless_service" "service" {
  unique_name   = var.service_manifest.project
  friendly_name = var.service_manifest.project
}

resource "twilio_serverless_environment" "environment" {
  service_sid = twilio_serverless_service.service.id
  unique_name = "prod"
}

resource "twilio_serverless_variable" "variables" {
  for_each        = var.service_manifest.environment
  service_sid     = twilio_serverless_service.service.id
  environment_sid = twilio_serverless_environment.environment.id
  key             = each.key
  value           = each.value
}

resource "twilio_serverless_asset" "assets" {
  for_each      = var.service_manifest.assets
  friendly_name = each.value.friendly_name
  service_sid   = twilio_serverless_service.service.id
  path          = each.value.path
  source        = each.value.source
  content_type  = each.value.content_type
  visibility    = each.value.visibility
  source_hash   = filemd5(each.value.source)
}


resource "twilio_serverless_function" "functions" {
  for_each      = var.service_manifest.functions
  friendly_name = each.value.friendly_name
  service_sid   = twilio_serverless_service.service.id
  path          = each.value.path
  source        = each.value.source
  content_type  = each.value.content_type
  visibility    = each.value.visibility
}

resource "twilio_serverless_build" "build" {
  service_sid = twilio_serverless_service.service.id

  dynamic "asset_version" {
    for_each = twilio_serverless_asset.assets
    content {
      sid = asset_version.value.latest_version_sid
    }
  }

  dynamic "function_version" {
    for_each = twilio_serverless_function.functions
    content {
      sid = function_version.value.latest_version_sid
    }
  }

  dependencies = var.service_manifest.packageJson.dependencies

  polling {
    enabled = true
  }
}

resource "twilio_serverless_deployment" "deployment" {
  service_sid     = twilio_serverless_service.service.id
  environment_sid = twilio_serverless_environment.environment.id
  build_sid       = twilio_serverless_build.build.id
}