---
title: Attribute matcher
---

The `attributeMatcher` utility provides a powerful, consistent way to match task and worker attributes across multiple features in your Flex plugin.

## Overview

Located at `plugin-flex-ts-template-v2/src/utils/helpers/attributeMatcher.ts`, this utility provides two main functions for attribute matching with support for nested attributes and array values.

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

const taskAttributes = {
  customer: {
    profile: {
      tier: 'premium'
    }
  }
};

getNestedProperty(taskAttributes, 'customer.profile.tier'); // Returns: 'premium'
getNestedProperty(taskAttributes, 'customer.name'); // Returns: undefined
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
const attrs3 = { languages: ['english', 'spanish', 'french'] };
matchesAttribute(attrs3, 'languages', 'spanish'); // Returns: true
matchesAttribute(attrs3, 'languages', 'german'); // Returns: false

// Combined nested and array matching
const attrs4 = {
  routing: {
    skills: ['sales', 'support']
  }
};
matchesAttribute(attrs4, 'routing.skills', 'sales'); // Returns: true
```

## Usage

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
  'routing.skills',
  'spanish'
);
```

## Limitations

- The `expectedValue` parameter must be a string
- For array matching, only exact string matches are supported (no partial matches or regex)
- Nested path traversal stops at the first `null` or `undefined` value
