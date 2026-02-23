---
sidebar_label: agent-automation-examples
title: Agent Automation - Configuration Examples
---

# Agent Automation Configuration Examples

This document provides example configurations demonstrating the advanced attribute matching capabilities of the agent-automation feature.

## Basic Example

A simple configuration that auto-accepts inbound voice calls for workers on the Blue Team:

```json
{
  "channel": "voice",
  "required_attributes": [
    {"key": "direction", "value": "inbound"}
  ],
  "required_worker_attributes": [
    {"key": "team_name", "value": "Blue Team"}
  ],
  "auto_accept": true,
  "auto_select": true,
  "auto_wrapup": true,
  "wrapup_time": 30000,
  "allow_extended_wrapup": false,
  "extended_wrapup_time": 0,
  "default_outcome": "Automatically completed"
}
```

## Nested Attributes Example

Match tasks based on nested conversation outcomes or customer profile data:

```json
{
  "channel": "chat",
  "required_attributes": [
    {"key": "conversations.sentiment", "value": "positive"},
    {"key": "customer.profile.tier", "value": "premium"}
  ],
  "required_worker_attributes": [
    {"key": "department.name", "value": "VIP Support"}
  ],
  "auto_accept": true,
  "auto_select": true,
  "auto_wrapup": true,
  "wrapup_time": 60000,
  "allow_extended_wrapup": true,
  "extended_wrapup_time": 30000,
  "default_outcome": "Premium customer handled"
}
```

## Array Matching Example

Match workers who have specific skills in their skills array:

```json
{
  "channel": "voice",
  "required_attributes": [
    {"key": "language", "value": "spanish"}
  ],
  "required_worker_attributes": [
    {"key": "skills", "value": "spanish"},
    {"key": "skills", "value": "customer_service"}
  ],
  "auto_accept": false,
  "auto_select": true,
  "auto_wrapup": true,
  "wrapup_time": 45000,
  "allow_extended_wrapup": false,
  "extended_wrapup_time": 0,
  "default_outcome": "Spanish language call completed"
}
```

In this example:
- The task must have `language: "spanish"`
- The worker must have both "spanish" AND "customer_service" in their skills array
- This allows matching against array-type attributes like `"skills": ["english", "spanish", "customer_service"]`

## Combined Nested and Array Matching

A complex example combining both nested attributes and array matching:

```json
{
  "channel": "chat",
  "required_attributes": [
    {"key": "customer.preferences.languages", "value": "french"},
    {"key": "routing.priority", "value": "high"}
  ],
  "required_worker_attributes": [
    {"key": "certifications", "value": "advanced_support"},
    {"key": "languages.spoken", "value": "french"}
  ],
  "auto_accept": true,
  "auto_select": true,
  "auto_wrapup": true,
  "wrapup_time": 90000,
  "allow_extended_wrapup": true,
  "extended_wrapup_time": 60000,
  "default_outcome": "High priority French customer handled"
}
```

This configuration would match:
- Tasks where the customer's preferred languages array includes "french" (nested array)
- Tasks with high routing priority (nested attribute)
- Workers with "advanced_support" certification (array attribute)
- Workers who speak French (nested array attribute)

## Multiple Configuration Sets

You can have multiple configuration sets with different rules. The first matching set is used:

```json
{
  "enabled": true,
  "configuration": [
    {
      "channel": "voice",
      "required_attributes": [
        {"key": "customer.vip", "value": "true"}
      ],
      "required_worker_attributes": [
        {"key": "team", "value": "VIP Team"}
      ],
      "auto_accept": true,
      "auto_select": true,
      "auto_wrapup": false,
      "wrapup_time": 0,
      "allow_extended_wrapup": false,
      "extended_wrapup_time": 0,
      "default_outcome": ""
    },
    {
      "channel": "voice",
      "required_attributes": [],
      "required_worker_attributes": [],
      "auto_accept": false,
      "auto_select": true,
      "auto_wrapup": true,
      "wrapup_time": 30000,
      "allow_extended_wrapup": false,
      "extended_wrapup_time": 0,
      "default_outcome": "Automatically completed"
    }
  ]
}
```

This configuration:
1. First checks if it's a VIP customer for VIP team members (no auto-wrapup for manual handling)
2. Falls back to standard voice call handling with auto-wrapup for all other voice calls
