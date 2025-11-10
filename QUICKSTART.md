# Quick Start Guide

Get the Shared Calendar app running in under 10 minutes!

## Prerequisites

- Node.js 14+ installed
- A Google account
- 10 minutes of your time

## Step 1: Clone and Install (2 minutes)

```bash
# Clone the repository
git clone <repository-url>
cd shared-calendar

# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

## Step 2: Google Cloud Setup (5 minutes)

### Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name it "Shared Calendar" and click "Create"

### Enable Google Calendar API

1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google Calendar API"
3. Click on it and press "Enable"

### Create OAuth Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - User Type: External
   - App name: "Shared Calendar"
   - User support email: Your email
   - Developer contact: Your email
   - Save and continue through the scopes and test users (no changes needed)
4. Back to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Application type: "Web application"
6. Name: "Shared Calendar Web Client"
7. Authorized redirect URIs: Add `http://localhost:5000/auth/google/callback`
8. Click "Create"
9. **Copy** your Client ID and Client Secret (you'll need these!)

## Step 3: Configure the App (2 minutes)

### Backend Configuration

1. In the project root, copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your favorite editor:
   ```bash
   nano .env
   # or
   vim .env
   # or
   code .env
   ```

3. Replace the values:
   ```env
   PORT=5000
   NODE_ENV=development
   
   # Paste your Google OAuth credentials here
   GOOGLE_CLIENT_ID=your_actual_client_id_here
   GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
   GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
   
   # Generate a random string for session secret
   SESSION_SECRET=your_random_secret_here_at_least_32_characters
   
   CLIENT_URL=http://localhost:3000
   ```

   **Tip**: Generate a secure session secret:
   ```bash
   # On Linux/Mac:
   openssl rand -base64 32
   
   # Or use any random string generator
   ```

### Frontend Configuration

1. In the `client` directory, create `.env` file:
   ```bash
   echo "REACT_APP_API_URL=http://localhost:5000" > client/.env
   ```

## Step 4: Run the App (1 minute)

### Option A: Run Backend and Frontend Separately

**Terminal 1 - Backend:**
```bash
npm start
```
You should see: `Server is running on port 5000`

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```
The browser should automatically open to `http://localhost:3000`

### Option B: Using a Process Manager (Alternative)

Install `concurrently` globally:
```bash
npm install -g concurrently
```

Add to root `package.json`:
```json
"scripts": {
  "dev:both": "concurrently \"npm start\" \"cd client && npm start\""
}
```

Then run:
```bash
npm run dev:both
```

## Step 5: Test the App (1 minute)

1. Open `http://localhost:3000` in your browser
2. Click "Sign in with Google"
3. Choose your Google account
4. Grant calendar permissions
5. You should see the dashboard with your calendar!

## Testing with Multiple Users

To test the sharing feature, you need multiple users:

1. Open the app in an incognito/private window
2. Sign in with a different Google account
3. In both windows, click "Manage Sharing"
4. Toggle sharing for each user
5. Watch the calendars appear in different colors!

## Troubleshooting

### "Error: redirect_uri_mismatch"

**Problem**: The OAuth redirect URI doesn't match.

**Solution**: 
- Make sure `.env` has: `GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback`
- In Google Cloud Console, verify the Authorized redirect URI is exactly: `http://localhost:5000/auth/google/callback`
- No trailing slashes, must match exactly

### "Cannot GET /auth/google/callback"

**Problem**: Backend server is not running.

**Solution**: Start the backend server with `npm start` from the project root.

### "Network Error" or CORS Issues

**Problem**: Frontend can't connect to backend.

**Solution**:
- Ensure backend is running on port 5000
- Check `.env` has `CLIENT_URL=http://localhost:3000`
- Check `client/.env` has `REACT_APP_API_URL=http://localhost:5000`

### Port Already in Use

**Problem**: Port 3000 or 5000 is already in use.

**Solution**:
```bash
# Find and kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Find and kill process using port 5000
lsof -ti:5000 | xargs kill -9

# Or use different ports by updating .env files
```

### Calendar Events Not Showing

**Problem**: Calendar appears empty.

**Solution**:
- Ensure you have events in your Google Calendar
- Check browser console for errors
- Verify Google Calendar API is enabled
- Check OAuth scopes include calendar permissions

## What's Next?

### Explore the Features

- ✅ **Share Your Calendar**: Click "Manage Sharing" and select users
- ✅ **View Shared Calendars**: See other users' busy times in different colors
- ✅ **Create Meetings**: Click on a time slot to create and send invitations
- ✅ **Check Privacy**: Notice that event details are hidden - only busy blocks show!

### Customize the App

- Change colors in `client/src/components/Dashboard.js` (USER_COLORS array)
- Modify the calendar view (month/week/day) in Dashboard component
- Adjust rate limiting in `server/index.js`
- Update branding and styling in CSS files

### Deploy to Production

See [README.md](README.md) for production deployment instructions.

## Need Help?

- Check the [README.md](README.md) for detailed documentation
- Review [ARCHITECTURE.md](ARCHITECTURE.md) for system design
- Open an issue on GitHub
- Check Google Calendar API documentation

## Common Commands

```bash
# Start backend (development with auto-reload)
npm run dev

# Start frontend
cd client && npm start

# Build frontend for production
cd client && npm run build

# Install all dependencies (root + client)
npm run install-all

# Check for dependency updates
npm outdated
cd client && npm outdated
```

## Security Notes for Development

⚠️ **Important**: 
- Never commit `.env` files to git
- Keep your `GOOGLE_CLIENT_SECRET` private
- Use strong `SESSION_SECRET` (32+ characters)
- In production, always use HTTPS
- Review OAuth consent screen settings before going public

## Success Checklist

- [ ] Node.js installed and working
- [ ] Google Cloud project created
- [ ] Google Calendar API enabled
- [ ] OAuth credentials created and copied
- [ ] `.env` file configured with real credentials
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Successfully logged in with Google
- [ ] Calendar displaying on dashboard
- [ ] Tested with second user (optional)

Congratulations! You're all set up. Happy scheduling! 🎉
