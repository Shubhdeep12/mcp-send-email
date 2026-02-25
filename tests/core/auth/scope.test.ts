import { describe, expect, it } from 'vitest';
import {
  hasAllScopes,
  hasAnyScope,
  hasScope,
  normalizeScope,
  normalizeScopes,
} from '../../../src/core/auth/scope.js';

describe('scope helpers', () => {
  it('normalizes and de-duplicates scopes', () => {
    expect(normalizeScope('  SEND:Email  ')).toBe('send:email');
    expect(
      normalizeScopes([' send:email ', 'SEND:EMAIL', 'read:status']),
    ).toEqual(['send:email', 'read:status']);
  });

  it('checks single scope', () => {
    expect(hasScope(['send:email', 'read:status'], 'SEND:EMAIL')).toBe(true);
    expect(hasScope(['read:status'], 'send:email')).toBe(false);
  });

  it('checks all scopes', () => {
    expect(hasAllScopes(['a', 'b', 'c'], ['a', 'c'])).toBe(true);
    expect(hasAllScopes(['a'], ['a', 'b'])).toBe(false);
  });

  it('checks any scope', () => {
    expect(hasAnyScope(['a', 'b'], ['x', 'b'])).toBe(true);
    expect(hasAnyScope(['a'], ['x', 'y'])).toBe(false);
  });
});
