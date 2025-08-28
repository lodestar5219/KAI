import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {
  provideKeycloak,
  includeBearerTokenInterceptor,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  createInterceptorCondition,
  type IncludeBearerTokenCondition,
} from 'keycloak-angular';

export const appConfig: ApplicationConfig = {
  providers: [
        provideKeycloak({              //provideKeycloak performs keycloak.init for you when initOptions are present.
      config: {
        url: 'http://localhost:8080',      // Keycloak base URL
        realm: 'KAI',                 // Your realm
        clientId: 'angular-client',     // Public client id
      },
      initOptions: {
        onLoad: 'login-required',
        silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
        pkceMethod: 'S256',
      },
      // (Optional) enable auto token refresh based on user activity:
      // features: [withAutoRefreshToken({ onInactivityTimeout: 'logout', sessionTimeout: 10 * 60_000 })],
    }),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes)
  ]
};
