import { useState } from 'react';
import { useAuth } from '../lib/auth';
import { Icon } from './Icon';

export function Avatar() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  if (!user) return null;
  const initial = (user.name || user.email || '?').charAt(0).toUpperCase();

  return (
    <div className="avatar-wrap">
      <button className="avatar" onClick={() => setOpen((o) => !o)} title={user.email} aria-label="Account">
        {user.avatarUrl ? <img src={user.avatarUrl} alt="" referrerPolicy="no-referrer" /> : initial}
      </button>
      {open && (
        <>
          <div className="menu-backdrop" onClick={() => setOpen(false)} />
          <div className="menu account-menu" role="menu">
            <div className="account-head">
              <div className="avatar large">
                {user.avatarUrl ? <img src={user.avatarUrl} alt="" referrerPolicy="no-referrer" /> : initial}
              </div>
              <div>
                <div className="account-name">{user.name || 'Signed in'}</div>
                <div className="account-email">{user.email}</div>
              </div>
            </div>
            <button className="menu-item" onClick={signOut} role="menuitem">
              <Icon name="logout" size={18} /> Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
