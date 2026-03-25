import { drupalFetch, DrupalApiError } from "./client";

/**
 * Register a new Drupal user account.
 *
 * Drupal REST endpoint: POST /user/register?_format=json
 *
 * The endpoint is provided by Drupal's core REST module with the
 * "user_registration" resource enabled and anonymous POST access granted.
 * Drupal validates uniqueness of the email/username and enforces any
 * configured password policies before creating the account.
 *
 * On success Drupal returns the new user entity (201 Created); we discard it
 * here because the caller should subsequently authenticate via fetchAccessToken.
 *
 * Drupal validation errors arrive as an array of constraint violations under
 * the `errors` key (JSON:API style) or as a plain `message` string (REST style).
 * Both are extracted and rethrown as human-readable messages.
 */
export async function registerUser(
  name: string,
  email: string,
  password: string,
): Promise<void> {
  try {
    await drupalFetch<unknown>("/user/register?_format=json", {
      method: "POST",
      body: JSON.stringify({
        name: [{ value: name }],
        mail: [{ value: email }],
        pass: [{ value: password }],
      }),
    });
  } catch (error) {
    if (error instanceof DrupalApiError) {
      // Re-throw with a message that is safe to surface in UI
      throw new Error(error.message);
    }
    throw error;
  }
}
