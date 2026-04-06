import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { listPatientsApi } from '../../services/patientService';
import { Search, Plus, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import dayjs from 'dayjs';

export default function PatientListPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const loadPatients = async (page = 1) => {
    setLoading(true);
    try {
      const data = await listPatientsApi({ search, page, limit: 25 });
      if (data.success) {
        setPatients(data.data.patients);
        setPagination(data.data.pagination);
      }
    } catch {
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, [search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const formatAge = (age) => {
    if (!age) return '—';
    return `${age.years}a ${age.months}m`;
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
        <div>
          <h1>{t('patients.title')}</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginTop: '2px' }}>
            {pagination.total} {t('patients.total')}
          </p>
        </div>
        <button
          onClick={() => navigate('/pacientes/nuevo')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)',
            padding: 'var(--space-sm) var(--space-md)',
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-text-on-primary)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontSize: 'var(--text-base)',
            fontWeight: 500
          }}
        >
          <Plus size={16} />
          {t('patients.new')}
        </button>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} style={{
        display: 'flex',
        gap: 'var(--space-sm)',
        marginBottom: 'var(--space-lg)'
      }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t('patients.search')}
            style={{ paddingLeft: '36px' }}
          />
        </div>
        <button type="submit" style={{
          padding: 'var(--space-sm) var(--space-lg)',
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-text-on-primary)',
          border: 'none',
          borderRadius: 'var(--radius-sm)',
          cursor: 'pointer',
          fontSize: 'var(--text-base)'
        }}>
          {t('common.search')}
        </button>
      </form>

      {/* Table */}
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
              <th style={thStyle}>{t('patients.name')}</th>
              <th style={thStyle}>{t('patients.age')}</th>
              <th style={thStyle}>{t('patients.sex')}</th>
              <th style={thStyle}>{t('patients.school')}</th>
              <th style={thStyle}>{t('patients.grade')}</th>
              <th style={thStyle}>{t('patients.referredBy')}</th>
              <th style={thStyle}>{t('patients.createdAt')}</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>{t('patients.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ ...tdStyle, textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--color-text-muted)' }}>
                  {t('common.loading')}
                </td>
              </tr>
            ) : patients.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ ...tdStyle, textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--color-text-muted)' }}>
                  {t('patients.noResults')}
                </td>
              </tr>
            ) : (
              patients.map((patient, i) => (
                <tr
                  key={patient.id}
                  style={{
                    backgroundColor: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-surface-alt)',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s'
                  }}
                  onClick={() => navigate(`/pacientes/${patient.id}`)}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-surface-alt)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-surface-alt)'; }}
                >
                  <td style={{ ...tdStyle, fontWeight: 500 }}>
                    {patient.lastName}, {patient.firstName}
                  </td>
                  <td style={tdStyle}>{formatAge(patient.age)}</td>
                  <td style={tdStyle}>{patient.sex}</td>
                  <td style={tdStyle}>{patient.school || '—'}</td>
                  <td style={tdStyle}>{patient.grade || '—'}</td>
                  <td style={tdStyle}>{patient.referredBy || '—'}</td>
                  <td style={tdStyle}>{dayjs(patient.createdAt).format('DD/MM/YYYY')}</td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/pacientes/${patient.id}`); }}
                      style={{
                        padding: '4px 10px',
                        backgroundColor: 'transparent',
                        color: 'var(--color-primary)',
                        border: '1px solid var(--color-primary)',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        fontSize: 'var(--text-xs)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Eye size={12} />
                      {t('patients.view')}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 'var(--space-md)',
          fontSize: 'var(--text-sm)',
          color: 'var(--color-text-secondary)'
        }}>
          <span>
            {t('common.showing')} {((pagination.page - 1) * 25) + 1}–{Math.min(pagination.page * 25, pagination.total)} {t('common.of')} {pagination.total}
          </span>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <button
              disabled={pagination.page <= 1}
              onClick={() => loadPatients(pagination.page - 1)}
              style={paginationBtnStyle}
            >
              <ChevronLeft size={14} />
            </button>
            <span style={{ padding: '4px 8px' }}>{pagination.page} / {pagination.totalPages}</span>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => loadPatients(pagination.page + 1)}
              style={paginationBtnStyle}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const thStyle = {
  padding: '10px 16px',
  textAlign: 'left',
  color: '#FFFFFF',
  fontSize: 'var(--text-sm)',
  fontWeight: 600
};

const tdStyle = {
  padding: '10px 16px',
  fontSize: 'var(--text-base)',
  borderBottom: '1px solid var(--color-border)'
};

const paginationBtnStyle = {
  padding: '4px 8px',
  backgroundColor: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center'
};
