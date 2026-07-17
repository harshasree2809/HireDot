import { Bell, Menu, LogOut, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [dropOpen, setDropOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}` : 'U';

  return (
    <header style={{
      height: '68px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      borderBottom: '1px solid var(--border)',
      background: 'rgba(13, 21, 38, 0.8)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <button onClick={onMenuClick} style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '8px',
        cursor: 'pointer',
        color: 'var(--text-secondary)',
        display: 'flex',
        alignItems: 'center',
      }}>
        <Menu size={18} />
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '8px',
          cursor: 'pointer',
          color: 'var(--text-secondary)',
          display: 'flex',
          position: 'relative',
        }}>
          <Bell size={18} />
          <span style={{
            position: 'absolute', top: '6px', right: '6px',
            width: '6px', height: '6px',
            background: '#7C3AED', borderRadius: '50%',
          }} />
        </button>

        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setDropOpen(!dropOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              padding: '6px 12px 6px 6px',
              cursor: 'pointer',
              color: 'var(--text-primary)',
            }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.8rem', fontWeight: 700, color: 'white',
            }}>{initials}</div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{user?.firstName} {user?.lastName}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user?.email}</div>
            </div>
            <ChevronDown size={14} color="var(--text-muted)" />
          </button>

          {dropOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0,
              background: 'var(--bg-secondary)', border: '1px solid var(--border)',
              borderRadius: '10px', padding: '0.5rem',
              minWidth: '180px', zIndex: 100,
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            }}>
              <button onClick={handleLogout} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.5rem 0.75rem', borderRadius: '6px',
                background: 'none', border: 'none', color: '#EF4444',
                cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500,
              }}>
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
