import React from 'react';
import './UserList.css';

function UserList({ users, onClose, onShareToggle }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Manage Calendar Sharing</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {users.length === 0 ? (
            <p className="no-users">No other users available. Ask others to sign in!</p>
          ) : (
            <div className="user-list">
              {users.map(user => (
                <div key={user.id} className="user-item">
                  <div className="user-info">
                    <div className="user-name">{user.displayName}</div>
                    <div className="user-email">{user.email}</div>
                  </div>
                  <button
                    className={`share-toggle ${user.isSharing ? 'sharing' : ''}`}
                    onClick={() => onShareToggle(user.id, user.isSharing)}
                  >
                    {user.isSharing ? '✓ Sharing' : 'Share'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <p className="modal-note">
            When you share your calendar with someone, they can see your busy times as blocks,
            but not your event details.
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserList;
