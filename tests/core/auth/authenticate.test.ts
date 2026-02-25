import { describe, expect, it } from 'vitest';
import {
  authenticate,
  DEFAULT_HTTP_AUTH_CONFIG,
  InsufficientScopeError,
  MissingBearerTokenError,
  ResendApiKeyTokenValidator,
  type TokenExtractor,
} from '../../../src/core/auth/index.js';

const extractor: TokenExtractor<{
  headers: { authorization?: string | string[] | undefined };
}> = {
  extract(context) {
    const authorization = context.headers.authorization;
    if (typeof authorization !== 'string') return null;
    const [scheme, token] = authorization.split(' ');
    if (scheme?.toLowerCase() !== 'bearer' || !token) return null;
    return token;
  },
};

describe('authenticate', () => {
  it('throws MissingBearerTokenError for absent token', async () => {
    await expect(
      authenticate(
        { headers: {} },
        extractor,
        new ResendApiKeyTokenValidator(),
        DEFAULT_HTTP_AUTH_CONFIG,
      ),
    ).rejects.toBeInstanceOf(MissingBearerTokenError);
  });

  it('returns principal for valid token', async () => {
    const principal = await authenticate(
      { headers: { authorization: 'Bearer re_test_abc' } },
      extractor,
      new ResendApiKeyTokenValidator(),
      DEFAULT_HTTP_AUTH_CONFIG,
    );

    expect(principal.subject).toBe('resend-api-key');
    expect(principal.token).toBe('re_test_abc');
    expect(principal.scopes).toContain('resend:full_access');
  });

  it('enforces required scopes from config', async () => {
    const principal = await authenticate(
      { headers: { authorization: 'Bearer re_test_abc' } },
      extractor,
      new ResendApiKeyTokenValidator(),
      {
        ...DEFAULT_HTTP_AUTH_CONFIG,
        requiredScopes: ['resend:full_access'],
      },
    );

    expect(principal.scopes).toContain('resend:full_access');
  });

  it('throws InsufficientScopeError when required scope is missing', async () => {
    await expect(
      authenticate(
        { headers: { authorization: 'Bearer re_test_abc' } },
        extractor,
        new ResendApiKeyTokenValidator(),
        {
          ...DEFAULT_HTTP_AUTH_CONFIG,
          requiredScopes: ['resend:admin'],
        },
      ),
    ).rejects.toBeInstanceOf(InsufficientScopeError);
  });
});
