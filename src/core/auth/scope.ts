export type AuthScope = string;

export function normalizeScope(scope: string): AuthScope {
  return scope.trim().toLowerCase();
}

export function normalizeScopes(scopes: readonly string[]): AuthScope[] {
  const unique = new Set<AuthScope>();
  for (const scope of scopes) {
    const normalized = normalizeScope(scope);
    if (normalized) unique.add(normalized);
  }
  return [...unique];
}

export function hasScope(
  grantedScopes: readonly string[],
  requiredScope: string,
): boolean {
  const granted = new Set(normalizeScopes(grantedScopes));
  return granted.has(normalizeScope(requiredScope));
}

export function hasAllScopes(
  grantedScopes: readonly string[],
  requiredScopes: readonly string[],
): boolean {
  const granted = new Set(normalizeScopes(grantedScopes));
  for (const scope of normalizeScopes(requiredScopes)) {
    if (!granted.has(scope)) return false;
  }
  return true;
}

export function hasAnyScope(
  grantedScopes: readonly string[],
  requiredScopes: readonly string[],
): boolean {
  const granted = new Set(normalizeScopes(grantedScopes));
  for (const scope of normalizeScopes(requiredScopes)) {
    if (granted.has(scope)) return true;
  }
  return false;
}
