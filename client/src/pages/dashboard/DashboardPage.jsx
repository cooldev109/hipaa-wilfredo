import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import { Users, ClipboardList, FileText, UserPlus, FilePlus, BarChart3, UserCog, Inbox, ChevronRight } from 'lucide-react';
import api from '../../services/api';
import dayjs from 'dayjs';

export default function DashboardPage() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalPatients: 0, evaluationsThisMonth: 0, pendingReports: 0 });

  useEffect(() => {
    api.get('/dashboard/stats').then((res) => {
      if (res.data.success) setStats(res.data.data);
    }).catch(() => {});
  }, []);

  const greeting = getGreeting(language);
  const today = dayjs().format(language === 'es' ? 'dddd, D [de] MMMM [de] YYYY' : 'dddd, MMMM D, YYYY');

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-xl) var(--space-2xl)',
        color: 'var(--color-text-on-primary)',
        marginBottom: 'var(--space-xl)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          right: '60px',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)'
        }} />
        <p style={{ fontSize: '13px', opacity: 0.85, marginBottom: '4px' }}>{greeting}</p>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: 'var(--color-text-on-primary)', margin: '0 0 4px' }}>
          {user?.firstName} {user?.lastName}
        </h1>
        <p style={{ fontSize: '13px', opacity: 0.75 }}>
          {t(`role.${user?.role}`)} — Neuronita EVF
        </p>
        <p style={{ fontSize: '12px', opacity: 0.6, marginTop: 'var(--space-sm)' }}>
          {today}
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 'var(--space-lg)',
        marginBottom: 'var(--space-xl)'
      }}>
        <StatCard
          icon={<Users size={22} />}
          label={t('dashboard.patients')}
          value={stats.totalPatients}
          color="var(--color-primary)"
        />
        <StatCard
          icon={<ClipboardList size={22} />}
          label={t('dashboard.evaluations')}
          value={stats.evaluationsThisMonth}
          color="var(--color-accent)"
        />
        <StatCard
          icon={<FileText size={22} />}
          label={t('dashboard.reports')}
          value={stats.pendingReports}
          color="var(--color-warning)"
        />
      </div>

      {/* Two-column layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'var(--space-lg)'
      }}>
        {/* Quick Actions */}
        <div style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          padding: 'var(--space-lg)',
          transition: 'var(--transition-theme)'
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: 'var(--space-lg)' }}>
            {t('dashboard.quickActions')}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            <QuickAction
              icon={<UserPlus size={20} />}
              label={t('patients.new')}
              description={t('dashboard.newPatientDesc')}
              onClick={() => navigate('/pacientes')}
            />
            <QuickAction
              icon={<FilePlus size={20} />}
              label={t('evaluations.new')}
              description={t('dashboard.newEvalDesc')}
              onClick={() => navigate('/evaluaciones')}
            />
            <QuickAction
              icon={<BarChart3 size={20} />}
              label={t('reports.generate')}
              description={t('dashboard.generateReportDesc')}
              onClick={() => navigate('/informes')}
            />
            {user?.role === 'doctor' && (
              <QuickAction
                icon={<UserCog size={20} />}
                label={t('users.new')}
                description={t('dashboard.newUserDesc')}
                onClick={() => navigate('/usuarios')}
              />
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          padding: 'var(--space-lg)',
          transition: 'var(--transition-theme)'
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: 'var(--space-lg)' }}>
            {t('dashboard.recentActivity')}
          </h2>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '200px',
            color: 'var(--color-text-muted)',
            fontSize: '13px'
          }}>
            <Inbox size={32} strokeWidth={1.5} style={{ marginBottom: 'var(--space-sm)' }} />
            {t('dashboard.noActivity')}
          </div>
        </div>
      </div>

      {/* System Info */}
      <div style={{
        marginTop: 'var(--space-xl)',
        padding: 'var(--space-md) var(--space-lg)',
        backgroundColor: 'var(--color-surface-alt)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '12px',
        color: 'var(--color-text-muted)',
        transition: 'var(--transition-theme)'
      }}>
        <span>Neuronita EVF v1.0.0</span>
        <span>HIPAA Compliant</span>
        <span>{t('dashboard.lastLogin')}: {user?.lastLoginAt ? dayjs(user.lastLoginAt).format('DD/MM/YYYY HH:mm') : '—'}</span>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div style={{
      backgroundColor: 'var(--color-surface)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-lg)',
      boxShadow: 'var(--shadow-sm)',
      border: '1px solid var(--color-border)',
      transition: 'var(--transition-theme)',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 'var(--space-md)'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: 'var(--radius-md)',
        backgroundColor: `${color}15`,
        color: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        {icon}
      </div>
      <div>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', fontWeight: 500 }}>
          {label}
        </p>
        <p style={{ fontSize: '28px', fontWeight: 700, color, marginTop: '2px', lineHeight: 1 }}>
          {value}
        </p>
      </div>
    </div>
  );
}

function QuickAction({ icon, label, description, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-md)',
        padding: 'var(--space-md)',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
        transition: 'all 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--color-surface-alt)';
        e.currentTarget.style.borderColor = 'var(--color-primary)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--color-surface)';
        e.currentTarget.style.borderColor = 'var(--color-border)';
      }}
    >
      <span style={{ flexShrink: 0, color: 'var(--color-primary)' }}>{icon}</span>
      <div>
        <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text)' }}>{label}</div>
        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>{description}</div>
      </div>
      <ChevronRight size={16} style={{ marginLeft: 'auto', color: 'var(--color-text-muted)' }} />
    </button>
  );
}

function getGreeting(language) {
  const hour = new Date().getHours();
  if (language === 'es') {
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  }
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}
