variable "serverless_domain" {
  type        = string
  description = "serverless domain for flex plugin"
  validation {
    condition     = length(var.serverless_domain) > 34 && substr(var.serverless_domain, 0, 34) == "custom-flex-extensions-serverless-"
    error_message = "serverless_domain expected to start with \"custom-flex-extensions-serverless-\"."
  }
}


