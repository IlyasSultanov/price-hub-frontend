import { Injectable, computed, signal } from '@angular/core';
import Keycloak from 'keycloak-js';

import { environment } from '@env/environment';
import { Role } from '@core/enums';
import { CurrentUser } from '@core/models/auth.model';

/**
 * Thin wrapper around keycloak-js. The browser talks to Keycloak directly
 * (Authorization Code + PKCE, public client) — the backend never sees a
 * password and only validates the resulting Bearer token.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly keycloak = new Keycloak({
    url: environment.keycloak.url,
    realm: environment.keycloak.realm,
    clientId: environment.keycloak.clientId,
  });

  private readonly authenticated = signal(false);

  readonly isAuthenticated = computed(() => this.authenticated());

  readonly currentUser = computed<CurrentUser | null>(() => {
    if (!this.authenticated()) return null;
    const parsed = this.keycloak.tokenParsed;
    if (!parsed) return null;
    const tokenRoles: string[] = parsed['realm_access']?.roles ?? [];

    const roles = (Object.values(Role) as Role[]).filter((r) => tokenRoles.includes(r));
    const displayPriority: Role[] = [Role.SystemAdmin, Role.CatalogAdmin, Role.SupplierManager];
    const role = displayPriority.find((r) => roles.includes(r)) ?? null;

    return {
      username: parsed['preferred_username'] ?? parsed['sub'],
      role,
      roles,
      supplierId: (parsed['supplier_id'] as string | undefined) ?? null,
    };
  });

  /** Called once from an app initializer, before the router starts navigating. */
  async init(): Promise<void> {
    const authenticated = await this.keycloak.init({
      onLoad: 'login-required',
      checkLoginIframe: false,
      pkceMethod: 'S256',
    });
    this.authenticated.set(authenticated);

    this.keycloak.onAuthSuccess = () => this.authenticated.set(true);
    this.keycloak.onAuthLogout = () => this.authenticated.set(false);
    this.keycloak.onTokenExpired = () => {
      this.keycloak.updateToken(30).catch(() => this.authenticated.set(false));
    };
  }

  /** Full-page redirect to Keycloak's hosted login — there is no in-app login form. */
  login(): void {
    this.keycloak.login();
  }

  logout(): void {
    this.keycloak.logout({ redirectUri: window.location.origin });
  }

  /** Refreshes the token first if it's within 30s of expiry, then returns it. */
  async getToken(): Promise<string | null> {
    if (!this.authenticated()) return null;
    try {
      await this.keycloak.updateToken(30);
    } catch {
      this.authenticated.set(false);
      return null;
    }
    return this.keycloak.token ?? null;
  }
}
