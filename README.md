# Shared Calendar

This is a calendar sharing application with Google Calendar integration for viewing team availability and scheduling meetings.

## Stack

- **Frontend**: React + TypeScript + Vite + Tailwind + shadcn/ui
- **Backend**: Node.js + Express (minimal - health check only)
- **Auth**: Client-side OAuth via Google Identity Services

## Quick Start

```bash
# Install root dependencies (concurrently, etc.)
npm install

# Install client & server dependencies
npm run install:all

# Set up Google OAuth (client only)
cp client/.env.example client/.env
# Add your GOOGLE_CLIENT_ID to client/.env

# Start dev servers
npm run dev
# → Client: http://localhost:5173
# → Server: http://localhost:3001
```

## Google OAuth Setup

1. [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials
2. Create **OAuth 2.0 Client ID** (Web application)
   - Add **Authorized JavaScript origins**: `http://localhost:5173`
   - Authorized redirect URIs can be left blank for client-side Google Identity button
3. Enable **Google Calendar API** in APIs & Services
4. Configure OAuth consent screen
   - Add your account as a test user while in testing mode
   - For scopes beyond basic profile (e.g., Calendar API), additional verification may be required for sensitive scopes
5. Copy **Client ID** → `client/.env` as `VITE_GOOGLE_CLIENT_ID`

**Note**: This app uses client-side OAuth via Google Identity Services. The ID token provides basic profile information. For full Google Calendar API access with refresh tokens, a server-side component would be needed to securely store credentials.

## Project Structure

```
/client         Frontend (React + Vite)
/server         Backend (Express - minimal)
/shared         Shared TypeScript types
```

## Features

✅ Google Calendar OAuth & integration  
✅ View your calendar events  
🚧 Create calendar invites  
🚧 Multi-user calendar sharing  
🚧 Multi-platform calendar integrations  
🚧 Cross-timezone event synchronization