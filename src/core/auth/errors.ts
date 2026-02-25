import { normalizeScopes } from './scope.js';

export type AuthErrorType = 'auth_error' | 'insufficient_scope';

export class AuthError extends Error {
  readonly statusCode: number;
  readonly jsonRpcCode: number;
  readonly type: AuthErrorType;
  readonly wwwAuthenticate?: string;

  constructor(args: {
    message: string;
    statusCode: number;
    jsonRpcCode: number;
    type: AuthErrorType;
    wwwAuthenticate?: string;
  }) {
    super(args.message);
    this.name = 'AuthError';
    this.statusCode = args.statusCode;
    this.jsonRpcCode = args.jsonRpcCode;
    this.type = args.type;
    this.wwwAuthenticate = args.wwwAuthenticate;
  }
}

export class MissingBearerTokenError extends AuthError {
  constructor(realm: string) {
    super({
      statusCode: 401,
      jsonRpcCode: -32002,
      type: 'auth_error',
      message: 'Unauthorized: provide Authorization: Bearer <resend-api-key>',
      wwwAuthenticate: `Bearer realm="${realm}"`,
    });
    this.name = 'MissingBearerTokenError';
  }
}

export class InsufficientScopeError extends AuthError {
  constructor(requiredScopes: readonly string[], realm: string) {
    const normalized = normalizeScopes(requiredScopes);
    const scopeValue = normalized.join(' ');
    super({
      statusCode: 403,
      jsonRpcCode: -32004,
      type: 'insufficient_scope',
      message: 'Forbidden: insufficient scope',
      wwwAuthenticate: `Bearer realm="${realm}", error="insufficient_scope", scope="${scopeValue}"`,
    });
    this.name = 'InsufficientScopeError';
  }
}
