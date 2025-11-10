import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Dashboard.css';
import UserList from './UserList';
import MeetingInvite from './MeetingInvite';
import {
  getBusyBlocks,
  getSharedCalendars,
  getUsers,
  shareCalendar,
  unshareCalendar,
  logout
} from '../services/api';

const localizer = momentLocalizer(moment);

// Color palette for different users
const USER_COLORS = [
  '#667eea', '#764ba2', '#f093fb', '#4facfe',
  '#43e97b', '#fa709a', '#fee140', '#30cfd0'
];

function Dashboard({ user, onLogout }) {
  const [myBusyBlocks, setMyBusyBlocks] = useState([]);
  const [sharedCalendars, setSharedCalendars] = useState([]);
  const [users, setUsers] = useState([]);
  const [showUserList, setShowUserList] = useState(false);
  const [showMeetingInvite, setShowMeetingInvite] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [busyResponse, sharedResponse, usersResponse] = await Promise.all([
        getBusyBlocks(),
        getSharedCalendars(),
        getUsers()
      ]);

      setMyBusyBlocks(busyResponse.data.busyBlocks || []);
      setSharedCalendars(sharedResponse.data.sharedCalendars || []);
      setUsers(usersResponse.data.users || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleShareToggle = async (userId, isCurrentlySharing) => {
    try {
      if (isCurrentlySharing) {
        await unshareCalendar(userId);
      } else {
        await shareCalendar(userId);
      }
      await loadData();
    } catch (error) {
      console.error('Error toggling share:', error);
    }
  };

  const handleSelectSlot = (slotInfo) => {
    setSelectedSlot(slotInfo);
    setShowMeetingInvite(true);
  };

  const handleInviteCreated = () => {
    setShowMeetingInvite(false);
    setSelectedSlot(null);
    loadData();
  };

  // Prepare events for calendar display
  const calendarEvents = [
    // My busy blocks (darker color)
    ...myBusyBlocks.map(block => ({
      title: 'Busy',
      start: new Date(block.start),
      end: new Date(block.end),
      resource: { userId: user.id, userName: 'You', color: '#667eea' }
    })),
    // Shared calendars (different colors)
    ...sharedCalendars.flatMap((calendar, index) =>
      calendar.busyBlocks.map(block => ({
        title: 'Busy',
        start: new Date(block.start),
        end: new Date(block.end),
        resource: {
          userId: calendar.userId,
          userName: calendar.displayName,
          color: USER_COLORS[index % USER_COLORS.length]
        }
      }))
    )
  ];

  const eventStyleGetter = (event) => {
    const style = {
      backgroundColor: event.resource.color,
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block'
    };
    return { style };
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading calendar data...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Shared Calendar</h1>
        <div className="header-actions">
          <span className="user-info">Welcome, {user.displayName}</span>
          <button onClick={() => setShowUserList(true)} className="btn-primary">
            Manage Sharing
          </button>
          <button onClick={handleLogout} className="btn-secondary">
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="legend">
          <h3>Calendar Legend:</h3>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#667eea' }}></div>
            <span>Your Calendar</span>
          </div>
          {sharedCalendars.map((calendar, index) => (
            <div key={calendar.userId} className="legend-item">
              <div 
                className="legend-color" 
                style={{ backgroundColor: USER_COLORS[index % USER_COLORS.length] }}
              ></div>
              <span>{calendar.displayName}</span>
            </div>
          ))}
        </div>

        <div className="calendar-container">
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            eventPropGetter={eventStyleGetter}
            selectable
            onSelectSlot={handleSelectSlot}
            views={['month', 'week', 'day']}
            defaultView="week"
          />
        </div>

        <div className="info-box">
          <h3>ℹ️ How it works:</h3>
          <ul>
            <li>Click "Manage Sharing" to choose who can see your calendar</li>
            <li>All events are shown as "Busy" blocks to protect privacy</li>
            <li>Select a time slot on the calendar to create a meeting invite</li>
            <li>Invitations are sent directly to attendees' calendar platforms</li>
          </ul>
        </div>
      </div>

      {showUserList && (
        <UserList
          users={users}
          onClose={() => setShowUserList(false)}
          onShareToggle={handleShareToggle}
        />
      )}

      {showMeetingInvite && (
        <MeetingInvite
          slot={selectedSlot}
          users={users}
          onClose={() => {
            setShowMeetingInvite(false);
            setSelectedSlot(null);
          }}
          onInviteCreated={handleInviteCreated}
        />
      )}
    </div>
  );
}

export default Dashboard;
