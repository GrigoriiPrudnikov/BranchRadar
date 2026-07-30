Here's every HTTP request in the whole lifecycle, in order, with exactly what's sent and received on each one.

## Onboarding phase

**Request 1 — Browser → GitHub**
- Browser navigates to `github.com/apps/{slug}/installations/new`
- Sends: nothing of yours, just a normal page navigation
- Receives: GitHub's install picker UI

**Request 2 — GitHub → Browser (redirect)**
- After the user installs, GitHub redirects the browser to your Setup URL
- Sends: `installation_id` and `setup_action` as query params on the redirect URL
- Receives: nothing — this is GitHub telling the browser where to go next

**Request 3 — Browser → Next.js**
- Browser lands on `app.yourdomain.com/api/github/setup?installation_id=...`
- Sends: the query params from request 2
- Receives: nothing yet — Next.js is now processing server-side

**Request 4 — Next.js → Go (server-to-server)**
- Next.js's route handler calls your internal Go endpoint
- Sends: `installation_id` in the request body/params, plus your internal shared-secret/auth for this private endpoint
- Receives: a **session JWT** in the response body (assuming verification succeeded)

*Inside request 4, Go itself makes two more requests before responding:*

**Request 4a — Go → GitHub**
- Go calls `GET /app/installations/{installation_id}`
- Sends: `Authorization: Bearer <App JWT>` — the App JWT Go just signed locally with the `.pem` key
- Receives: installation details (account, permissions, repo selection) if valid, or 404/401 if not

**Request 4b — Go → GitHub** *(only if you fetch the installation token eagerly here — optional, see earlier note)*
- Go calls `POST /app/installations/{installation_id}/access_tokens`
- Sends: `Authorization: Bearer <same App JWT>`
- Receives: an **installation access token** (1hr expiry) — only needed now if you're pre-loading data; otherwise skip this and do it lazily later

**Request 5 — Next.js → Browser (redirect + Set-Cookie)**
- Next.js responds to the browser's original request 3
- Sends: `Set-Cookie: session=<session JWT>; HttpOnly; Secure; SameSite=Lax`, plus a redirect to `/dashboard`
- Receives: nothing — this is Next.js's response

## Dashboard / operating phase (happens on every subsequent page load or action)

**Request 6 — Browser → Next.js**
- Browser requests dashboard data, e.g. `GET /api/branches`
- Sends: the `session` cookie automatically (browser does this for you, same-origin)
- Receives: JSON branch data (once the chain below completes)

**Request 7 — Next.js → Go**
- Next.js's route handler forwards the request to Go
- Sends: the **session JWT** (extracted from the cookie), typically as `Authorization: Bearer <session JWT>`
- Receives: branch data or an error if the session is invalid/expired

*Inside request 7, Go does its own work before responding:*

**Request 7a — Go → GitHub** *(only if Go doesn't already have a cached, unexpired installation token — you said no DB, so this likely happens on every request, or you keep a short-lived in-memory cache)*
- Go signs a **fresh App JWT**, calls `POST /app/installations/{id}/access_tokens`
- Sends: `Authorization: Bearer <App JWT>`
- Receives: **installation access token**

**Request 7b — Go → GitHub**
- Go calls `GET /repos/{owner}/{repo}/branches`
- Sends: `Authorization: Bearer <installation access token>`
- Receives: branch list with last-commit data

**Request 7 response — Go → Next.js**
- Sends: the processed branch list (with staleness computed) as JSON
- 

**Request 6 response — Next.js → Browser**
- Sends: the same JSON, passed through
- Browser renders it

## Delete action follows the identical pattern to requests 6/7, just swapping the GitHub call for `DELETE /repos/{owner}/{repo}/git/refs/heads/{branch}` in place of 7b.

## Summary of who creates which token

| Token | Created by | Signed with | Sent to |
|---|---|---|---|
| App JWT | Go, fresh each time it's needed | `.pem` private key | GitHub only, in `Authorization` headers |
| Installation access token | GitHub, issued in response to an App JWT | N/A (GitHub-issued, opaque) | Go holds it, sends to GitHub API calls |
| Session JWT | Go, once per successful verify | Your own session secret | Next.js → sets as browser cookie; browser sends it back on every request |

The App JWT and installation token never leave Go. The session JWT never reaches GitHub. The browser only ever holds the session JWT.
