import type { AuthScope } from './scope.js';

export interface HttpAuthConfig {
  bearerRealm: string;
  requiredScopes: AuthScope[];
}

export const DEFAULT_HTTP_AUTH_CONFIG: HttpAuthConfig = {
  bearerRealm: 'resend-mcp',
  requiredScopes: [],
};
