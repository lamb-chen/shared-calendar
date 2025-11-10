const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// In-memory user store (replace with database in production)
const users = new Map();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = users.get(id);
  done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    scope: [
      'profile',
      'email',
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/calendar.events'
    ]
  },
  (accessToken, refreshToken, profile, done) => {
    // Store or update user
    const user = {
      id: profile.id,
      email: profile.emails[0].value,
      displayName: profile.displayName,
      accessToken: accessToken,
      refreshToken: refreshToken,
      sharedWith: [] // List of user IDs this user shares calendar with
    };
    
    users.set(profile.id, user);
    return done(null, user);
  }
));

module.exports = { users };
