import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import { changePasswordApi } from '../../services/authService';
import logo from '../../assets/logo.png';

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError(t('changePassword.mismatch'));
      return;
    }

    if (newPassword.length < 6) {
      setError(t('changePassword.tooShort'));
      return;
    }

    setLoading(true);
    try {
      await changePasswordApi(oldPassword, newPassword);
      await logout();
      navigate('/login');
    } catch (err) {
      const errorCode = err.response?.data?.errorCode;
      const errorMap = {
        PASSWORD_REQUIRED: t('changePassword.required'),
        PASSWORD_TOO_SHORT: t('changePassword.tooShort'),
        WRONG_CURRENT_PASSWORD: t('changePassword.wrongCurrent')
      };
      setError(errorMap[errorCode] || t('error.server'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--color-login-bg)',
      transition: 'var(--transition-theme)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        padding: 'var(--space-2xl)',
        backgroundColor: 'var(--color-login-card)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        textAlign: 'center',
        border: '1px solid var(--color-border)',
        transition: 'var(--transition-theme)'
      }}>
        <img
          src={logo}
          alt="Neuronita"
          style={{ width: '80px', height: 'auto', margin: '0 auto var(--space-md)', display: 'block' }}
        />
        <h2 style={{ marginBottom: 'var(--space-xs)' }}>{t('changePassword.title')}</h2>
        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)' }}>
          {t('changePassword.subtitle')}
        </p>

        {error && (
          <div style={{
            padding: 'var(--space-sm) var(--space-md)',
            backgroundColor: 'var(--color-error-bg)',
            color: 'var(--color-error)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '13px',
            marginBottom: 'var(--space-md)',
            textAlign: 'left'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <label htmlFor="oldPassword">{t('changePassword.current')}</label>
            <input
              id="oldPassword"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <div style={{ marginBottom: 'var(--space-md)' }}>
            <label htmlFor="newPassword">{t('changePassword.new')}</label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              {t('changePassword.requirements')}
            </p>
          </div>

          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <label htmlFor="confirmPassword">{t('changePassword.confirm')}</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: 'var(--space-sm) var(--space-md)',
              backgroundColor: loading ? 'var(--color-secondary)' : 'var(--color-primary)',
              color: 'var(--color-text-on-primary)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '14px',
              fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? t('common.loading') : t('changePassword.submit')}
          </button>
        </form>
      </div>
    </div>
  );
}
