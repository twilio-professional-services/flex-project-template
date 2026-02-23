---
sidebar_label: Attribute Matcher Utility
title: Using the Attribute Matcher Utility
---

# Attribute Matcher Utility Guide

The `attributeMatcher` utility provides a powerful, consistent way to match task and worker attributes across multiple features in the Flex plugin template.

## Overview

Located at `src/utils/helpers/attributeMatcher.ts`, this utility provides two main functions for attribute matching with support for nested attributes and array values.

## Functions

### `getNestedProperty(obj, path)`

Retrieves a value from a nested object using dot notation.

**Parameters:**
- `obj` (any) - The object to retrieve the value from
- `path` (string) - The dot-notated path (e.g., 'customer.profile.name')

**Returns:** The value at the specified path, or `undefined` if not found

**Examples:**
```typescript
import { getNestedProperty } from 'utils/helpers';

const task = {
  attributes: {
    customer: {
      profile: {
        tier: 'premium'
      }
    }
  }
};

getNestedProperty(task.attributes, 'customer.profile.tier'); // Returns: 'premium'
getNestedProperty(task.attributes, 'customer.name'); // Returns: undefined
```

### `matchesAttribute(attributes, attributeKey, expectedValue)`

Checks if an attribute value matches the expected value with support for nested attributes and array containment.

**Parameters:**
- `attributes` (any) - The object containing the attributes
- `attributeKey` (string) - The attribute key (supports dot notation)
- `expectedValue` (string) - The expected value to match against

**Returns:** `true` if the attribute matches, `false` otherwise

**Matching Behavior:**
- **Simple values:** Performs direct equality check
- **Arrays:** Returns `true` if the array includes the expected value
- **Nested attributes:** Supports dot notation to access nested properties

**Examples:**
```typescript
import { matchesAttribute } from 'utils/helpers';

// Simple attribute matching
const attrs1 = { direction: 'inbound' };
matchesAttribute(attrs1, 'direction', 'inbound'); // Returns: true

// Nested attribute matching
const attrs2 = { customer: { vip: 'true' } };
matchesAttribute(attrs2, 'customer.vip', 'true'); // Returns: true

// Array matching
const attrs3 = { skills: ['english', 'spanish', 'french'] };
matchesAttribute(attrs3, 'skills', 'spanish'); // Returns: true
matchesAttribute(attrs3, 'skills', 'german'); // Returns: false

// Combined nested and array matching
const attrs4 = {
  customer: {
    preferences: {
      languages: ['english', 'spanish']
    }
  }
};
matchesAttribute(attrs4, 'customer.preferences.languages', 'spanish'); // Returns: true
```

## Features Using Attribute Matcher

### 1. agent-automation
Matches tasks for automation based on required attributes:
```json
{
  "required_attributes": [
    {"key": "customer.vip", "value": "true"},
    {"key": "priority", "value": "high"}
  ],
  "required_worker_attributes": [
    {"key": "skills", "value": "spanish"}
  ]
}
```

### 2. dual-channel-recording
Excludes recording based on task attributes:
```json
{
  "exclude_attributes": [
    {"key": "customer.preferences.privacy", "value": "no-recording"},
    {"key": "tags", "value": "do-not-record"}
  ]
}
```

### 3. conditional-recording
Excludes recording based on task attributes:
```json
{
  "exclude_attributes": [
    {"key": "conversations.topics", "value": "medical"},
    {"key": "customer.consent.recording", "value": "denied"}
  ]
}
```

## Using in Your Own Features

If you're creating a new feature that needs attribute matching, you can import and use these utilities:

```typescript
import { matchesAttribute } from 'utils/helpers';
import { ITask } from '@twilio/flex-ui';

export const shouldProcessTask = (task: ITask, config: any): boolean => {
  const { attributes } = task;

  // Check if task matches required attributes
  for (const requirement of config.required_attributes) {
    if (!matchesAttribute(attributes, requirement.key, requirement.value)) {
      return false;
    }
  }

  return true;
};
```

## Common Patterns

### Matching VIP Customers
```typescript
const isVIP = matchesAttribute(
  task.attributes,
  'customer.vip',
  'true'
);
```

### Checking Worker Skills
```typescript
const hasSpanish = matchesAttribute(
  worker.attributes,
  'skills',
  'spanish'
);
```

### Verifying Complex Nested Properties
```typescript
const isPremiumTier = matchesAttribute(
  task.attributes,
  'customer.subscription.tier',
  'premium'
);
```

### Array of Tags
```typescript
const isUrgent = matchesAttribute(
  task.attributes,
  'tags',
  'urgent'
);
```

## Type Definitions

The utility works with the standard `AttributesQualificationConfig` interface:

```typescript
interface AttributesQualificationConfig {
  key: string;    // Can use dot notation: "customer.profile.tier"
  value: string;  // Expected value to match
}
```

## Best Practices

1. **Use dot notation for nested attributes:** Instead of `customer_vip`, use `customer.vip`
2. **Leverage array matching:** Store multi-value attributes as arrays (e.g., `skills`, `tags`)
3. **Be consistent:** Use the same attribute structure across your TaskRouter workflows and Flex configuration
4. **Test edge cases:** Always test with missing attributes, null values, and empty arrays
5. **Document your attributes:** Maintain documentation of your task and worker attribute schemas

## Limitations

- The `expectedValue` parameter must be a string
- For array matching, only exact string matches are supported (no partial matches or regex)
- Nested path traversal stops at the first `null` or `undefined` value

## Related Documentation

- [agent-automation feature](/feature-library/agent-automation)
- [dual-channel-recording feature](/feature-library/dual-channel-recording)
- [conditional-recording feature](/feature-library/conditional-recording)
