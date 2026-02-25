import { describe, expect, it } from 'vitest';
import {
  BearerTokenExtractor,
  parseBearerToken,
} from '../../../src/core/auth/token.js';

describe('parseBearerToken', () => {
  it('returns token for valid Bearer header', () => {
    expect(parseBearerToken('Bearer re_test_123')).toBe('re_test_123');
  });

  it('accepts case-insensitive bearer scheme', () => {
    expect(parseBearerToken('bEaReR re_test_123')).toBe('re_test_123');
  });

  it('returns null for missing or malformed headers', () => {
    expect(parseBearerToken()).toBeNull();
    expect(parseBearerToken('Token abc')).toBeNull();
    expect(parseBearerToken('Bearer')).toBeNull();
    expect(parseBearerToken('Bearer    ')).toBeNull();
  });
});

describe('BearerTokenExtractor', () => {
  it('extracts from request-like headers object', () => {
    const extractor = new BearerTokenExtractor();
    expect(
      extractor.extract({
        headers: { authorization: 'Bearer re_test_456' },
      }),
    ).toBe('re_test_456');
  });

  it('returns null for array authorization headers', () => {
    const extractor = new BearerTokenExtractor();
    expect(
      extractor.extract({
        headers: { authorization: ['Bearer a', 'Bearer b'] },
      }),
    ).toBeNull();
  });
});
