const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const {
  getBusyBlocks,
  getSharedCalendars,
  getUsers,
  shareCalendar,
  unshareCalendar,
  createMeetingInvite
} = require('../controllers/calendarController');

// All routes require authentication
router.use(isAuthenticated);

// Get current user's busy blocks
router.get('/busy-blocks', getBusyBlocks);

// Get shared calendars from other users
router.get('/shared', getSharedCalendars);

// Get list of all users
router.get('/users', getUsers);

// Share calendar with a user
router.post('/share', shareCalendar);

// Unshare calendar with a user
router.post('/unshare', unshareCalendar);

// Create a meeting invitation
router.post('/invite', createMeetingInvite);

module.exports = router;
