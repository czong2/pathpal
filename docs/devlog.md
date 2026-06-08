# DevLog

## 2026-06-07 Project Setup

### Completed

- Set up frontend and backend projects
- Added the PathPal logo and homepage
- Integrated Cloudflare Turnstile verification

### Next Steps

- Implement authentication

## 2026-06-08 Authentication Flow

### Completed

- Added backend Turnstile verification with session-based access checks
- Added GitHub OAuth login flow
- Stored GitHub users in the database by `github_id`
- Added route guards for Turnstile and login-only pages
- Added a simple logged-in profile test page

### Next Steps

- Build the real logged-in dashboard
- Add logout support
- Improve session and user state handling on the frontend
