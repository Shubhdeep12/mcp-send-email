import { normalizeScopes } from './scope.js';

export interface AuthPrincipal {
  subject: string;
  scopes: string[];
  token: string;
}

export interface TokenValidator {
  validate(token: string): Promise<AuthPrincipal>;
}

export class ResendApiKeyTokenValidator implements TokenValidator {
  async validate(token: string): Promise<AuthPrincipal> {
    return {
      subject: 'resend-api-key',
      scopes: normalizeScopes(['resend:full_access']),
      token,
    };
  }
}
