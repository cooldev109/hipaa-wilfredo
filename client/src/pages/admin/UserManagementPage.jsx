import { useState, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { listUsersApi, createUserApi, deactivateUserApi } from '../../services/userService';
import dayjs from 'dayjs';

export default function UserManagementPage() {
  const { t } = useLanguage();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'assistant',
    licenseNumber: ''
  });

  const loadUsers = async () => {
    try {
      const data = await listUsersApi();
      if (data.success) setUsers(data.data);
    } catch {
      setError(t('error.server'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await createUserApi(form);
      setSuccess(t('success.created'));
      setShowCreate(false);
      setForm({ email: '', password: '', firstName: '', lastName: '', role: 'assistant', licenseNumber: '' });
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.error || t('error.server'));
    }
  };

  const handleDeactivate = async (id, name) => {
    if (!window.confirm(`${t('users.confirmDeactivate')}\n\n${name}`)) return;

    setError('');
    try {
      await deactivateUserApi(id);
      setSuccess(t('success.updated'));
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.error || t('error.server'));
    }
  };

  const roleLabels = { doctor: t('role.doctor'), assistant: t('role.assistant'), secretary: t('role.secretary') };

  if (loading) {
    return <div style={{ color: 'var(--color-text-secondary)' }}>{t('common.loading')}</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
        <h1>{t('users.title')}</h1>
        <button
          onClick={() => setShowCreate(!showCreate)}
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-text-on-primary)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500
          }}
        >
          + {t('users.new')}
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div style={{ padding: 'var(--space-sm) var(--space-md)', backgroundColor: 'var(--color-error-bg)', color: 'var(--color-error)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-md)', fontSize: '13px' }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ padding: 'var(--space-sm) var(--space-md)', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-md)', fontSize: '13px' }}>
          {success}
        </div>
      )}

      {/* Create User Form */}
      {showCreate && (
        <div style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-lg)',
          marginBottom: 'var(--space-lg)',
          transition: 'var(--transition-theme)'
        }}>
          <h3 style={{ marginBottom: 'var(--space-md)' }}>{t('users.createTitle')}</h3>
          <form onSubmit={handleCreate}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
              <div>
                <label>{t('users.firstName')}</label>
                <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
              </div>
              <div>
                <label>{t('users.lastName')}</label>
                <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
              </div>
              <div>
                <label>{t('users.email')}</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div>
                <label>{t('users.password')}</label>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} />
              </div>
              <div>
                <label>{t('users.role')}</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="doctor">{t('role.doctor')}</option>
                  <option value="assistant">{t('role.assistant')}</option>
                  <option value="secretary">{t('role.secretary')}</option>
                </select>
              </div>
              <div>
                <label>{t('users.licenseNumber')}</label>
                <input value={form.licenseNumber} onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-lg)' }}>
              <button type="submit" style={{
                padding: 'var(--space-sm) var(--space-lg)',
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-text-on-primary)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontSize: '14px'
              }}>
                {t('common.create')}
              </button>
              <button type="button" onClick={() => setShowCreate(false)} style={{
                padding: 'var(--space-sm) var(--space-lg)',
                backgroundColor: 'transparent',
                color: 'var(--color-text)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontSize: '14px'
              }}>
                {t('common.cancel')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)',
        overflow: 'hidden',
        transition: 'var(--transition-theme)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-primary)' }}>
              <th style={thStyle}>{t('users.name')}</th>
              <th style={thStyle}>{t('users.email')}</th>
              <th style={thStyle}>{t('users.role')}</th>
              <th style={thStyle}>{t('users.status')}</th>
              <th style={thStyle}>{t('users.lastLogin')}</th>
              <th style={thStyle}>{t('users.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr key={user.id} style={{ backgroundColor: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-surface-alt)' }}>
                <td style={tdStyle}>{user.firstName} {user.lastName}</td>
                <td style={tdStyle}>{user.email}</td>
                <td style={tdStyle}>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '12px',
                    fontWeight: 500,
                    backgroundColor: user.role === 'doctor' ? 'var(--color-primary)' : user.role === 'assistant' ? 'var(--color-accent)' : 'var(--color-secondary)',
                    color: 'var(--color-text-on-primary)'
                  }}>
                    {roleLabels[user.role] || user.role}
                  </span>
                </td>
                <td style={tdStyle}>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '12px',
                    backgroundColor: user.isActive ? 'var(--color-success-bg)' : 'var(--color-error-bg)',
                    color: user.isActive ? 'var(--color-success)' : 'var(--color-error)',
                    border: `1px solid ${user.isActive ? 'var(--color-success)' : 'var(--color-error)'}`
                  }}>
                    {user.isActive ? t('status.active') : t('status.inactive')}
                  </span>
                </td>
                <td style={tdStyle}>
                  {user.lastLoginAt ? dayjs(user.lastLoginAt).format('DD/MM/YYYY HH:mm') : '—'}
                </td>
                <td style={tdStyle}>
                  {user.isActive && (
                    <button
                      onClick={() => handleDeactivate(user.id, `${user.firstName} ${user.lastName}`)}
                      style={{
                        padding: '2px 8px',
                        backgroundColor: 'transparent',
                        color: 'var(--color-error)',
                        border: '1px solid var(--color-error)',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      {t('users.deactivate')}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div style={{ textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--color-text-secondary)' }}>
            {t('common.noData')}
          </div>
        )}
      </div>
    </div>
  );
}

const thStyle = {
  padding: '10px 16px',
  textAlign: 'left',
  color: '#FFFFFF',
  fontSize: '13px',
  fontWeight: 600
};

const tdStyle = {
  padding: '10px 16px',
  fontSize: '14px',
  borderBottom: '1px solid var(--color-border)'
};
