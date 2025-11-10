import React, { useState } from 'react';
import './MeetingInvite.css';
import { createMeetingInvite } from '../services/api';

function MeetingInvite({ slot, users, onClose, onInviteCreated }) {
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAttendees, setSelectedAttendees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAttendeeToggle = (email) => {
    if (selectedAttendees.includes(email)) {
      setSelectedAttendees(selectedAttendees.filter(e => e !== email));
    } else {
      setSelectedAttendees([...selectedAttendees, email]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!summary.trim()) {
      setError('Meeting title is required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await createMeetingInvite({
        summary: summary,
        description: description,
        start: slot.start.toISOString(),
        end: slot.end.toISOString(),
        attendees: selectedAttendees
      });

      onInviteCreated();
    } catch (err) {
      console.error('Error creating invite:', err);
      setError('Failed to create meeting invitation. Please try again.');
      setLoading(false);
    }
  };

  const formatDateTime = (date) => {
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content invite-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create Meeting Invitation</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="error-message">{error}</div>}
            
            <div className="time-display">
              <div className="time-info">
                <strong>📅 Start:</strong> {formatDateTime(slot.start)}
              </div>
              <div className="time-info">
                <strong>🕐 End:</strong> {formatDateTime(slot.end)}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="summary">Meeting Title *</label>
              <input
                type="text"
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="e.g., Team Sync Meeting"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description (optional)</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add meeting details, agenda, or notes..."
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Invite Attendees</label>
              {users.length === 0 ? (
                <p className="no-attendees">No users available to invite</p>
              ) : (
                <div className="attendees-list">
                  {users.map(user => (
                    <label key={user.id} className="attendee-item">
                      <input
                        type="checkbox"
                        checked={selectedAttendees.includes(user.email)}
                        onChange={() => handleAttendeeToggle(user.email)}
                      />
                      <div className="attendee-info">
                        <span className="attendee-name">{user.displayName}</span>
                        <span className="attendee-email">{user.email}</span>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Invitation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MeetingInvite;
