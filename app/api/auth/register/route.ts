import { NextResponse } from "next/server";
import { encode, type JWT } from "next-auth/jwt";

function base64url(data: Uint8Array): string {
  return Buffer.from(data)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function randomBase64url(byteCount: number): string {
  const buf = new Uint8Array(byteCount);
  crypto.getRandomValues(buf);
  return base64url(buf);
}

async function sha256Base64url(plain: string): Promise<string> {
  const data = new TextEncoder().encode(plain);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return base64url(new Uint8Array(hash));
}

/**
 * GET /api/auth/register
 *
 * Generates PKCE + state using the same logic as NextAuth v4's own signin
 * handler, writes the JWE-encrypted cookies NextAuth expects, then redirects
 * the browser to Drupal's registration page with the OAuth destination:
 *
 *   {DRUPAL_BASE_URL}/user/register?destination=/oauth/authorize?{pkce_params}
 *
 * After the user registers and Drupal follows the destination, the browser
 * lands at /api/auth/callback/drupal — the same endpoint used by the normal
 * login flow.
 */
export async function GET() {
  const drupalBase = process.env.DRUPAL_BASE_URL!.replace(/\/$/, "");
  const clientId = process.env.DRUPAL_CLIENT_ID!;
  const nextAuthUrl = process.env.NEXTAUTH_URL!.replace(/\/$/, "");
  const secret = process.env.NEXTAUTH_SECRET!;
  const redirectUri = `${nextAuthUrl}/api/auth/callback/drupal`;

  // Generate PKCE pair and state — same method NextAuth uses via openid-client.
  const state = randomBase64url(32);
  const codeVerifier = randomBase64url(32);
  const codeChallenge = await sha256Base64url(codeVerifier);

  // Match NextAuth v4 cookie naming: __Secure- prefix on HTTPS, none on HTTP.
  const useSecureCookies = nextAuthUrl.startsWith("https://");
  const prefix = useSecureCookies ? "__Secure-" : "";
  const maxAge = 60 * 15; // 15 min — same as NextAuth's PKCE/state cookies

  const stateCookieName = `${prefix}next-auth.state`;
  const pkceCookieName = `${prefix}next-auth.pkce.code_verifier`;
  const callbackCookieName = `${prefix}next-auth.callback-url`;

  // NextAuth v4 stores state and code_verifier as JWE-encrypted tokens.
  // encode() uses HKDF(secret, cookieName) as the AES-GCM key and wraps
  // { value: rawValue } as the payload — matching exactly what checks.js reads.
  const [encryptedState, encryptedVerifier] = await Promise.all([
    encode({ token: { value: state } as unknown as JWT, secret, maxAge, salt: stateCookieName }),
    encode({ token: { value: codeVerifier } as unknown as JWT, secret, maxAge, salt: pkceCookieName }),
  ]);

  const oauthParams = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: "pokedex",
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  const destination = `/oauth/authorize?${encodeURIComponent(oauthParams.toString())}`;
  const registerUrl = `${drupalBase}/user/register?destination=${destination}`;

  // SameSite=none is required for cookies to survive the cross-site redirect
  // from Drupal back to the NextAuth callback. Requires Secure on HTTPS.
  const sharedOpts = {
    httpOnly: true,
    sameSite: (useSecureCookies ? "none" : "lax") as "none" | "lax",
    path: "/",
    secure: useSecureCookies,
  };

  const response = NextResponse.redirect(registerUrl);
  response.cookies.set(stateCookieName, encryptedState, { ...sharedOpts, maxAge });
  response.cookies.set(pkceCookieName, encryptedVerifier, { ...sharedOpts, maxAge });
  // Tell NextAuth where to land the user after the OAuth callback completes.
  response.cookies.set(callbackCookieName, "/pokedex", sharedOpts);

  return response;
}
