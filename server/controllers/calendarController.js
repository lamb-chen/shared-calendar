const { google } = require('googleapis');
const { users } = require('../config/passport');

// Get user's calendar events as busy blocks (no details)
const getBusyBlocks = async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user.accessToken) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: user.accessToken,
      refresh_token: user.refreshToken
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Get events from the past week to next 4 weeks
    const timeMin = new Date();
    timeMin.setDate(timeMin.getDate() - 7);
    const timeMax = new Date();
    timeMax.setDate(timeMax.getDate() + 28);

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items || [];
    
    // Transform events to busy blocks (hide details)
    const busyBlocks = events.map(event => ({
      id: event.id,
      start: event.start.dateTime || event.start.date,
      end: event.end.dateTime || event.end.date,
      // Only show title if it's a shared event (for now, all are private)
      isBusy: true
    }));

    res.json({ busyBlocks, userId: user.id });
  } catch (error) {
    console.error('Error fetching calendar:', error);
    res.status(500).json({ error: 'Failed to fetch calendar data' });
  }
};

// Get shared calendars from other users
const getSharedCalendars = async (req, res) => {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const sharedCalendars = [];

    // Get calendars from users who are sharing with current user
    for (const [userId, user] of users) {
      if (userId !== currentUser.id && user.sharedWith.includes(currentUser.id)) {
        try {
          const oauth2Client = new google.auth.OAuth2();
          oauth2Client.setCredentials({
            access_token: user.accessToken,
            refresh_token: user.refreshToken
          });

          const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

          const timeMin = new Date();
          timeMin.setDate(timeMin.getDate() - 7);
          const timeMax = new Date();
          timeMax.setDate(timeMax.getDate() + 28);

          const response = await calendar.events.list({
            calendarId: 'primary',
            timeMin: timeMin.toISOString(),
            timeMax: timeMax.toISOString(),
            singleEvents: true,
            orderBy: 'startTime',
          });

          const events = response.data.items || [];
          const busyBlocks = events.map(event => ({
            id: event.id,
            start: event.start.dateTime || event.start.date,
            end: event.end.dateTime || event.end.date,
            isBusy: true
          }));

          sharedCalendars.push({
            userId: user.id,
            displayName: user.displayName,
            email: user.email,
            busyBlocks: busyBlocks
          });
        } catch (error) {
          console.error(`Error fetching calendar for user ${userId}:`, error);
        }
      }
    }

    res.json({ sharedCalendars });
  } catch (error) {
    console.error('Error fetching shared calendars:', error);
    res.status(500).json({ error: 'Failed to fetch shared calendars' });
  }
};

// Get list of all users
const getUsers = (req, res) => {
  const currentUser = req.user;
  const userList = [];

  for (const [userId, user] of users) {
    if (userId !== currentUser.id) {
      userList.push({
        id: user.id,
        displayName: user.displayName,
        email: user.email,
        isSharing: user.sharedWith.includes(currentUser.id)
      });
    }
  }

  res.json({ users: userList });
};

// Share calendar with another user
const shareCalendar = (req, res) => {
  const currentUser = req.user;
  const { targetUserId } = req.body;

  if (!targetUserId) {
    return res.status(400).json({ error: 'Target user ID is required' });
  }

  const targetUser = users.get(targetUserId);
  if (!targetUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Add target user to current user's shared list
  if (!currentUser.sharedWith.includes(targetUserId)) {
    currentUser.sharedWith.push(targetUserId);
    users.set(currentUser.id, currentUser);
  }

  res.json({ message: 'Calendar shared successfully', sharedWith: currentUser.sharedWith });
};

// Unshare calendar with another user
const unshareCalendar = (req, res) => {
  const currentUser = req.user;
  const { targetUserId } = req.body;

  if (!targetUserId) {
    return res.status(400).json({ error: 'Target user ID is required' });
  }

  // Remove target user from current user's shared list
  currentUser.sharedWith = currentUser.sharedWith.filter(id => id !== targetUserId);
  users.set(currentUser.id, currentUser);

  res.json({ message: 'Calendar unshared successfully', sharedWith: currentUser.sharedWith });
};

// Create a meeting invitation
const createMeetingInvite = async (req, res) => {
  try {
    const user = req.user;
    const { summary, description, start, end, attendees } = req.body;

    if (!summary || !start || !end) {
      return res.status(400).json({ error: 'Summary, start, and end times are required' });
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: user.accessToken,
      refresh_token: user.refreshToken
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const event = {
      summary: summary,
      description: description,
      start: {
        dateTime: start,
        timeZone: 'UTC',
      },
      end: {
        dateTime: end,
        timeZone: 'UTC',
      },
      attendees: attendees ? attendees.map(email => ({ email })) : [],
      reminders: {
        useDefault: true,
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      sendUpdates: 'all', // Send invitations to all attendees
    });

    res.json({ 
      message: 'Meeting invitation created successfully',
      event: response.data
    });
  } catch (error) {
    console.error('Error creating meeting:', error);
    res.status(500).json({ error: 'Failed to create meeting invitation' });
  }
};

module.exports = {
  getBusyBlocks,
  getSharedCalendars,
  getUsers,
  shareCalendar,
  unshareCalendar,
  createMeetingInvite
};
