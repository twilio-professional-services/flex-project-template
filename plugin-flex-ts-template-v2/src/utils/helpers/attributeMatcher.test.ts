import { getNestedProperty, matchesAttribute } from './attributeMatcher';

describe('utils/helpers/attributeMatcher', () => {
  describe('getNestedProperty', () => {
    it('should return value for simple property', () => {
      const obj = { name: 'John' };
      expect(getNestedProperty(obj, 'name')).toBe('John');
    });

    it('should return value for nested property', () => {
      const obj = { user: { profile: { name: 'John' } } };
      expect(getNestedProperty(obj, 'user.profile.name')).toBe('John');
    });

    it('should return undefined for non-existent property', () => {
      const obj = { name: 'John' };
      expect(getNestedProperty(obj, 'age')).toBeUndefined();
    });

    it('should return undefined for non-existent nested property', () => {
      const obj = { user: { name: 'John' } };
      expect(getNestedProperty(obj, 'user.profile.name')).toBeUndefined();
    });

    it('should handle null values in path', () => {
      const obj = { user: null };
      expect(getNestedProperty(obj, 'user.profile.name')).toBeUndefined();
    });

    it('should return array values', () => {
      const obj = { skills: ['python', 'javascript'] };
      expect(getNestedProperty(obj, 'skills')).toEqual(['python', 'javascript']);
    });

    it('should return nested array values', () => {
      const obj = { user: { skills: ['python', 'javascript'] } };
      expect(getNestedProperty(obj, 'user.skills')).toEqual(['python', 'javascript']);
    });
  });

  describe('matchesAttribute', () => {
    it('should match simple string attribute', () => {
      const attributes = { type: 'voice' };
      expect(matchesAttribute(attributes, 'type', 'voice')).toBe(true);
    });

    it('should not match different string attribute', () => {
      const attributes = { type: 'voice' };
      expect(matchesAttribute(attributes, 'type', 'chat')).toBe(false);
    });

    it('should match nested string attribute', () => {
      const attributes = { conversations: { outcome: 'resolved' } };
      expect(matchesAttribute(attributes, 'conversations.outcome', 'resolved')).toBe(true);
    });

    it('should not match different nested string attribute', () => {
      const attributes = { conversations: { outcome: 'resolved' } };
      expect(matchesAttribute(attributes, 'conversations.outcome', 'unresolved')).toBe(false);
    });

    it('should match value in array', () => {
      const attributes = { skills: ['python', 'javascript', 'typescript'] };
      expect(matchesAttribute(attributes, 'skills', 'javascript')).toBe(true);
    });

    it('should not match value not in array', () => {
      const attributes = { skills: ['python', 'javascript'] };
      expect(matchesAttribute(attributes, 'skills', 'ruby')).toBe(false);
    });

    it('should match value in nested array', () => {
      const attributes = { user: { skills: ['python', 'javascript', 'typescript'] } };
      expect(matchesAttribute(attributes, 'user.skills', 'typescript')).toBe(true);
    });

    it('should return false for non-existent attribute', () => {
      const attributes = { type: 'voice' };
      expect(matchesAttribute(attributes, 'channel', 'voice')).toBe(false);
    });

    it('should return false for null attribute', () => {
      const attributes = { type: null };
      expect(matchesAttribute(attributes, 'type', 'voice')).toBe(false);
    });

    it('should return false for undefined attribute', () => {
      const attributes = { type: undefined };
      expect(matchesAttribute(attributes, 'type', 'voice')).toBe(false);
    });

    it('should match deeply nested attributes', () => {
      const attributes = {
        customer: {
          profile: {
            subscription: {
              tier: 'premium',
            },
          },
        },
      };
      expect(matchesAttribute(attributes, 'customer.profile.subscription.tier', 'premium')).toBe(true);
    });

    it('should match numeric values as strings', () => {
      const attributes = { priority: '1' };
      expect(matchesAttribute(attributes, 'priority', '1')).toBe(true);
    });

    it('should handle empty string values', () => {
      const attributes = { note: '' };
      expect(matchesAttribute(attributes, 'note', '')).toBe(true);
      expect(matchesAttribute(attributes, 'note', 'something')).toBe(false);
    });

    it('should handle empty arrays', () => {
      const attributes = { tags: [] };
      expect(matchesAttribute(attributes, 'tags', 'anything')).toBe(false);
    });

    it('should be case-sensitive', () => {
      const attributes = { status: 'Active' };
      expect(matchesAttribute(attributes, 'status', 'Active')).toBe(true);
      expect(matchesAttribute(attributes, 'status', 'active')).toBe(false);
    });

    it('should match first item in array', () => {
      const attributes = { tags: ['first', 'second', 'third'] };
      expect(matchesAttribute(attributes, 'tags', 'first')).toBe(true);
    });

    it('should match last item in array', () => {
      const attributes = { tags: ['first', 'second', 'third'] };
      expect(matchesAttribute(attributes, 'tags', 'third')).toBe(true);
    });

    it('should handle boolean values stored as strings', () => {
      const attributes = { enabled: 'true', disabled: 'false' };
      expect(matchesAttribute(attributes, 'enabled', 'true')).toBe(true);
      expect(matchesAttribute(attributes, 'disabled', 'false')).toBe(true);
    });

    it('should handle objects in arrays', () => {
      const attributes = { items: [{ id: 1 }, { id: 2 }] };
      // Should not match objects (objects are not strings)
      expect(matchesAttribute(attributes, 'items', '{"id":1}')).toBe(false);
    });

    it('should handle multiple levels of nesting with arrays', () => {
      const attributes = {
        level1: {
          level2: {
            tags: ['a', 'b', 'c'],
          },
        },
      };
      expect(matchesAttribute(attributes, 'level1.level2.tags', 'b')).toBe(true);
      expect(matchesAttribute(attributes, 'level1.level2.tags', 'd')).toBe(false);
    });
  });
});
