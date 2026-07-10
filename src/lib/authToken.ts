// Access tokens are never persisted (no localStorage, no cookie) — only ever held here, in
// memory, for the lifetime of the tab. This bounds the blast radius of an XSS payload to
// "can use the current session" rather than "can read out a long-lived credential"; the
// refresh token that could mint new access tokens lives in an httpOnly cookie the JS
// runtime can't see at all. A fresh page load starts with this empty and repopulates it via
// a silent POST /auth/refresh, which the browser sends the refresh cookie for automatically.
let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
}
