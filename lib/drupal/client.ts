const DRUPAL_BASE_URL = process.env.DRUPAL_BASE_URL;

if (!DRUPAL_BASE_URL) {
  throw new Error("DRUPAL_BASE_URL environment variable is not set.");
}

export class DrupalApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "DrupalApiError";
  }
}

interface FetchOptions extends RequestInit {
  token?: string;
}

/**
 * Base fetch wrapper for all Drupal REST API calls.
 *
 * - Automatically sets `Content-Type: application/json`.
 * - Attaches `Authorization: Bearer <token>` when a token is provided.
 * - Throws a `DrupalApiError` for non-2xx responses, including the HTTP
 *   status code and any message extracted from the response body.
 */
export async function drupalFetch<T>(
  path: string,
  { token, headers, ...options }: FetchOptions = {},
): Promise<T> {
  const url = `${DRUPAL_BASE_URL}${path}`;

  const isJsonApi = path.startsWith("/jsonapi/");

  const mergedHeaders: Record<string, string> = {
    "Content-Type": isJsonApi ? "application/vnd.api+json" : "application/json",
    Accept: isJsonApi ? "application/vnd.api+json" : "application/json",
    ...(headers as Record<string, string>),
  };

  if (token) {
    mergedHeaders["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers: mergedHeaders,
  });

  if (!response.ok) {
    let message = `Drupal API error: ${response.status} ${response.statusText}`;
    try {
      const body = await response.json();
      // Drupal REST errors may surface under `message` or nested in `errors`
      if (body?.message) {
        message = body.message;
      } else if (Array.isArray(body?.errors) && body.errors[0]?.detail) {
        message = body.errors[0].detail;
      }
    } catch {
      // Response body is not JSON — keep the default message above
    }
    throw new DrupalApiError(response.status, message);
  }

  // 204 No Content — return void-compatible empty value
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
