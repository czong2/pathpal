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

## 2026-06-09 Logged-In App Shell

### Completed

- Added a side navigation for logged-in pages
- Added logout without resetting Turnstile verification
- Sketched frontend pages for Profile, Posts, Groups, Messages, and AI Coach

### Next Steps

- Add backend integration for agent creation

## 2026-06-13 Direction Change

### Completed

- Changed the product direction to local AI-assisted PDF learning
- Removed the social features from the app concept
- Simplified the frontend around projects, PDF upload, and daily tasks

### Next Steps

- Build project storage and PDF upload
- Add the local AI agent flow after the frontend is stable

## 2026-06-14 Project Creation and Agent Chat

### Completed

- Built the project creation API
- Refined the frontend agent chat page

### Next Steps

- Build APIs to persist chat messages and uploaded project files
