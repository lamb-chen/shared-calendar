# Shared Calendar

A web application that lets users automatically share their calendars with each other using OAuth 2.0 authentication. View others' calendars as color-coded "busy" blocks without seeing event details, protecting privacy while enabling efficient coordination.

## Features

- 🔐 **OAuth 2.0 Authentication** - Secure login via Google Calendar
- 📅 **Calendar Sharing** - Share your availability with selected users
- 🎨 **Color-Coded Busy Blocks** - Each user's calendar displayed in a different color
- 🔒 **Privacy Protection** - Event details are hidden, only showing busy/free times
- 📧 **Meeting Invitations** - Select time slots and send invites directly to calendar platforms
- 👥 **Multi-User Support** - Manage sharing permissions per user
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Architecture

- **Backend**: Node.js + Express
- **Frontend**: React + React Big Calendar
- **Authentication**: Passport.js with Google OAuth 2.0
- **API**: Google Calendar API for fetching events and creating invitations

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A Google Cloud Platform account

## Setup Instructions

### 1. Google Cloud Platform Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Calendar API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Calendar API"
   - Click "Enable"
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:5000/auth/google/callback` (for development)
     - Add your production URL when deploying
   - Save the **Client ID** and **Client Secret**

### 2. Backend Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd shared-calendar
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

4. Configure the `.env` file with your credentials:
   ```env
   PORT=5000
   NODE_ENV=development
   
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
   
   SESSION_SECRET=your_random_session_secret_here
   CLIENT_URL=http://localhost:3000
   ```

### 3. Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the client directory:
   ```bash
   echo "REACT_APP_API_URL=http://localhost:5000" > .env
   ```

### 4. Running the Application

#### Development Mode

1. Start the backend server (from root directory):
   ```bash
   npm start
   # or for auto-reload:
   npm run dev
   ```

2. In a separate terminal, start the frontend (from client directory):
   ```bash
   cd client
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

#### Production Build

1. Build the frontend:
   ```bash
   cd client
   npm run build
   ```

2. Configure your backend to serve the static files
3. Deploy to your hosting platform

## Usage

### Getting Started

1. **Sign In**: Click "Sign in with Google" on the login page
2. **Grant Permissions**: Allow the app to access your Google Calendar
3. **View Your Calendar**: You'll see your busy blocks on the calendar view

### Sharing Your Calendar

1. Click **"Manage Sharing"** in the dashboard
2. Select users you want to share your calendar with
3. Click **"Share"** next to each user
4. Their view will now show your busy times as colored blocks

### Creating Meeting Invitations

1. Click on a time slot in the calendar
2. Fill in the meeting details:
   - **Title** (required)
   - **Description** (optional)
   - **Attendees** (select from shared users)
3. Click **"Send Invitation"**
4. Invitations are sent directly to attendees' Google Calendars

### Viewing Shared Calendars

- Your calendar appears in dark blue
- Each shared calendar appears in a different color
- Hover over the legend to see which color represents which user
- All events show as "Busy" blocks without revealing details

## API Endpoints

### Authentication
- `GET /auth/google` - Initiate Google OAuth flow
- `GET /auth/google/callback` - OAuth callback handler
- `GET /auth/status` - Check authentication status
- `GET /auth/logout` - Logout user

### Calendar
- `GET /api/calendar/busy-blocks` - Get current user's busy blocks
- `GET /api/calendar/shared` - Get shared calendars from other users
- `GET /api/calendar/users` - Get list of all users
- `POST /api/calendar/share` - Share calendar with a user
- `POST /api/calendar/unshare` - Unshare calendar with a user
- `POST /api/calendar/invite` - Create a meeting invitation

## Privacy & Security

- **No Event Details Stored**: The app doesn't store any calendar event details
- **OAuth 2.0**: Secure authentication through Google
- **Selective Sharing**: Users control who can see their availability
- **Session Management**: Secure session handling with encrypted cookies
- **Privacy First**: Only busy/free time is shared, never event titles or descriptions

## Development Notes

### In-Memory Storage
Currently, user data is stored in memory for simplicity. For production:
- Implement a database (MongoDB, PostgreSQL, etc.)
- Store user profiles and sharing preferences
- Add token refresh logic for long-lived sessions

### Future Enhancements
- Multiple calendar platform support (Outlook, Apple Calendar)
- Recurring meeting templates
- Calendar event notifications
- Mobile app
- Team/organization features
- Time zone handling improvements

## Troubleshooting

### OAuth Error: redirect_uri_mismatch
- Ensure the callback URL in `.env` matches exactly with Google Cloud Console
- Check that the URL includes the correct protocol (http/https)

### Calendar Events Not Loading
- Verify Google Calendar API is enabled in Google Cloud Console
- Check that OAuth scopes include calendar permissions
- Ensure access token is valid (check console logs)

### CORS Errors
- Verify `CLIENT_URL` in `.env` matches your frontend URL
- Check that `withCredentials: true` is set in API calls

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Support

For issues and questions, please open an issue on GitHub.