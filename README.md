# Shared Calendar

Calendar sharing app with Google Calendar integration.

## Stack

- **Frontend**: React + TypeScript + Vite + Tailwind + shadcn/ui
- **Backend**: Node.js + Express (minimal - health check only)
- **Auth**: Client-side OAuth via Google Identity Services

## Quick Start

```bash
# Install all dependencies
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

1. [Google Cloud Console](https://console.cloud.google.com/) → Create project
2. Enable **Google Calendar API**
3. Create **OAuth 2.0 Client ID** (Web application)
4. Add to **Authorized JavaScript origins**: `http://localhost:5173`
5. Copy **Client ID** → `client/.env` as `VITE_GOOGLE_CLIENT_ID`

## Project Structure

```
/client         Frontend (React + Vite)
/server         Backend (Express - minimal)
/shared         Shared TypeScript types
```

## Scripts

```bash
npm run dev              # Run both client & server
npm run build            # Build both
npm run dev:client       # Client only
npm run dev:server       # Server only
```

## Features

✅ Google Calendar OAuth & integration  
✅ View your calendar events  
✅ Create calendar invites (UI ready)  
🚧 Multi-user calendar sharing  
🚧 Multi-platform calendar integrations
🚧 Cross-timezone event synchronization  