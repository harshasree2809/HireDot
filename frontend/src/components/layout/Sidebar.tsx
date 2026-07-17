import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, User, FileText, Target, Briefcase,
  TrendingUp, MessageSquare, KanbanSquare, Bot, ChevronLeft, Zap
} from 'lucide-react';

const navItems = [
  { to: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/app/profile', icon: User, label: 'My Profile' },
  { to: '/app/resume', icon: FileText, label: 'Resume Builder' },
  { to: '/app/ats', icon: Target, label: 'ATS Scanner' },
  { to: '/app/job-match', icon: Briefcase, label: 'Job Match' },
  { to: '/app/skill-gap', icon: TrendingUp, label: 'Skill Gap' },
  { to: '/app/interview', icon: MessageSquare, label: 'Interview Prep' },
  { to: '/app/tracker', icon: KanbanSquare, label: 'App Tracker' },
  { to: '/app/chat', icon: Bot, label: 'AI Coach' },
];

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

export default function Sidebar({ open, onToggle }: SidebarProps) {
  return (
    <aside style={{
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100vh',
      width: open ? '260px' : '72px',
      background: 'rgba(13, 21, 38, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.3s ease',
      zIndex: 100,
      overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{
        padding: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: open ? 'space-between' : 'center',
        borderBottom: '1px solid var(--border)',
        minHeight: '68px',
      }}>
        {open && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Zap size={16} color="white" />
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.125rem', whiteSpace: 'nowrap' }}>
              Hire<span style={{ color: '#7C3AED' }}>Dot</span>
            </span>
          </div>
        )}
        {!open && (
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Zap size={16} color="white" />
          </div>
        )}
        {open && (
          <button onClick={onToggle} style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            padding: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: 'var(--text-secondary)',
          }}>
            <ChevronLeft size={14} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}
            title={!open ? label : undefined}
            style={{ justifyContent: open ? 'flex-start' : 'center' }}
          >
            <Icon size={18} style={{ flexShrink: 0 }} />
            {open && <span style={{ whiteSpace: 'nowrap' }}>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom toggle when closed */}
      {!open && (
        <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border)' }}>
          <button onClick={onToggle} style={{
            width: '100%',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
          }}>
            <ChevronLeft size={14} style={{ transform: 'rotate(180deg)' }} />
          </button>
        </div>
      )}
    </aside>
  );
}
