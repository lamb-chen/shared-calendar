import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication
export const checkAuthStatus = () => api.get('/auth/status');
export const logout = () => api.get('/auth/logout');

// Calendar
export const getBusyBlocks = () => api.get('/api/calendar/busy-blocks');
export const getSharedCalendars = () => api.get('/api/calendar/shared');
export const getUsers = () => api.get('/api/calendar/users');
export const shareCalendar = (targetUserId) => api.post('/api/calendar/share', { targetUserId });
export const unshareCalendar = (targetUserId) => api.post('/api/calendar/unshare', { targetUserId });
export const createMeetingInvite = (eventData) => api.post('/api/calendar/invite', eventData);

export default api;
