import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import { Home, Users, ClipboardList, FileText, Settings, LogOut } from 'lucide-react';
import logo from '../../assets/logo.png';

const menuItems = [
  { path: '/', labelKey: 'sidebar.home', Icon: Home, roles: ['doctor', 'assistant', 'secretary'] },
  { path: '/pacientes', labelKey: 'sidebar.patients', Icon: Users, roles: ['doctor', 'assistant', 'secretary'] },
  { path: '/evaluaciones', labelKey: 'sidebar.evaluations', Icon: ClipboardList, roles: ['doctor', 'assistant'] },
  { path: '/informes', labelKey: 'sidebar.reports', Icon: FileText, roles: ['doctor'] },
  { path: '/usuarios', labelKey: 'sidebar.users', Icon: Settings, roles: ['doctor'] }
];

export default function Sidebar() {
  const { user, role, logout } = useAuth();
  const { t } = useLanguage();

  const visibleItems = menuItems.filter((item) => item.roles.includes(role));

  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      backgroundColor: 'var(--color-sidebar-bg)',
      color: 'var(--color-sidebar-text)',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      transition: 'var(--transition-theme)',
      boxShadow: '2px 0 8px rgba(0,0,0,0.15)'
    }}>
      {/* Logo */}
      <div style={{
        padding: 'var(--space-lg) var(--space-lg) var(--space-md)',
        textAlign: 'center'
      }}>
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-sm)',
          display: 'inline-block',
          marginBottom: 'var(--space-sm)'
        }}>
          <img
            src={logo}
            alt="Neuronita"
            style={{ width: '72px', height: 'auto', display: 'block' }}
          />
        </div>
        <p style={{ fontSize: '11px', color: 'var(--color-sidebar-text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>
          {t('sidebar.system')}
        </p>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--color-sidebar-border)', margin: '0 var(--space-md)' }} />

      {/* Navigation */}
      <nav style={{ flex: 1, padding: 'var(--space-md) 0' }}>
        {visibleItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-md)',
              padding: '10px var(--space-lg)',
              margin: '2px var(--space-sm)',
              color: isActive ? '#FFFFFF' : 'var(--color-sidebar-text)',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: isActive ? 600 : 400,
              backgroundColor: isActive ? 'var(--color-sidebar-active)' : 'transparent',
              borderRadius: 'var(--radius-sm)',
              borderLeft: isActive ? '3px solid var(--color-accent)' : '3px solid transparent',
              transition: 'all 0.2s',
              opacity: isActive ? 1 : 0.85
            })}
            onMouseEnter={(e) => {
              if (!e.currentTarget.classList.contains('active')) {
                e.currentTarget.style.backgroundColor = 'var(--color-sidebar-hover)';
                e.currentTarget.style.opacity = '1';
              }
            }}
            onMouseLeave={(e) => {
              const isActive = e.currentTarget.getAttribute('aria-current') === 'page';
              if (!isActive) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.opacity = '0.85';
              }
            }}
          >
            <item.Icon size={18} strokeWidth={2} />
            <span>{t(item.labelKey)}</span>
          </NavLink>
        ))}
      </nav>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--color-sidebar-border)', margin: '0 var(--space-md)' }} />

      {/* User + Logout */}
      <div style={{ padding: 'var(--space-md) var(--space-lg)' }}>
        {user && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)',
            marginBottom: 'var(--space-md)',
            padding: 'var(--space-sm)',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'rgba(255,255,255,0.08)'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-accent)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              fontWeight: 600,
              flexShrink: 0
            }}>
              {user.firstName ? user.firstName[0].toUpperCase() : 'U'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.firstName} {user.lastName}
              </div>
              <div style={{ fontSize: '11px', opacity: 0.6 }}>
                {t(`role.${user.role}`)}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          style={{
            width: '100%',
            padding: 'var(--space-sm) var(--space-md)',
            backgroundColor: 'rgba(255,255,255,0.1)',
            color: 'var(--color-sidebar-text)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontSize: '13px',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-sm)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
          }}
        >
          <LogOut size={15} />
          {t('sidebar.logout')}
        </button>
      </div>
    </aside>
  );
}

