import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useState } from 'react';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        marginLeft: sidebarOpen ? '260px' : '72px',
        width: sidebarOpen ? 'calc(100% - 260px)' : 'calc(100% - 72px)',
        transition: 'margin-left 0.3s ease, width 0.3s ease',
        minHeight: '100vh',
      }}>
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main style={{
          flex: 1,
          padding: '2rem',
          maxWidth: '1400px',
          width: '100%',
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
