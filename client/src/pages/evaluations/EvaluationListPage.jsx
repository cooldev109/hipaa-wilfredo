import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { listEvaluationsApi, createEvaluationApi } from '../../services/evaluationService';
import PatientPicker from '../../components/forms/PatientPicker';
import { Plus, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import dayjs from 'dayjs';

export default function EvaluationListPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [evaluations, setEvaluations] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ patientId: searchParams.get('patientId') || '', evaluationDate: dayjs().format('YYYY-MM-DD') });
  const [error, setError] = useState('');

  const loadEvaluations = async (page = 1) => {
    setLoading(true);
    try {
      const data = await listEvaluationsApi({ status: statusFilter || undefined, page, limit: 25 });
      if (data.success) {
        setEvaluations(data.data.evaluations);
        setPagination(data.data.pagination);
      }
    } catch {
      setEvaluations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEvaluations(); }, [statusFilter]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    if (!createForm.patientId || !createForm.evaluationDate) {
      setError(t('eval.requiredFields'));
      return;
    }
    try {
      const data = await createEvaluationApi(createForm.patientId, createForm.evaluationDate);
      if (data.success) {
        navigate(`/evaluaciones/${data.data.id}`);
      }
    } catch (err) {
      setError(err.response?.data?.errorCode || t('error.server'));
    }
  };

  const statusColors = {
    draft: { bg: 'var(--color-warning-bg)', color: 'var(--color-warning)', border: 'var(--color-warning)' },
    complete: { bg: 'var(--color-info-bg)', color: 'var(--color-info)', border: 'var(--color-info)' },
    signed: { bg: 'var(--color-success-bg)', color: 'var(--color-success)', border: 'var(--color-success)' }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
        <div>
          <h1>{t('evaluations.title')}</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginTop: '2px' }}>
            {pagination.total} {t('evaluations.total')}
          </p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} style={primaryBtnStyle}>
          <Plus size={16} /> {t('evaluations.new')}
        </button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
          <h3 style={{ marginBottom: 'var(--space-md)' }}>{t('evaluations.new')}</h3>
          {error && <div style={{ padding: 'var(--space-sm)', backgroundColor: 'var(--color-error-bg)', color: 'var(--color-error)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-md)', fontSize: 'var(--text-sm)' }}>{error}</div>}
          <form onSubmit={handleCreate} style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label>{t('evaluations.patient')}</label>
              <PatientPicker value={createForm.patientId} onChange={(id) => setCreateForm({ ...createForm, patientId: id })} />
            </div>
            <div style={{ width: '200px' }}>
              <label>{t('evaluations.date')}</label>
              <input type="date" value={createForm.evaluationDate} onChange={(e) => setCreateForm({ ...createForm, evaluationDate: e.target.value })} required />
            </div>
            <button type="submit" style={primaryBtnStyle}>{t('common.create')}</button>
            <button type="button" onClick={() => setShowCreate(false)} style={secondaryBtnStyle}>{t('common.cancel')}</button>
          </form>
        </div>
      )}

      {/* Filter */}
      <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
        {['', 'draft', 'complete', 'signed'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            style={{
              padding: '4px 14px',
              borderRadius: 'var(--radius-full)',
              border: statusFilter === s ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
              backgroundColor: statusFilter === s ? 'var(--color-primary)' : 'var(--color-surface)',
              color: statusFilter === s ? 'var(--color-text-on-primary)' : 'var(--color-text)',
              fontSize: 'var(--text-sm)',
              cursor: 'pointer'
            }}
          >
            {s ? t(`status.${s}`) : t('evaluations.all')}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-primary)' }}>
              <th style={thStyle}>{t('evaluations.patient')}</th>
              <th style={thStyle}>{t('evaluations.date')}</th>
              <th style={thStyle}>{t('evaluations.status')}</th>
              <th style={thStyle}>{t('evaluations.lastSaved')}</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>{t('evaluations.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ ...tdStyle, textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--color-text-muted)' }}>{t('common.loading')}</td></tr>
            ) : evaluations.length === 0 ? (
              <tr><td colSpan="5" style={{ ...tdStyle, textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--color-text-muted)' }}>{t('evaluations.noResults')}</td></tr>
            ) : evaluations.map((ev, i) => {
              const sc = statusColors[ev.status] || statusColors.draft;
              return (
                <tr key={ev.id} style={{ backgroundColor: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-surface-alt)', cursor: 'pointer' }} onClick={() => navigate(`/evaluaciones/${ev.id}`)}>
                  <td style={{ ...tdStyle, fontWeight: 500 }}>{ev.patientLastName}, {ev.patientFirstName}</td>
                  <td style={tdStyle}>{dayjs(ev.evaluationDate).format('DD/MM/YYYY')}</td>
                  <td style={tdStyle}>
                    <span style={{ padding: '2px 10px', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', fontWeight: 500, backgroundColor: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                      {t(`status.${ev.status}`)}
                    </span>
                  </td>
                  <td style={tdStyle}>{ev.lastAutoSavedAt ? dayjs(ev.lastAutoSavedAt).format('DD/MM HH:mm') : '—'}</td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <button onClick={(e) => { e.stopPropagation(); navigate(`/evaluaciones/${ev.id}`); }} style={{ padding: '4px 10px', backgroundColor: 'transparent', color: 'var(--color-primary)', border: '1px solid var(--color-primary)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: 'var(--text-xs)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Eye size={12} /> {t('evaluations.open')}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-md)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
          <span>{t('common.showing')} {((pagination.page - 1) * 25) + 1}–{Math.min(pagination.page * 25, pagination.total)} {t('common.of')} {pagination.total}</span>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <button disabled={pagination.page <= 1} onClick={() => loadEvaluations(pagination.page - 1)} style={pagBtnStyle}><ChevronLeft size={14} /></button>
            <span style={{ padding: '4px 8px' }}>{pagination.page} / {pagination.totalPages}</span>
            <button disabled={pagination.page >= pagination.totalPages} onClick={() => loadEvaluations(pagination.page + 1)} style={pagBtnStyle}><ChevronRight size={14} /></button>
          </div>
        </div>
      )}
    </div>
  );
}

const thStyle = { padding: '10px 16px', textAlign: 'left', color: '#FFFFFF', fontSize: 'var(--text-sm)', fontWeight: 600 };
const tdStyle = { padding: '10px 16px', fontSize: 'var(--text-base)', borderBottom: '1px solid var(--color-border)' };
const primaryBtnStyle = { display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', padding: 'var(--space-sm) var(--space-md)', backgroundColor: 'var(--color-primary)', color: 'var(--color-text-on-primary)', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: 'var(--text-base)', fontWeight: 500 };
const secondaryBtnStyle = { padding: 'var(--space-sm) var(--space-md)', backgroundColor: 'transparent', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: 'var(--text-base)' };
const pagBtnStyle = { padding: '4px 8px', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', display: 'flex', alignItems: 'center' };
