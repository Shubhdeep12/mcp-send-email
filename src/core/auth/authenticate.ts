import type { HttpAuthConfig } from './config.js';
import { InsufficientScopeError, MissingBearerTokenError } from './errors.js';
import { hasAllScopes } from './scope.js';
import type { TokenExtractor } from './token.js';
import type { AuthPrincipal, TokenValidator } from './validator.js';

export async function authenticate(
  context: { headers: { authorization?: string | string[] | undefined } },
  extractor: TokenExtractor<{
    headers: { authorization?: string | string[] | undefined };
  }>,
  validator: TokenValidator,
  authConfig: HttpAuthConfig,
): Promise<AuthPrincipal> {
  const token = extractor.extract(context);
  if (!token) {
    throw new MissingBearerTokenError(authConfig.bearerRealm);
  }

  const principal = await validator.validate(token);

  if (
    authConfig.requiredScopes.length > 0 &&
    !hasAllScopes(principal.scopes, authConfig.requiredScopes)
  ) {
    throw new InsufficientScopeError(
      authConfig.requiredScopes,
      authConfig.bearerRealm,
    );
  }

  return principal;
}
