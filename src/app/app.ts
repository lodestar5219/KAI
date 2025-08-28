//Note: Reference is taken from https://github.com/hexadefence/keycloak-angular-17-example/tree/main
import { Component, effect, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { ClipboardModule, Clipboard } from '@angular/cdk/clipboard';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import Keycloak from 'keycloak-js';
import { inject } from '@angular/core';
import { KEYCLOAK_EVENT_SIGNAL, KeycloakEventType, ReadyArgs, typeEventArgs } from 'keycloak-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,
    CommonModule,
    MatGridListModule,
    MatButtonModule,
    MatListModule,
    MatCardModule,
    ClipboardModule,
    HttpClientModule,
    RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

  title = 'keycloak-angular-integration-example';
  private readonly kc = inject(Keycloak); //The inject(Keycloak) approach gives you direct access to the keycloak-js client without requiring an intermediate wrapper.
  private readonly http = inject(HttpClient);
  private readonly clipboard = inject(Clipboard);
  private readonly kcEvents = inject(KEYCLOAK_EVENT_SIGNAL);

  isAuthenticated = signal(false);
  roles = signal<string[]>([]);

  statusPanel: string = '';
  constructor() {
    // listen to keycloak events
    effect(() => {
      const e = this.kcEvents();

      if (e.type === KeycloakEventType.Ready) {
        this.isAuthenticated.set(typeEventArgs<ReadyArgs>(e.args));
      }

      if (e.type === KeycloakEventType.AuthLogout) {
        this.isAuthenticated.set(false);
        this.roles.set([]);
      }

      if (e.type === KeycloakEventType.AuthRefreshSuccess) {
        console.log('Token successfully refreshed ✅');
      }

      if (e.type === KeycloakEventType.TokenExpired) {
        console.warn('Token expired, consider refreshing ❗');
      }
    });
  }

  public login(): void {
    this.kc.login();
  }

  public logout(): void {
    this.kc.logout({ redirectUri: window.location.origin + '/' });
  }

  public isLoggedIn(): void {
    this.statusPanel = 'Is Logged In: ' + this.kc.authenticated;
  }

  public copyAccessTokenToClipboard(): void {
    if (this.kc.token) {
      this.clipboard.copy(this.kc.token);
      alert('Access token copied ✅');
    } else {
      alert('No token to copy ❌');
    }
  }

  public parseAccessToken(): void {
    if (!this.kc.token) {
      alert('No token available');
      return;
    }
    this.statusPanel = this.toJWTString(this.kc.token);
  }

  private toJWTString(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return jsonPayload;
  }
  public isTokenExpired(): void {

    /**
     * Extracted from Keycloak JS documentation
     * Returns true if the token has less than minValidity seconds 
     * left before it expires (minValidity is optional, if not specified 0 is used).
     */
    const expired = this.kc.isTokenExpired();
    this.statusPanel = `Token expired? ${expired}`;
    alert(`Token expired? ${expired}`);
  }

  /**
   * Extracted from Keycloak JS documentation
   * If the token expires within minValidity seconds 
   * (minValidity is optional, if not specified 5 is used) the token is refreshed. 
   * If -1 is passed as the minValidity, the token will be forcibly refreshed. 
   * If the session status iframe is enabled, the session status is also checked.
  */
  public async updateToken() {

  }

  public async sendHttpRequest() {

  }

  public showRoles() {

    // if need to check whether the user has a particular role
    //this.keycloakService.isUserInRole('angular-client-role')
    if (!this.kc.token) {
      alert('No token available');
      return;
    }
    const [, payload] = this.kc.token.split('.');
    const data = JSON.parse(atob(payload));

    const realmRoles: string[] = data?.realm_access?.roles || [];
    const clientRoles: string[] = data?.resource_access?.['angular-client']?.roles || [];

    const allRoles = [...realmRoles, ...clientRoles];
    this.statusPanel = `Roles: ${allRoles.join(', ') || 'none'}`
  }

  /** 
   * Please refer to the below documentation for more info
   * https://www.keycloak.org/docs/latest/securing_apps/index.html#_javascript_adapter
  **/

  public resetPanel() {
    this.statusPanel = '';
  }

}
