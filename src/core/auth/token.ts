import type { IncomingMessage } from 'node:http';

export interface TokenExtractor<TContext> {
  extract(context: TContext): string | null;
}

export function parseBearerToken(authorizationHeader?: string): string | null {
  if (!authorizationHeader) return null;
  const [scheme, ...rest] = authorizationHeader.trim().split(/\s+/);
  if (!scheme || scheme.toLowerCase() !== 'bearer' || rest.length === 0) {
    return null;
  }
  const token = rest.join(' ').trim();
  return token || null;
}

export class BearerTokenExtractor
  implements TokenExtractor<Pick<IncomingMessage, 'headers'>>
{
  extract(context: Pick<IncomingMessage, 'headers'>): string | null {
    const authorization = context.headers.authorization;
    if (Array.isArray(authorization)) return null;
    return parseBearerToken(authorization);
  }
}
