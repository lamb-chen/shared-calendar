# Architecture Documentation

## System Overview

The Shared Calendar application is a full-stack web application that enables users to share their calendar availability while maintaining privacy. The system uses OAuth 2.0 for authentication and integrates with Google Calendar API.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client (React)                           │
│  ┌────────────┐  ┌──────────────┐  ┌────────────────────────┐  │
│  │   Login    │  │  Dashboard   │  │  Calendar Components   │  │
│  │ Component  │  │  Component   │  │  (UserList, Meeting)   │  │
│  └────────────┘  └──────────────┘  └────────────────────────┘  │
│         │                │                      │                │
│         └────────────────┴──────────────────────┘                │
│                          │                                       │
│                   API Service Layer                              │
│                          │                                       │
└──────────────────────────┼───────────────────────────────────────┘
                           │
                    HTTPS/REST API
                           │
┌──────────────────────────┼───────────────────────────────────────┐
│                          │                                       │
│              Express.js Backend Server                           │
│  ┌───────────────────────┴────────────────────────────────┐     │
│  │              Middleware Layer                           │     │
│  │  ┌──────────┐  ┌──────────┐  ┌────────────────────┐  │     │
│  │  │   CORS   │  │   Rate   │  │  Authentication   │  │     │
│  │  │          │  │ Limiting │  │   (Passport.js)   │  │     │
│  │  └──────────┘  └──────────┘  └────────────────────┘  │     │
│  └──────────────────────────────────────────────────────┘     │
│                          │                                       │
│  ┌───────────────────────┴────────────────────────────────┐     │
│  │                 Route Handlers                          │     │
│  │  ┌──────────────────┐    ┌────────────────────────┐   │     │
│  │  │  Auth Routes     │    │   Calendar Routes      │   │     │
│  │  │  /auth/*         │    │   /api/calendar/*      │   │     │
│  │  └──────────────────┘    └────────────────────────┘   │     │
│  └──────────────────────────────────────────────────────┘     │
│                          │                                       │
│  ┌───────────────────────┴────────────────────────────────┐     │
│  │              Controller Layer                           │     │
│  │  ┌──────────────────────────────────────────────────┐  │     │
│  │  │        Calendar Controller                       │  │     │
│  │  │  - getBusyBlocks                                 │  │     │
│  │  │  - getSharedCalendars                            │  │     │
│  │  │  - shareCalendar / unshareCalendar               │  │     │
│  │  │  - createMeetingInvite                           │  │     │
│  │  └──────────────────────────────────────────────────┘  │     │
│  └──────────────────────────────────────────────────────┘     │
│                          │                                       │
└──────────────────────────┼───────────────────────────────────────┘
                           │
                    Google APIs
                           │
┌──────────────────────────┼───────────────────────────────────────┐
│                          │                                       │
│               Google Cloud Platform                              │
│  ┌───────────────────────┴────────────────────────────────┐     │
│  │                                                         │     │
│  │  ┌──────────────────┐    ┌────────────────────────┐   │     │
│  │  │  OAuth 2.0       │    │   Calendar API         │   │     │
│  │  │  Authentication  │    │   - List Events        │   │     │
│  │  │  Service         │    │   - Create Events      │   │     │
│  │  └──────────────────┘    └────────────────────────┘   │     │
│  │                                                         │     │
│  └─────────────────────────────────────────────────────────┘     │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## Component Details

### Frontend (React)

**Technologies:**
- React 18
- React Big Calendar (calendar UI)
- Axios (HTTP client)
- CSS3 (styling)

**Key Components:**

1. **App.js**
   - Root component
   - Manages authentication state
   - Routes between Login and Dashboard

2. **Login Component**
   - OAuth 2.0 login interface
   - Feature showcase
   - Redirects to Google authentication

3. **Dashboard Component**
   - Main application interface
   - Calendar visualization
   - User and event management
   - Color-coded legend

4. **UserList Component**
   - Modal for managing sharing permissions
   - Toggle sharing with individual users
   - Real-time sharing status

5. **MeetingInvite Component**
   - Modal for creating meeting invitations
   - Time slot selection
   - Attendee selection
   - Form validation

### Backend (Node.js + Express)

**Technologies:**
- Express.js (web framework)
- Passport.js (authentication)
- Google APIs (calendar integration)
- express-rate-limit (security)
- express-session (session management)

**Key Modules:**

1. **Server (index.js)**
   - Application initialization
   - Middleware configuration
   - Security setup (rate limiting, CORS)
   - Route registration

2. **Authentication Routes**
   - OAuth flow initiation
   - Callback handling
   - Session management
   - Status checking

3. **Calendar Routes**
   - Protected API endpoints
   - Calendar data operations
   - Sharing management
   - Meeting creation

4. **Controllers**
   - Business logic
   - Google API integration
   - Data transformation
   - Error handling

5. **Middleware**
   - Authentication checks
   - CSRF protection notes
   - Rate limiting
   - Error handling

## Data Flow

### Authentication Flow

```
1. User clicks "Sign in with Google" → Frontend
2. Redirects to /auth/google → Backend
3. Backend initiates OAuth flow → Google
4. User grants permissions → Google
5. Google redirects to callback → Backend
6. Backend creates session → Session Store
7. Redirects to frontend → Frontend
8. Frontend checks auth status → Authenticated
```

### Calendar Sharing Flow

```
1. User opens "Manage Sharing" → Dashboard
2. Requests user list → Backend API
3. Backend returns all users → Frontend
4. User toggles sharing for target user → Frontend
5. POST to /api/calendar/share → Backend
6. Updates in-memory user permissions → Backend
7. Returns updated status → Frontend
8. UI updates to show sharing status → Dashboard
```

### Viewing Shared Calendars Flow

```
1. Dashboard loads → Frontend
2. Parallel API calls:
   - GET /api/calendar/busy-blocks → Own calendar
   - GET /api/calendar/shared → Shared calendars
3. Backend fetches from Google Calendar → For each user
4. Transforms events to busy blocks → Backend
5. Returns sanitized data (no details) → Frontend
6. Displays color-coded calendar → Dashboard
```

### Meeting Invitation Flow

```
1. User selects time slot → Dashboard
2. Opens MeetingInvite modal → Frontend
3. User fills details + attendees → Modal
4. POST to /api/calendar/invite → Backend
5. Creates event via Google API → Google Calendar
6. Sends invitations to attendees → Google
7. Returns success status → Frontend
8. Refreshes calendar view → Dashboard
```

## Security Architecture

### Authentication Security

- **OAuth 2.0**: Industry-standard authentication
- **State Parameter**: CSRF protection in OAuth flow
- **Session Management**: Secure, httpOnly cookies
- **Token Storage**: Access tokens stored server-side only

### API Security

- **Rate Limiting**: 
  - General API: 100 requests / 15 minutes
  - Auth endpoints: 10 requests / 15 minutes
- **Authentication Middleware**: All API routes protected
- **CORS**: Restricted to configured origin
- **Cookie Security**: httpOnly, sameSite flags

### Privacy Protection

- **Data Minimization**: Only busy/free status shared
- **No Event Storage**: Event details never persisted
- **Selective Sharing**: User-controlled permissions
- **Real-time Fetching**: Data fetched on-demand from Google

## Storage Architecture

### Current Implementation (Development)

**In-Memory Storage:**
- User profiles stored in Map object
- Session data in memory
- Sharing permissions in user objects

**Characteristics:**
- Fast access
- No persistence
- Simple implementation
- Data lost on restart

### Production Recommendations

**Database Schema:**

```javascript
// Users Collection/Table
{
  googleId: String (primary key),
  email: String,
  displayName: String,
  accessToken: String (encrypted),
  refreshToken: String (encrypted),
  createdAt: Timestamp,
  updatedAt: Timestamp
}

// Sharing Permissions Collection/Table
{
  userId: String (foreign key),
  sharedWithUserId: String (foreign key),
  createdAt: Timestamp
}

// Sessions Collection/Table
{
  sessionId: String (primary key),
  userId: String (foreign key),
  data: JSON,
  expiresAt: Timestamp
}
```

**Recommended Databases:**
- PostgreSQL (relational, good for permissions)
- MongoDB (document-based, flexible schema)
- Redis (sessions and caching)

## API Endpoints Reference

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /auth/google | Initiate OAuth flow | No |
| GET | /auth/google/callback | OAuth callback | No |
| GET | /auth/status | Check auth status | No |
| GET | /auth/logout | Logout user | Yes |

### Calendar Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/calendar/busy-blocks | Get user's busy times | Yes |
| GET | /api/calendar/shared | Get shared calendars | Yes |
| GET | /api/calendar/users | List all users | Yes |
| POST | /api/calendar/share | Share with user | Yes |
| POST | /api/calendar/unshare | Unshare with user | Yes |
| POST | /api/calendar/invite | Create meeting | Yes |

## Deployment Considerations

### Environment Variables

Required configuration:
- `GOOGLE_CLIENT_ID`: OAuth client ID
- `GOOGLE_CLIENT_SECRET`: OAuth client secret
- `GOOGLE_CALLBACK_URL`: OAuth redirect URI
- `SESSION_SECRET`: Session encryption key
- `CLIENT_URL`: Frontend URL for CORS
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (production/development)

### Scaling Considerations

1. **Session Storage**: Move to Redis for horizontal scaling
2. **Database**: Implement persistent storage
3. **Caching**: Cache calendar data with TTL
4. **Load Balancing**: Multiple server instances
5. **CDN**: Serve static frontend files
6. **Token Refresh**: Implement refresh token logic

### Production Checklist

- [ ] Configure proper OAuth redirect URIs
- [ ] Set strong SESSION_SECRET
- [ ] Enable HTTPS (secure cookies)
- [ ] Implement database storage
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Enable production CORS settings
- [ ] Set up SSL certificates
- [ ] Configure production build
- [ ] Set up error tracking (e.g., Sentry)

## Performance Optimization

### Current Performance

- **Calendar Load**: ~1-2 seconds (depends on Google API)
- **Sharing Toggle**: Instant (in-memory)
- **Meeting Creation**: ~1-2 seconds (Google API call)

### Optimization Strategies

1. **Caching**:
   - Cache calendar data (5-minute TTL)
   - Cache user list
   - Implement Redis for distributed cache

2. **Lazy Loading**:
   - Load calendar data on-demand
   - Paginate user lists for large deployments

3. **Batching**:
   - Batch Google API requests
   - Combine multiple calendar fetches

4. **Frontend Optimization**:
   - Code splitting
   - Lazy load components
   - Optimize bundle size

## Future Architecture Enhancements

1. **Microservices**: Separate auth, calendar, and notification services
2. **WebSockets**: Real-time calendar updates
3. **Message Queue**: Async event processing
4. **Multi-platform**: Support Outlook, Apple Calendar
5. **Mobile Apps**: Native iOS and Android
6. **GraphQL API**: More flexible data fetching
7. **Service Workers**: Offline support
8. **Analytics**: Usage tracking and insights
