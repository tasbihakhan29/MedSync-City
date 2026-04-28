import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const adminNav = [
  { label: 'Dashboard', icon: '⊞', path: '/admin/dashboard' },
  { label: 'Registrations', icon: '🏥', path: '/admin/registrations' },
  { label: 'Medicines', icon: '💊', path: '/admin/medicines' },
  { label: 'Institutions', icon: '🏛', path: '/admin/institutions' },
  { label: 'Audit Logs', icon: '📋', path: '/admin/audit-logs' },
];

const hospitalNav = [
  { label: 'Dashboard', icon: '⊞', path: '/hospital/dashboard' },
  { label: 'Inventory', icon: '📦', path: '/hospital/inventory' },
  { label: 'Expiry Alerts', icon: '⚠', path: '/hospital/expiry' },
  { label: 'Medicine Search', icon: '🔍', path: '/hospital/search' },
  { label: 'Requests', icon: '🔄', path: '/hospital/requests' },
];

const pageNames = {
  '/admin/dashboard': 'City Admin Dashboard',
  '/admin/registrations': 'Registrations',
  '/admin/medicines': 'Medicine Approvals',
  '/admin/institutions': 'Institutions',
  '/admin/audit-logs': 'Audit Logs',
  '/hospital/dashboard': 'Dashboard',
  '/hospital/inventory': 'Inventory',
  '/hospital/expiry': 'Expiry Alerts',
  '/hospital/search': 'Medicine Search',
  '/hospital/requests': 'Requests',
};

export default function Layout({ role }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  let navItems;
  if (role === 'admin') {
    navItems = adminNav;
  } else {
    navItems = hospitalNav;
  }

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const initials = user?.institutionName
    ? user.institutionName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
    : 'U';

  const roleLabel = {
    CITY_ADMIN: 'City Admin',
    HOSPITAL: 'Hospital',
    PHARMACY: 'Pharmacy',
  }[user?.role] || user?.role;

  const pageName = pageNames[location.pathname] || 'Dashboard';

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-brand">
          <div className="brand-logo">
            <div className="brand-icon"></div>
            {sidebarOpen && <div className="brand-name">MedSync City</div>}
          </div>
        </div>

        <nav className="sidebar-nav">
          {sidebarOpen && <div className="nav-section-label">Navigation</div>}
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              title={!sidebarOpen ? item.label : ''}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon" style={{ fontSize: 18 }}>{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar">{initials}</div>
            {sidebarOpen && (
              <div className="user-info">
                <div className="user-name">{user?.institutionName || user?.username}</div>
                <div className="user-role">{roleLabel}</div>
              </div>
            )}
            <button className="logout-btn" onClick={handleLogout} title="Logout">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {/* Topbar */}
        <div className="topbar">
          <div className="topbar-left">
            <button 
              className="sidebar-toggle" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <div className="topbar-title">{pageName}</div>
          </div>
          <div className="topbar-actions">
            <span className="topbar-institution">{user?.institutionName || 'User'}</span>
            <button className="topbar-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        <div className="page-content fade-in">
          <Outlet />
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}
