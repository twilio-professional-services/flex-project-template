/**
 * Gets a nested property value from an object using dot notation
 * @param obj - The object to retrieve the value from
 * @param path - The dot-notated path (e.g., 'conversations.outcome' or 'customer.profile.name')
 * @returns The value at the specified path, or undefined if not found
 */
export const getNestedProperty = (obj: any, path: string): any => {
  if (!obj || !path) {
    return undefined;
  }

  const keys = path.split('.');
  let current = obj;

  for (const key of keys) {
    if (current === null || current === undefined) {
      return undefined;
    }
    current = current[key];
  }

  return current;
};

/**
 * Checks if an attribute value matches the expected value
 * Supports:
 * - Simple equality check for primitive values
 * - Array containment check (if the attribute value is an array, checks if expectedValue is in the array)
 * - Nested attribute access using dot notation
 *
 * @param attributes - The object containing the attributes
 * @param attributeKey - The attribute key (supports dot notation for nested attributes)
 * @param expectedValue - The expected value to match against
 * @returns true if the attribute matches, false otherwise
 */
export const matchesAttribute = (attributes: any, attributeKey: string, expectedValue: string): boolean => {
  const actualValue = getNestedProperty(attributes, attributeKey);

  if (actualValue === undefined || actualValue === null) {
    return false;
  }

  // If the actual value is an array, check if the expected value is in the array
  if (Array.isArray(actualValue)) {
    return actualValue.includes(expectedValue);
  }

  // Otherwise, perform a simple equality check
  return actualValue === expectedValue;
};
