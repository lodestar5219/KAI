[1] User opens Angular app
      |
      v
Angular App (keycloak-angular)
  -> calls keycloak.init({ onLoad: 'login-required' })
      |
      v
[2] Redirect to Keycloak Login Page
      |
      v
User enters credentials (username/password)
      |
      v
Keycloak Authorization Server
  -> validates credentials
  -> generates an Authorization Code
      |
      v
[3] Redirects back to Angular app
    URL looks like: https://app.com/?code=XYZ&state=ABC
      |
      v
Angular app (keycloak-js)
  -> takes the `code`
  -> calls Keycloak /token endpoint
      |
      v
Keycloak Authorization Server
  -> returns:
       - Access Token (JWT)
       - Refresh Token
       - ID Token (optional)
      |
      v
[4] keycloak-js stores tokens
  - in memory (`kc.token`, `kc.refreshToken`)
  - optionally in sessionStorage/localStorage
      |
      v
Angular App
  -> you can now use:
       this.kc.token        // Access Token
       this.kc.refreshToken // Refresh Token
       this.kc.idToken      // ID Token



Modern way (Authorization Code Flow with PKCE)

-> After user logs in, Keycloak sends only a short-lived "code" to the frontend.
-> The frontend then exchanges that code securely with the Keycloak server for real tokens (Access, Refresh, ID).
-> This exchange happens in the background using HTTPS, and with PKCE (Proof Key for Code Exchange), which ensures that:
-> Only your app (not an attacker) can exchange the code
-> Even if someone steals the code, they can’t use it without the PKCE verifier